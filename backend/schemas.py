from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import ServiceType, OrderStatus

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Item Schemas
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: float
    category: str
    stock_quantity: int = 0

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Review Schemas
class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    item_id: int

class Review(ReviewBase):
    id: int
    user_id: int
    item_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReviewWithUser(ReviewBase):
    id: int
    user_id: int
    item_id: int
    created_at: datetime
    user_name: str
    # Optionally, add user_initial: str if you want to send the first letter

    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    item_id: int
    service_type: ServiceType
    quantity: int = 1
    delivery_address: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    mobile_number: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    status: OrderStatus
    total_price: float
    cancellation_reason: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Password reset schemas
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# Response Schemas
class ItemWithReviews(Item):
    reviews: List[Review] = []
    average_rating: Optional[float] = None
    review_count: int = 0

class OrderWithDetails(Order):
    item: Item
    user: User 