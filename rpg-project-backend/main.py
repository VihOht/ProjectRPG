import os
from werkzeug.security import generate_password_hash

from application import app, db
from application.models._user import User
import sys

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
            active=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"Default admin user '{admin_username}' created")

if __name__ == '__main__':
    argv = sys.argv
    if len(argv) > 1 and argv[1] == "get-tables":
        print("Tables in the database:")
        with app.app_context():
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            for table in tables:
                print(f"- {table}")
        sys.exit(0)

    elif len(argv) > 1 and argv[1] == "delete-table":
        if len(argv) < 3:
            print("Usage: python main.py delete-table <table_name>")
            sys.exit(1)
        table_name = argv[2]
        with app.app_context():
            inspector = db.inspect(db.engine)
            if table_name not in inspector.get_table_names():
                print(f"Table '{table_name}' does not exist.")
                sys.exit(1)
            table = db.metadata.tables.get(table_name)
            if table is None:
                print(f"Table '{table_name}' not found in metadata.")
                sys.exit(1)
            table.drop(db.engine)
            print(f"Table '{table_name}' has been deleted.")
        sys.exit(0)
    elif len(argv) > 1:
        sys.exit(1)
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
        ensure_default_admin_user()  # Create admin if needed
    debug = os.getenv('DEBUG', 'false').lower() == 'true'
    app.run(debug=debug)