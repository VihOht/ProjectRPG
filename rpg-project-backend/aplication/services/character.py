from aplication import db
from aplication.models.characters import Character, Race
from aplication.models.classes import Class, Subclass, Ability
from aplication.models.atributes import Attribute, Attribute, CharacterAttributesPericias, CharacterAttributeValue, CharacterAttributesPericias, CharacterPericiaValue, Pericia
from aplication.constants import ATRIBUTES_PERICIAS_SHEET, PERICIAS_DESCRIPTION, STAT_CONVERSION_RULES, ATTRUBUTES_DESCRIPTION, PERICIAS_ATRIBUTES_SHEET


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


class PericiasService:
    @staticmethod
    def create_pericia(name, description, attribute_id):
        """Create a new pericia"""
        pericia = Pericia(name=name, description=description, attribute_id=attribute_id)
        db.session.add(pericia)
        db.session.commit()
        return pericia

    @staticmethod
    def get_all_pericias():
        """Get all pericias"""
        return Pericia.query.all()

    @staticmethod
    def get_pericia_by_id(pericia_id):
        """Get pericia by ID"""
        return Pericia.query.get(pericia_id)

    @staticmethod
    def update_pericia(pericia_id, name=None, description=None, attribute_id=None):
        """Update pericia"""
        pericia = Pericia.query.get(pericia_id)
        if not pericia:
            return None, "Pericia not found"

        impacted_character_attributes_ids = [
            item.character_attributes_pericias_id
            for item in CharacterPericiaValue.query.filter_by(pericia_id=pericia_id).all()
        ]
        
        if name:
            pericia.name = name
        if description:
            pericia.description = description
        if attribute_id:
            pericia.attribute_id = attribute_id
        
        db.session.commit()

        CharacterAttributesService.sync_attribute_bonuses_for_character_attributes_ids(
            impacted_character_attributes_ids
        )
        db.session.commit()
        return pericia, None

    @staticmethod
    def delete_pericia(pericia_id):
        """Delete pericia"""
        pericia = Pericia.query.get(pericia_id)
        if not pericia:
            return False, "Pericia not found"

        impacted_character_attributes_ids = [
            item.character_attributes_pericias_id
            for item in CharacterPericiaValue.query.filter_by(pericia_id=pericia_id).all()
        ]

        CharacterPericiaValue.query.filter_by(pericia_id=pericia_id).delete(synchronize_session=False)
        
        db.session.delete(pericia)
        db.session.commit()

        CharacterAttributesService.sync_attribute_bonuses_for_character_attributes_ids(
            impacted_character_attributes_ids
        )
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
        char_attrs = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return None, "Character attributes not found"

        def calc_total(base_value, bonus_value):
            return int(base_value) + int(bonus_value)

        def calc_dt(total):
            return max(0, 20 - int(total))

        return [
            {
                'attribute_id': value.attribute.id,
                'name': value.attribute.name,
                'description': value.attribute.description,
                'base': int(value.baseValue),
                'bonus': int(value.bonusValue),
                'total': calc_total(value.baseValue, value.bonusValue),
                'dt': calc_dt(calc_total(value.baseValue, value.bonusValue)),
            }
            for value in char_attrs.attributes
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

        pericias = Pericia.query.filter_by(attribute_id=attribute_id).all()
        pericia_ids = [pericia.id for pericia in pericias]
        if pericia_ids:
            CharacterPericiaValue.query.filter(CharacterPericiaValue.pericia_id.in_(pericia_ids)).delete(synchronize_session=False)
            Pericia.query.filter(Pericia.id.in_(pericia_ids)).delete(synchronize_session=False)

        CharacterAttributeValue.query.filter_by(attribute_id=attribute_id).delete(synchronize_session=False)
        
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

        subclass_ids = [subclass.id for subclass in Subclass.query.filter_by(class_id=class_id).all()]
        if subclass_ids:
            Ability.query.filter(Ability.subclass_id.in_(subclass_ids)).delete(synchronize_session=False)
            Subclass.query.filter(Subclass.id.in_(subclass_ids)).delete(synchronize_session=False)

        Ability.query.filter_by(class_id=class_id).delete(synchronize_session=False)
        
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

        Ability.query.filter_by(subclass_id=subclass_id).delete(synchronize_session=False)
        
        db.session.delete(subclass)
        db.session.commit()
        return True, None


class CharacterAttributesService:
    @staticmethod
    def _calc_total(base_value, bonus_value):
        return int(base_value) + int(bonus_value)

    @staticmethod
    def sync_attribute_bonuses(char_attrs):
        """Recalculate attribute bonuses so totals match the sum of related pericias."""
        pericia_totals_by_attribute_id = {}

        for pericia_value in char_attrs.pericias:
            pericia = pericia_value.pericia
            if pericia is None or pericia.attribute_id is None:
                continue

            pericia_total = int(pericia_value.baseValue) + int(pericia_value.bonusValue)
            pericia_totals_by_attribute_id[pericia.attribute_id] = (
                pericia_totals_by_attribute_id.get(pericia.attribute_id, 0) + pericia_total
            )

        for attribute_value in char_attrs.attributes:
            base_value = int(attribute_value.baseValue)
            pericia_total = int(pericia_totals_by_attribute_id.get(attribute_value.attribute_id, 0))
            # Bonus cannot be negative: attribute total should be at least the base.
            attribute_value.bonusValue = max(0, pericia_total - base_value)
            attribute_value.sync_legacy_value()

    @staticmethod
    def sync_attribute_bonuses_for_character_attributes_ids(character_attributes_ids):
        """Recalculate attribute bonuses for a set of character attribute containers."""
        if not character_attributes_ids:
            return

        char_attrs_list = CharacterAttributesPericias.query.filter(
            CharacterAttributesPericias.id.in_(character_attributes_ids)
        ).all()

        for char_attrs in char_attrs_list:
            CharacterAttributesService.sync_attribute_bonuses(char_attrs)

    @staticmethod
    def create_character_attributes(character_id):
        """Create character attributes record"""
        char_attrs = CharacterAttributesPericias(character_id=character_id)
        db.session.add(char_attrs)
        db.session.flush()

        # Create one value row per known base attribute for bulk update operations.
        for attribute, description in ATTRUBUTES_DESCRIPTION.items():
            if (attribute_obj := Attribute.query.filter_by(name=attribute).first()) is None:
                attribute_obj = Attribute(name=attribute, description=description)
                db.session.add(attribute_obj)
                db.session.flush()
            if (CharacterAttributeValue.query.filter_by(character_attributes_pericias_id=char_attrs.id, attribute_id=attribute_obj.id).first() is not None):
                continue
            new_attributeValue = CharacterAttributeValue(
                character_attributes_pericias_id=char_attrs.id,
                attribute_id=attribute_obj.id,
                baseValue=0,
                bonusValue=0,
            )
            db.session.add(new_attributeValue)


        db.session.commit()
        return char_attrs
    
    @staticmethod
    def create_character_pericias(character_id):
        """Create character pericias record"""
        char_attrs = CharacterAttributesPericias(character_id=character_id)
        db.session.add(char_attrs)
        db.session.flush()

        # Create one value row per known base attribute for bulk update operations.
        for pericia, description in PERICIAS_DESCRIPTION.items():
            if (pericia_obj := Pericia.query.filter_by(name=pericia).first()) is None:
                attribute = PERICIAS_ATRIBUTES_SHEET.get(pericia)
                if attribute is not None:
                    attribute_obj = Attribute.query.filter_by(name=attribute).first()
                    if attribute_obj is None:
                        attribute_obj = Attribute(name=attribute, description=ATTRUBUTES_DESCRIPTION.get(attribute, ""))
                        db.session.add(attribute_obj)
                        db.session.flush()
                pericia_obj = Pericia(name=pericia, description=description, attribute_id=attribute_obj.id if attribute is not None else None)
                db.session.add(pericia_obj)
                db.session.flush()
            if (CharacterPericiaValue.query.filter_by(character_attributes_pericias_id=char_attrs.id, pericia_id=pericia_obj.id).first() is not None):
                continue
            new_periciaValue = CharacterPericiaValue(
                character_attributes_pericias_id=char_attrs.id,
                pericia_id=pericia_obj.id,
                baseValue=0,
                bonusValue=0,
            )
            db.session.add(new_periciaValue)

        db.session.commit()
        return char_attrs

    @staticmethod
    def get_character_attributes(character_id):
        """Get all attributes for a character"""
        charAttributesPericias = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
        if not charAttributesPericias:
            return None, "Character attributes/pericias not found"

        for attribute_name, pericias in ATRIBUTES_PERICIAS_SHEET.items():
            if not any(value is not None and value.attribute.name == attribute_name for value in charAttributesPericias.attributes):
                attribute_obj = Attribute.query.filter_by(name=attribute_name).first()
                if attribute_obj is None:
                    attribute_obj = Attribute(name=attribute_name, description=ATTRUBUTES_DESCRIPTION.get(attribute_name, ""))
                    db.session.add(attribute_obj)
                    db.session.flush()
                new_attributeValue = CharacterAttributeValue(
                    character_attributes_pericias_id=charAttributesPericias.id,
                    attribute_id=attribute_obj.id,
                    baseValue=0,
                    bonusValue=0,
                )
                db.session.add(new_attributeValue)
                charAttributesPericias = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
            for pericia in pericias:
                if any(value is not None and value.pericia.name == pericia for value in charAttributesPericias.pericias):
                    continue
                pericia_obj = Pericia.query.filter_by(name=pericia).first()
                if pericia_obj is None:
                    new_pericia = Pericia(
                        name=pericia,
                        description=PERICIAS_DESCRIPTION.get(pericia, ""),
                        attribute_id=Attribute.query.filter_by(name=attribute_name).first().id if Attribute.query.filter_by(name=attribute_name).first() else attribute_obj.id,
                    )
                    db.session.add(new_pericia)
                    db.session.flush()
                    pericia_obj = new_pericia
                new_periciaValue = CharacterPericiaValue(
                    character_attributes_pericias_id=charAttributesPericias.id,
                    pericia_id=pericia_obj.id,
                    baseValue=0,
                    bonusValue=0,
                )
                db.session.add(new_periciaValue)
                charAttributesPericias = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
    
        db.session.commit()

        return charAttributesPericias
    

    @staticmethod
    def bulk_update_character_attributes(character_id, attributes_data):
        """Bulk update all attributes for a character
        
        attributes_data should be a list of dicts with attribute_id, base and bonus
        """
        char_attrs = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return None, "Character attributes not found"

        existing_values = {
            item.attribute_id: item
            for item in CharacterAttributeValue.query.filter_by(character_attributes_pericias_id=char_attrs.id).all()
        }

        for item in attributes_data:
            attribute_id = item.get('attribute_id')
            base_value = item.get('base')
            bonus_value = item.get('bonus')

            if attribute_id is None:
                continue

            if base_value is None:
                base_value = 0

            if bonus_value is None:
                bonus_value = 0

            if not Attribute.query.get(attribute_id):
                continue

            if attribute_id in existing_values:
                existing_values[attribute_id].baseValue = int(base_value)
                existing_values[attribute_id].bonusValue = int(bonus_value)
                existing_values[attribute_id].sync_legacy_value()
            else:
                db.session.add(
                    CharacterAttributeValue(
                        character_attributes_pericias_id=char_attrs.id,
                        attribute_id=attribute_id,
                        baseValue=int(base_value),
                        bonusValue=int(bonus_value),
                    )
                )

        db.session.commit()
        return char_attrs, None

    @staticmethod
    def bulk_update_character_pericias(character_id, pericias_data):
        """Bulk update all pericias for a character
        
        pericias_data should be a list of dicts with pericia_id, base and bonus
        """
        char_attrs = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return None, "Character pericias not found"

        existing_values = {
            item.pericia_id: item
            for item in CharacterPericiaValue.query.filter_by(character_attributes_pericias_id=char_attrs.id).all()
        }


        max_values = {}

        for item in pericias_data:
            pericia_id = item.get('pericia_id')
            base_value = item.get('base')
            bonus_value = item.get('bonus')

            if pericia_id is None:
                continue

            if base_value is None:
                base_value = 0

            if bonus_value is None:
                bonus_value = 0
            
            if not Pericia.query.get(pericia_id):
                continue
            


            if pericia_id in existing_values:
                existing_values[pericia_id].baseValue = int(base_value)
                existing_values[pericia_id].bonusValue = int(bonus_value)
            else:
                db.session.add(
                    CharacterPericiaValue(
                        character_attributes_pericias_id=char_attrs.id,
                        pericia_id=pericia_id,
                        baseValue=int(base_value),
                        bonusValue=int(bonus_value),
                    )
                )

        CharacterAttributesService.sync_attribute_bonuses(char_attrs)
        db.session.commit()
        return char_attrs, None

    @staticmethod
    def delete_character_attributes(character_id):
        """Delete character attributes"""
        char_attrs = CharacterAttributesPericias.query.filter_by(character_id=character_id).first()
        if not char_attrs:
            return False, "Character attributes not found"
        
        db.session.delete(char_attrs)
        db.session.commit()
        return True, None


class CharacterService:
    @staticmethod
    def create_character(user_id, **kwargs):
        """Create a new character with default values"""
        character = Character(
            own=user_id,
            **kwargs
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
    def get_all_characters():
        """Get all characters"""
        return Character.query.all()

    @staticmethod
    def update_character(character_id, **kwargs):
        """Update character fields"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        allowed_fields = [
            'name', 'charClass', 'subclass', 'second_class', 'race',
            'gender', 'age', 'level', 'life', 'defense', 'sanity', 'ocultism', 'mana',
            'base_life', 'base_defense', 'base_sanity', 'base_ocultism', 'base_mana',
            'bonus_max_life', 'bonus_max_defense', 'bonus_max_sanity', 
            'bonus_max_ocultism', 'bonus_max_mana', "active", "is_player",
            'equipament', 'equipDescription'
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

    @staticmethod
    def calculate_stat_limits(character_id):
        """Calculate base_max, bonus_max, and total_max for all character stats"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        # Get character attributes
        attributes, error = AttributeService.get_attributes_by_character(character_id)
        if error:
            return None, error
        
        # Create a map of attribute name to total value
        attribute_map = {attr['name']: attr['total'] for attr in attributes}
        
        # Calculate base_max, bonus_max, and total_max for each stat
        stat_limits = {}
        
        for attribute_name, rule in STAT_CONVERSION_RULES.items():
            stat_name = rule['stat']
            rate = rule['rate']
            attribute_total = attribute_map.get(attribute_name, 10)  # Default to 10 if not found
            
            # Base max comes only from base stat (no attribute contribution)
            base_max = getattr(character, f'base_{stat_name}', 0)
            # Bonus max = bonus_max field + attribute contribution (treated as bonus)
            bonus_from_attribute = attribute_total * rate
            bonus_max = getattr(character, f'bonus_max_{stat_name}', 0) + bonus_from_attribute
            total_max = base_max + bonus_max
            
            stat_limits[stat_name] = {
                'base_max': base_max,
                'bonus_max': bonus_max,
                'total_max': total_max
            }
        
        return stat_limits, None


    @staticmethod
    def transferCharacterOwnership(character_id, new_user_id):
        """Transfer character ownership to another user"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        character.own = new_user_id
        character.is_player = True
        db.session.commit()
        return character, None
