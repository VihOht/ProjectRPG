import os

from sqlalchemy import inspect, text
from werkzeug.security import generate_password_hash

from aplication import app, db
from aplication.models.user import User

def ensure_character_stat_fields():
    """Add base and bonus max stat fields to character table if they don't exist"""
    with app.app_context():
        inspector = inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('character')]

        fields_to_add = {
            'base_life': 100,
            'base_defense': 10,
            'base_sanity': 100,
            'base_ocultism': 0,
            'base_mana': 50,
            'bonus_max_life': 0,
            'bonus_max_defense': 0,
            'bonus_max_sanity': 0,
            'bonus_max_ocultism': 0,
            'bonus_max_mana': 0,
        }

        for field, default in fields_to_add.items():
            if field not in columns:
                print(f"Adding column {field} to character table...")
                db.session.execute(
                    text(f"ALTER TABLE character ADD COLUMN {field} INTEGER NOT NULL DEFAULT {default}")
                )

        db.session.commit()
        print("Character stat fields migration applied successfully")


def ensure_character_equipment_fields():
    """Add equipment fields to character table if they don't exist"""
    with app.app_context():
        inspector = inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('character')]

        fields_to_add = {
            'equipament': "TEXT NOT NULL DEFAULT ''",
            'equipDescription': "TEXT NOT NULL DEFAULT ''",
        }

        for field, definition in fields_to_add.items():
            if field not in columns:
                print(f"Adding column {field} to character table...")
                db.session.execute(
                    text(f"ALTER TABLE character ADD COLUMN {field} {definition}")
                )

        db.session.commit()
        print("Character equipment fields migration applied successfully")


def ensure_user_role_field():
    """Add role field to user table if it doesn't exist"""
    with app.app_context():
        inspector = inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('user')]

        if 'role' not in columns:
            print("Adding column role to user table...")
            db.session.execute(
                text("ALTER TABLE user ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER'")
            )
            db.session.commit()
        else:
            print("User role field already exists")


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
        ensure_character_stat_fields()  # Run migration
        ensure_character_equipment_fields()  # Run migration
        ensure_user_role_field()  # Run migration
        ensure_default_admin_user()  # Create admin if needed
    app.run(debug=True)
    print("Server is running on http://localhost:5000")
