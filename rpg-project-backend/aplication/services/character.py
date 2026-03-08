from aplication import db
from aplication.models.characters import Character, Race
from aplication.models.classes import Class, Subclass, Ability
from aplication.models.atributes import Attribute, CharacterAttributes, CharacterAttributeValue
from aplication.constants import AtributesModelsSheet


class AbilityService:
    @staticmethod
    def create_ability(name, description, class_id=None, subclass_id=None, character_id=None):
        """Create a new ability"""
        ability = Ability(
            name=name,
            description=description,
            class_id=class_id,
            subclass_id=subclass_id,
            character_id=character_id
        )
        db.session.add(ability)
        db.session.commit()
        return ability

    @staticmethod
    def get_all_abilities():
        """Get all abilities"""
        return Ability.query.all()

    @staticmethod
    def get_ability_by_id(ability_id):
        """Get ability by ID"""
        return Ability.query.get(ability_id)
    
    @staticmethod
    def get_ability_by_class(class_id):
        """Get abilities by class ID"""
        return Ability.query.filter_by(class_id=class_id).all()

    @staticmethod
    def get_ability_by_subclass(subclass_id):
        """Get abilities by subclass ID"""
        return Ability.query.filter_by(subclass_id=subclass_id).all()

    @staticmethod
    def update_ability(ability_id, name=None, description=None):
        """Update ability"""
        ability = Ability.query.get(ability_id)
        if not ability:
            return None, "Ability not found"
        
        if name:
            ability.name = name
        if description:
            ability.description = description
        
        db.session.commit()
        return ability, None

    @staticmethod
    def delete_ability(ability_id):
        """Delete ability"""
        ability = Ability.query.get(ability_id)
        if not ability:
            return False, "Ability not found"
        
        db.session.delete(ability)
        db.session.commit()
        return True, None


class RaceService:
    @staticmethod
    def create_race(name, description):
        """Create a new race"""
        race = Race(name=name, description=description)
        db.session.add(race)
        db.session.commit()
        return race

    @staticmethod
    def get_all_races():
        """Get all races"""
        return Race.query.all()

    @staticmethod
    def get_race_by_id(race_id):
        """Get race by ID"""
        return Race.query.get(race_id)

    @staticmethod
    def update_race(race_id, name=None, description=None):
        """Update race"""
        race = Race.query.get(race_id)
        if not race:
            return None, "Race not found"
        
        if name:
            race.name = name
        if description:
            race.description = description
        
        db.session.commit()
        return race, None

    @staticmethod
    def delete_race(race_id):
        """Delete race"""
        race = Race.query.get(race_id)
        if not race:
            return False, "Race not found"
        
        db.session.delete(race)
        db.session.commit()
        return True, None


class AttributeService:
    @staticmethod
    def create_attribute(name, description):
        """Create a new attribute"""
        attribute = Attribute(name=name, description=description)
        db.session.add(attribute)
        db.session.commit()
        return attribute

    @staticmethod
    def get_all_attributes():
        """Get all attributes"""
        return Attribute.query.all()

    @staticmethod
    def get_attribute_by_id(attribute_id):
        """Get attribute by ID"""
        return Attribute.query.get(attribute_id)
    
    @staticmethod
    def get_attributes_by_character(character_id):
        """Get attributes for a character"""
        char_attrs = CharacterAttributes.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return None, "Character attributes not found"

        return [
            {
                'attribute_id': value.attribute.id,
                'name': value.attribute.name,
                'description': value.attribute.description,
                'value': value.value
            }
            for value in char_attrs.values
        ], None

    @staticmethod
    def update_attribute(attribute_id, name=None, description=None):
        """Update attribute"""
        attribute = Attribute.query.get(attribute_id)
        if not attribute:
            return None, "Attribute not found"
        
        if name:
            attribute.name = name
        if description:
            attribute.description = description
        
        db.session.commit()
        return attribute, None

    @staticmethod
    def delete_attribute(attribute_id):
        """Delete attribute"""
        attribute = Attribute.query.get(attribute_id)
        if not attribute:
            return False, "Attribute not found"
        
        db.session.delete(attribute)
        db.session.commit()
        return True, None


class ClassService:
    @staticmethod
    def create_class(name, description, abilities=None):
        """Create a new class with abilities"""
        char_class = Class(name=name, description=description)
        db.session.add(char_class)
        db.session.flush()  # Get the ID without committing
        
        if abilities:
            for ability_id in abilities:
                ability = Ability.query.get(ability_id)
                if ability:
                    ability.class_id = char_class.id
        
        db.session.commit()
        return char_class

    @staticmethod
    def get_all_classes():
        """Get all classes"""
        return Class.query.all()

    @staticmethod
    def get_class_by_id(class_id):
        """Get class by ID"""
        return Class.query.get(class_id)

    @staticmethod
    def update_class(class_id, name=None, description=None):
        """Update class"""
        char_class = Class.query.get(class_id)
        if not char_class:
            return None, "Class not found"
        
        if name:
            char_class.name = name
        if description:
            char_class.description = description
        
        db.session.commit()
        return char_class, None

    @staticmethod
    def delete_class(class_id):
        """Delete class"""
        char_class = Class.query.get(class_id)
        if not char_class:
            return False, "Class not found"
        
        db.session.delete(char_class)
        db.session.commit()
        return True, None


