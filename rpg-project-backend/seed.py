"""
Database seed script to populate initial mock data and create test users and characters
"""
import sys
from application import app, db
from application.models.user import User
from application.models.classes import Class, Subclass, Ability
from application.models.characters import Character, Race
from application.models.atributes import Attribute, CharacterAttributes
from werkzeug.security import generate_password_hash


def seed_database():
    """Seed database with mock data"""
    with app.app_context():
        # Drop all tables and recreate them
        print("🗑️  Dropping all tables...")
        db.drop_all()
        
        print("🏗️  Creating all tables...")
        db.create_all()
        
        # ==================== RACES ====================
        print("\n📍 Creating Races...")
        races = [
            Race(name="Human", description="A versatile and adaptable race. Humans are known for their ambition and drive."),
            Race(name="Elf", description="A graceful and long-lived race. Elves are known for their intelligence and magical affinity."),
            Race(name="Dwarf", description="A sturdy and resilient race. Dwarves are excellent craftspeople and miners."),
            Race(name="Orc", description="A strong and fierce race. Orcs are known for their strength and warrior spirit."),
        ]
        db.session.add_all(races)
        db.session.flush()
        print(f"✅ Created {len(races)} races")
        
        # ==================== ATTRIBUTES ====================
        print("\n⚔️ Creating Attributes...")
        attributes = [
            Attribute(name="Strength", description="The power to exert force. Affects melee damage and carrying capacity."),
            Attribute(name="Dexterity", description="Agility and reflexes. Affects accuracy and evasion."),
            Attribute(name="Constitution", description="Physical endurance. Affects health points and resistance."),
            Attribute(name="Intelligence", description="Mental acuity. Affects spell power and knowledge skills."),
            Attribute(name="Wisdom", description="Perception and insight. Affects magical defense and perception."),
            Attribute(name="Charisma", description="Force of personality. Affects social interactions and influence."),
        ]
        db.session.add_all(attributes)
        db.session.flush()
        print(f"✅ Created {len(attributes)} attributes")
        
        # ==================== ABILITIES ====================
        print("\n🎯 Creating Abilities...")
        abilities = [
            Ability(name="Slash", description="A basic melee attack that deals physical damage."),
            Ability(name="Fireball", description="Launch a ball of fire at enemies."),
            Ability(name="Heal", description="Restore health to a target."),
            Ability(name="Shield Bash", description="Bash enemies with your shield, dealing damage and stunning them."),
            Ability(name="Frost Nova", description="Create an explosion of ice that damages and slows enemies."),
            Ability(name="Shadow Step", description="Teleport a short distance and become invisible for a moment."),
            Ability(name="Berserker Rage", description="Increase damage output at the cost of defense."),
            Ability(name="Divine Protection", description="Create a shield that reduces incoming damage."),
        ]
        db.session.add_all(abilities)
        db.session.flush()
        print(f"✅ Created {len(abilities)} abilities")
        
        # ==================== CLASSES ====================
        print("\n👤 Creating Classes and Subclasses...")
        
        # Warrior Class
        warrior = Class(name="Warrior", description="A master of melee combat. Warriors excel at dealing and taking damage.")
        db.session.add(warrior)
        db.session.flush()
        
        # Warrior Subclasses
        knight = Subclass(name="Knight", description="A noble warrior focused on defense and protection.", class_id=warrior.id)
        barbarian = Subclass(name="Barbarian", description="A savage warrior powered by rage and primal fury.", class_id=warrior.id)
        db.session.add_all([knight, barbarian])
        db.session.flush()
        
        # Mage Class
        mage = Class(name="Mage", description="A master of arcane magic. Mages deal magical damage from a distance.")
        db.session.add(mage)
        db.session.flush()
        
        # Mage Subclasses
        pyromancer = Subclass(name="Pyromancer", description="A mage specialized in fire magic.", class_id=mage.id)
        cryomancer = Subclass(name="Cryomancer", description="A mage specialized in ice magic.", class_id=mage.id)
        db.session.add_all([pyromancer, cryomancer])
        db.session.flush()
        
        # Rogue Class
        rogue = Class(name="Rogue", description="A cunning fighter who deals burst damage and steals. They thrive in shadows.")
        db.session.add(rogue)
        db.session.flush()
        
        # Rogue Subclasses
        assassin = Subclass(name="Assassin", description="A deadly rogue specialized in instant kills.", class_id=rogue.id)
        thief = Subclass(name="Thief", description="A rogue focused on stealing and evasion.", class_id=rogue.id)
        db.session.add_all([assassin, thief])
        db.session.flush()
        
        # Cleric Class
        cleric = Class(name="Cleric", description="A devoted healer blessed with divine magic.")
        db.session.add(cleric)
        db.session.flush()
        
        # Cleric Subclasses
        priest = Subclass(name="Priest", description="A healer focused on healing and support.", class_id=cleric.id)
        paladin = Subclass(name="Paladin", description="A warrior-cleric who combines healing with combat.", class_id=cleric.id)
        db.session.add_all([priest, paladin])
        db.session.flush()
        
        print(f"✅ Created 5 classes with 10 subclasses total")
        
        # ==================== TEST USERS ====================
        print("\n👥 Creating Test Users...")
        test_user = User(
            username="testuser",
            email="test@example.com",
            password=generate_password_hash("password123")
        )
        db.session.add(test_user)
        db.session.flush()
        print(f"✅ Created test user: 'testuser' (email: test@example.com)")
        
        # ==================== CHARACTERS ====================
        print("\n🐉 Creating Test Characters...")
        
        # Character 1: Knight
        char1 = Character(
            own=test_user.id,
            name="Sir Arthurian",
            charClass=warrior.id,
            subclass=knight.id,
            race=races[0].id,  # Human
            gender="Male",
            age=35,
            level=5,
            life=150,
            defense=25,
            sanity=100,
            ocultism=5,
            mana=20
        )
        db.session.add(char1)
        db.session.flush()
        
        # Create character attributes for char1
        char1_attrs = CharacterAttributes(character_id=char1.id)
        db.session.add(char1_attrs)
        db.session.flush()
        
        # Character 2: Pyromancer
        char2 = Character(
            own=test_user.id,
            name="Flame Master Zyx",
            charClass=mage.id,
            subclass=pyromancer.id,
            race=races[1].id,  # Elf
            gender="Female",
            age=287,
            level=6,
            life=80,
            defense=10,
            sanity=120,
            ocultism=95,
            mana=200
        )
        db.session.add(char2)
        db.session.flush()
        
        # Create character attributes for char2
        char2_attrs = CharacterAttributes(character_id=char2.id)
        db.session.add(char2_attrs)
        db.session.flush()
        
        # Character 3: Assassin
        char3 = Character(
            own=test_user.id,
            name="Shadow's Whisper",
            charClass=rogue.id,
            subclass=assassin.id,
            race=races[2].id,  # Dwarf
            gender="Male",
            age=142,
            level=4,
            life=90,
            defense=15,
            sanity=110,
            ocultism=30,
            mana=50
        )
        db.session.add(char3)
        db.session.flush()
        
        # Create character attributes for char3
        char3_attrs = CharacterAttributes(character_id=char3.id)
        db.session.add(char3_attrs)
        db.session.flush()
        
        # Commit all changes
        db.session.commit()
        
        print(f"✅ Created 3 test characters")
        
        # ==================== SUMMARY ====================
        print("\n" + "="*60)
        print("✨ DATABASE INITIALIZATION COMPLETED ✨")
        print("="*60)
        print(f"\n📊 Summary:")
        print(f"  • Races: {len(races)}")
        print(f"  • Attributes: {len(attributes)}")
        print(f"  • Abilities: {len(abilities)}")
        print(f"  • Classes: 5 with 10 subclasses")
        print(f"  • Users: 1 (testuser)")
        print(f"  • Characters: 3")
        print(f"\n🎮 Test Characters Created:")
        print(f"  1. Sir Arthurian (Human Knight, Level 5)")
        print(f"  2. Flame Master Zyx (Elf Pyromancer, Level 6)")
        print(f"  3. Shadow's Whisper (Dwarf Assassin, Level 4)")
        print(f"\n🔑 Test User Credentials:")
        print(f"  • Username: testuser")
        print(f"  • Email: test@example.com")
        print(f"  • Password: password123")
        print(f"\n🚀 You can now authenticate with the test user and access their characters!")
        print("="*60 + "\n")


if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print(f"\n❌ Error during database initialization: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
