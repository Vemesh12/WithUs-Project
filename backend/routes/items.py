from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func

from database import get_db
from models import Item, Review
from schemas import Item as ItemSchema, ItemWithReviews
from auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ItemSchema])
def get_items(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(get_db)
):
    """Get all items with optional filtering."""
    query = db.query(Item)
    
    if category:
        query = query.filter(Item.category == category)
    
    items = query.offset(skip).limit(limit).all()
    return items

@router.get("/{item_id}", response_model=ItemWithReviews)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Get a specific item with its reviews."""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Get reviews for this item
    reviews = db.query(Review).filter(Review.item_id == item_id).all()
    
    # Calculate average rating
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.item_id == item_id).scalar()
    
    # Create response with reviews
    item_data = ItemWithReviews(
        id=item.id,
        name=item.name,
        description=item.description,
        image_url=item.image_url,
        price=item.price,
        category=item.category,
        stock_quantity=item.stock_quantity,
        created_at=item.created_at,
        reviews=reviews,
        average_rating=float(avg_rating) if avg_rating else None,
        review_count=len(reviews)
    )
    
    return item_data

@router.get("/categories/list")
def get_categories(db: Session = Depends(get_db)):
    """Get all available item categories."""
    categories = db.query(Item.category).distinct().all()
    return [category[0] for category in categories] 