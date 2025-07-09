from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Order, Item, User
from schemas import OrderCreate, Order as OrderSchema, OrderWithDetails
from auth import get_current_user
from models import OrderStatus
from email_utils import send_admin_order_notification, send_user_order_status_notification

router = APIRouter()

@router.post("/", response_model=OrderSchema)
def create_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order."""
    # Check if item exists
    item = db.query(Item).filter(Item.id == order.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check stock availability
    if item.stock_quantity < order.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock"
        )
    
    # Calculate total price
    total_price = item.price * order.quantity
    
    # Create order
    db_order = Order(
        user_id=current_user.id,
        item_id=order.item_id,
        service_type=order.service_type,
        quantity=order.quantity,
        total_price=total_price,
        delivery_address=order.delivery_address,
        scheduled_time=order.scheduled_time,
        mobile_number=order.mobile_number
    )
    
    # Update stock
    item.stock_quantity -= order.quantity
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Send admin notification
    send_admin_order_notification(db_order)
    
    return db_order

@router.get("/all", response_model=List[OrderWithDetails])
def get_all_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Admin: Get all orders."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    orders = db.query(Order).all()
    return orders

# Make sure this comes AFTER /all
@router.get("/user/{user_id}", response_model=List[OrderWithDetails])
def get_user_orders(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders for a specific user."""
    # Check if user is requesting their own orders or is admin
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view these orders"
        )
    
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return orders

@router.get("/{order_id}", response_model=OrderWithDetails)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if user is authorized to view this order
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order"
        )
    
    return order 

@router.patch("/{order_id}/status", response_model=OrderSchema)
def update_order_status(
    order_id: int,
    status: OrderStatus,
    cancellation_reason: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Admin: Accept or cancel an order."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if status == OrderStatus.CANCELLED and not cancellation_reason:
        raise HTTPException(status_code=400, detail="Cancellation reason required")
    order.status = status
    if status == OrderStatus.CANCELLED:
        order.cancellation_reason = cancellation_reason
    else:
        order.cancellation_reason = None
    db.commit()
    db.refresh(order)
    send_user_order_status_notification(order)
    return order 