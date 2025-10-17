from database import engine, SessionLocal
from models import Base, User, Item, Review, Order
from auth import get_password_hash
from models import ServiceType, OrderStatus
from datetime import datetime

def init_db():
    """Initialize the database with tables and sample data."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already initialized with data.")
            return
        
        # Create sample users
        admin_user = User(
            name="Admin User",
            email="admin@withus.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        
        customer_user = User(
            name="John Doe",
            email="john@example.com",
            password_hash=get_password_hash("password123"),
            role="customer"
        )
        
        db.add(admin_user)
        db.add(customer_user)
        db.commit()
        db.refresh(admin_user)
        db.refresh(customer_user)
        
        # Create sample items
        items = [
            Item(
                name="Fresh Mangoes",
                description="Sweet and juicy Alphonso mangoes from Maharashtra",
                image_url="/mango_image.jpg",
                price=120.0,
                category="fruits",
                stock_quantity=50
            ),
            Item(
                name="Organic Milk",
                description="Pure organic cow milk, delivered fresh daily",
                image_url="/milk_image.jpg",
                price=60.0,
                category="dairy",
                stock_quantity=100
            ),
            Item(
                name="Coconut Water",
                description="Natural coconut water, rich in electrolytes",
                image_url="/coconuts.jpg",
                price=40.0,
                category="beverages",
                stock_quantity=75
            ),
            Item(
                name="Fresh Apples",
                description="Crispy red apples, perfect for health",
                image_url="/apple_image.jpg",
                price=80.0,
                category="fruits",
                stock_quantity=60
            ),
            Item(
                name="Curd",
                description="Homemade curd, probiotic rich",
                image_url="/curd_image.jpg",
                price=45.0,
                category="dairy",
                stock_quantity=80
            ),
            Item(
                name="Mineral Water",
                description="Pure mineral water, 1L bottles",
                image_url="/mineral_water.jpg",
                price=20.0,
                category="beverages",
                stock_quantity=200
            )
        ]
        
        for item in items:
            db.add(item)
        
        db.commit()
        
        # Refresh items to get their IDs
        for item in items:
            db.refresh(item)
        
        # Create sample reviews
        reviews = [
            Review(
                user_id=customer_user.id,
                item_id=items[0].id,  # Mangoes
                rating=5,
                comment="Amazing mangoes! Very sweet and fresh."
            ),
            Review(
                user_id=customer_user.id,
                item_id=items[1].id,  # Milk
                rating=4,
                comment="Good quality organic milk. Delivered on time."
            ),
            Review(
                user_id=customer_user.id,
                item_id=items[2].id,  # Coconut Water
                rating=5,
                comment="Perfect for summer! Natural and refreshing."
            )
        ]
        
        for review in reviews:
            db.add(review)
        
        db.commit()
        
        # Create sample orders
        orders = [
            Order(
                user_id=customer_user.id,
                item_id=items[0].id,  # Mangoes
                service_type=ServiceType.DELIVERY,
                status=OrderStatus.COMPLETED,
                quantity=2,
                total_price=240.0,
                delivery_address="123 Main St, City, State 12345",
                mobile_number="9876543210",
                cancellation_reason=None
            ),
            Order(
                user_id=customer_user.id,
                item_id=items[1].id,  # Milk
                service_type=ServiceType.IN_PERSON,
                status=OrderStatus.CONFIRMED,
                quantity=1,
                total_price=60.0,
                scheduled_time=datetime.now(),
                mobile_number="9876543210",
                cancellation_reason=None
            )
        ]
        
        for order in orders:
            db.add(order)
        
        db.commit()
        
        print("Database initialized successfully with sample data!")
        print(f"Created {len(items)} items, {len(reviews)} reviews, and {len(orders)} orders")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 