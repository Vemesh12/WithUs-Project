import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')


def send_admin_order_notification(order):
    if not (EMAIL_USER and EMAIL_PASS and ADMIN_EMAIL):
        print("[Email] Email credentials not set. Skipping email notification.")
        return
    subject = f"New Order Placed: Order #{order.id}"
    user_name = getattr(order.user, 'name', 'Unknown')
    body = f"""
A new order has been placed.

Received order from: {user_name}

Order ID: {order.id}
User ID: {order.user_id}
Item ID: {order.item_id}
Quantity: {order.quantity}
Service Type: {order.service_type}
Mobile Number: {order.mobile_number}
Delivery Address: {order.delivery_address}
Scheduled Time: {order.scheduled_time}
Total Price: ₹{order.total_price}

Please log in to the admin dashboard to accept or cancel this order.
"""
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = ADMIN_EMAIL
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, ADMIN_EMAIL, msg.as_string())
        server.quit()
        print(f"[Email] Admin notified for order {order.id}")
    except Exception as e:
        print(f"[Email] Failed to send admin notification: {e}")


def send_user_order_status_notification(order):
    if not (EMAIL_USER and EMAIL_PASS):
        print("[Email] Email credentials not set. Skipping user notification.")
        return
    user_email = getattr(order.user, 'email', None)
    user_name = getattr(order.user, 'name', 'Customer')
    if not user_email:
        print(f"[Email] No email found for user of order {order.id}. Skipping user notification.")
        return
    subject = f"Your Order #{order.id} Status Update"
    if order.status.value == "cancelled":
        body = f"Hello {user_name},\n\nYour order #{order.id} has been cancelled.\nReason: {order.cancellation_reason}\n\nIf you have questions, please contact support."
    else:
        body = f"Hello {user_name},\n\nYour order #{order.id} has been accepted and is now '{order.status.value}'.\n\nThank you for ordering with us!"
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = user_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, user_email, msg.as_string())
        server.quit()
        print(f"[Email] User notified for order {order.id}")
    except Exception as e:
        print(f"[Email] Failed to send user notification: {e}") 