class SubclassService:
    @staticmethod
    def create_subclass(name, description, class_id, abilities=None):
        """Create a new subclass under a class"""
        char_class = Class.query.get(class_id)
        if not char_class:
            return None, "Class not found"
        
        subclass = Subclass(name=name, description=description, class_id=class_id)
        db.session.add(subclass)
        db.session.flush()

        if abilities:
            for ability_id in abilities:
                ability = Ability.query.get(ability_id)
                if ability:
                    ability.class_id = class_id
                    ability.subclass_id = subclass.id

        db.session.commit()
        return subclass, None

    @staticmethod
    def get_all_subclasses():
        """Get all subclasses"""
        return Subclass.query.all()

    @staticmethod
    def get_subclass_by_id(subclass_id):
        """Get subclass by ID"""
        return Subclass.query.get(subclass_id)

    @staticmethod
    def update_subclass(subclass_id, name=None, description=None):
        """Update subclass"""
        subclass = Subclass.query.get(subclass_id)
        if not subclass:
            return None, "Subclass not found"
        
        if name:
            subclass.name = name
        if description:
            subclass.description = description
        
        db.session.commit()
        return subclass, None

    @staticmethod
    def delete_subclass(subclass_id):
        """Delete subclass"""
        subclass = Subclass.query.get(subclass_id)
        if not subclass:
            return False, "Subclass not found"
        
        db.session.delete(subclass)
        db.session.commit()
        return True, None


class CharacterAttributesService:
    @staticmethod
    def create_character_attributes(character_id):
        """Create character attributes record"""
        char_attrs = CharacterAttributes(character_id=character_id)
        db.session.add(char_attrs)
        db.session.flush()

        # Create one value row per known base attribute for bulk update operations.
        for attribute in Attribute.query.all():
            db.session.add(
                CharacterAttributeValue(
                    character_attributes_id=char_attrs.id,
                    attribute_id=attribute.id,
                    value=0
                )
            )

        db.session.commit()
        return char_attrs

    @staticmethod
    def get_character_attributes(character_id):
        """Get all attributes for a character"""
        charAttributes = CharacterAttributes.query.filter_by(character_id=character_id).first()
        if not charAttributes:
            return None, "Character attributes not found"

        for item in AtributesModelsSheet:
            if not any(value is not None and value.attribute.name == item for value in charAttributes.values):
                attribute = Attribute.query.filter_by(name=item).first()
                if attribute is None:
                    new_attr = Attribute(name=item, description="")
                    db.session.add(new_attr)
                    db.session.flush()
                    attribute = new_attr
                new_attributeValue = CharacterAttributeValue(character_id, attribute.id, 0)
                db.session.add(new_attributeValue)
                charAttributes = CharacterAttributes.query.filter_by(character_id=character_id).first()
    
        db.session.commit()

        return charAttributes
    

    @staticmethod
    def bulk_update_character_attributes(character_id, attributes_data):
        """Bulk update all attributes for a character
        
        attributes_data should be a list of dicts with attribute_id and value
        """
        char_attrs = CharacterAttributes.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return None, "Character attributes not found"

        existing_values = {
            item.attribute_id: item
            for item in CharacterAttributeValue.query.filter_by(character_attributes_id=char_attrs.id).all()
        }

        for item in attributes_data:
            attribute_id = item.get('attribute_id')
            value = item.get('value')

            if attribute_id is None or value is None:
                continue

            if not Attribute.query.get(attribute_id):
                continue

            if attribute_id in existing_values:
                existing_values[attribute_id].value = int(value)
            else:
                db.session.add(
                    CharacterAttributeValue(
                        character_attributes_id=char_attrs.id,
                        attribute_id=attribute_id,
                        value=int(value)
                    )
                )

        db.session.commit()
        return char_attrs, None

    @staticmethod
    def delete_character_attributes(character_id):
        """Delete character attributes"""
        char_attrs = CharacterAttributes.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return False, "Character attributes not found"
        
        db.session.delete(char_attrs)
        db.session.commit()
        return True, None


class CharacterService:
    @staticmethod
    def create_character(user_id, name, char_class_id, race_id, gender, age):
        """Create a new character with default values"""
        character = Character(
            own=user_id,
            name=name,
            charClass=char_class_id,
            race=race_id,
            gender=gender,
            age=age,
            level=1,
            # Default stats
            life=100,
            defense=10,
            sanity=100,
            ocultism=0,
            mana=50
        )
        db.session.add(character)
        db.session.flush()
        
        # Create character attributes record
        CharacterAttributesService.create_character_attributes(character.id)
        
        db.session.commit()
        return character, None

    @staticmethod
    def get_character_by_id(character_id):
        """Get character by ID"""
        return Character.query.get(character_id)

    @staticmethod
    def get_user_characters(user_id):
        """Get all characters for a user"""
        return Character.query.filter_by(own=user_id).all()

    @staticmethod
    def update_character(character_id, **kwargs):
        """Update character fields"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        allowed_fields = [
            'name', 'charClass', 'subclass', 'second_class', 'race',
            'gender', 'age', 'level', 'life', 'defense', 'sanity', 'ocultism', 'mana'
        ]
        
        for key, value in kwargs.items():
            if key in allowed_fields and value is not None:
                setattr(character, key, value)
        
        db.session.commit()
        return character, None

    @staticmethod
    def delete_character(character_id):
        """Delete character"""
        character = Character.query.get(character_id)
        if not character:
            return False, "Character not found"
        
        # Delete associated attributes
        CharacterAttributesService.delete_character_attributes(character_id)
        
        db.session.delete(character)
        db.session.commit()
        return True, None
