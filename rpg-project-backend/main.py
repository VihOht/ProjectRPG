from sqlalchemy import inspect, text

from aplication import app, db

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
        ensure_character_stat_fields()  # Run migration
        ensure_user_role_field()  # Run migration
    app.run(debug=True)
    print("Server is running on http://localhost:5000")