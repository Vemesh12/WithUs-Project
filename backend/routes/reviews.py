from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Review, User, Item
from schemas import ReviewCreate, Review as ReviewSchema, ReviewWithUser
from auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ReviewSchema)
def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new review for an item."""
    # Check if item exists
    item = db.query(Item).filter(Item.id == review.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    # Check if user has already reviewed this item
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.item_id == review.item_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this item"
        )
    
    # Validate rating
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Create review
    db_review = Review(
        user_id=current_user.id,
        item_id=review.item_id,
        rating=review.rating,
        comment=review.comment
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review

@router.get("/item/{item_id}", response_model=List[ReviewSchema])
def get_item_reviews(item_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a specific item."""
    # Check if item exists
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    reviews = db.query(Review).filter(Review.item_id == item_id).all()
    return reviews

@router.get("/user/{user_id}", response_model=List[ReviewSchema])
def get_user_reviews(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reviews by a specific user."""
    # Check if user is requesting their own reviews or is admin
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view these reviews"
        )
    
    reviews = db.query(Review).filter(Review.user_id == user_id).all()
    return reviews 

@router.get("/all", response_model=List[ReviewWithUser])
def get_all_reviews(db: Session = Depends(get_db)):
    """Get all reviews with user info."""
    reviews = db.query(Review).all()
    result = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
        result.append({
            'id': review.id,
            'user_id': review.user_id,
            'item_id': review.item_id,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at,
            'user_name': user.name if user else "Unknown"
        })
    return result 