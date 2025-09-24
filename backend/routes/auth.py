from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import User
from schemas import (
    UserCreate,
    UserLogin,
    User as UserSchema,
    Token,
    PasswordResetRequest,
    PasswordResetConfirm,
)
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_password_reset_token,
    verify_password_reset_token,
)
from email_utils import EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

@router.post("/register", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"} 

@router.post("/password/forgot")
def forgot_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    """Generate a password reset link and email it to the user (if exists)."""
    user = db.query(User).filter(User.email == payload.email).first()
    # Always respond 200 to avoid user enumeration
    if not user:
        return {"message": "If the email exists, a reset link has been sent."}

    token = create_password_reset_token(user)
    frontend_base = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")
    reset_link = f"{frontend_base}/reset-password?token={token}"

    if not (EMAIL_USER and EMAIL_PASS):
        print(f"[Email] Credentials not set. Reset link for {user.email}: {reset_link}")
        return {"message": "If the email exists, a reset link has been sent."}

    subject = "Reset your WithUs password"
    body = f"""
Hello {user.name},

We received a request to reset your password for your WithUs account.
Click the link below to choose a new password. This link expires soon.

{reset_link}

If you did not request a password reset, you can ignore this email.
"""
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = user.email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(EMAIL_HOST, int(EMAIL_PORT))
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, user.email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"[Email] Failed to send reset email: {e}. Link: {reset_link}")

    return {"message": "If the email exists, a reset link has been sent."}

@router.post("/password/reset")
def reset_password(payload: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Reset the password using a valid token."""
    user = verify_password_reset_token(payload.token, db)
    # If token invalid, an HTTPException is raised
    new_hash = get_password_hash(payload.new_password)
    user.password_hash = new_hash
    db.add(user)
    db.commit()
    return {"message": "Password has been reset successfully."}