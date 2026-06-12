import os

from sqlalchemy import inspect, text
from werkzeug.security import generate_password_hash

from application import app, db
from application.models._user import User




def ensure_default_admin_user():
    """Create (or promote) a default admin user."""
    with app.app_context():
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_email = os.getenv("ADMIN_EMAIL", "admin@insonia.local")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

        user = User.query.filter_by(username=admin_username).first()
        if user:
            if (user.role or "USER").upper() != "ADMIN":
                user.role = "ADMIN"
                db.session.commit()
                print(f"User '{admin_username}' promoted to ADMIN")
            else:
                print(f"Admin user '{admin_username}' already exists")
            return

        user_by_email = User.query.filter_by(email=admin_email).first()
        if user_by_email:
            user_by_email.username = admin_username
            user_by_email.role = "ADMIN"
            db.session.commit()
            print(f"User with email '{admin_email}' promoted to ADMIN")
            return

        admin_user = User(
            username=admin_username,
            email=admin_email,
            password=generate_password_hash(admin_password),
            role="ADMIN",
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"Default admin user '{admin_username}' created")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
        ensure_default_admin_user()  # Create admin if needed
    app.run(debug=True)
    print("Server is running on http://localhost:5000")