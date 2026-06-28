from __future__ import annotations
from application import db
from application.models._characters import Character, ConversionRule, LevelUpRule, Race, ConversionRuleType
from application.models._classes import CharacterSpecialAbility, Ritual, Wizardcraft, Subclass, Class, ClassAbility, ClassPower
from application.models._pericia import Pericia, PericiaValue
from application.models._attribute import Attribute, AttributePower, AttributeValue
from application.models._user import User
from application.models._inventory import Artefact, Inventory, InventoryItem, InventoryType, Item, Utility, Weapon, Armor

class ClassAbilityService:
    @staticmethod
    def create_ability(name, description, class_id, subclass_id=None):
        """Create a new ability"""
        class_ability = ClassAbility(
            name=name,
            description=description,
            class_id=class_id,
            subclass_id=subclass_id,
        )
        db.session.add(class_ability)
        db.session.commit()
        return class_ability

    @staticmethod
    def get_all_abilities():
        """Get all abilities"""
        return ClassAbility.query.all()

    @staticmethod
    def get_ability_by_id(ability_id):
        """Get ability by ID"""
        return ClassAbility.query.get(ability_id)
    
    @staticmethod
    def get_ability_by_class(class_id):
        """Get abilities by class ID"""
        return ClassAbility.query.filter_by(class_id=class_id).all()

    @staticmethod
    def get_ability_by_subclass(subclass_id):
        """Get abilities by subclass ID"""
        return ClassAbility.query.filter_by(subclass_id=subclass_id).all()

    @staticmethod
    def update_ability(ability_id, name=None, description=None, subclass_id=None):
        """Update ability"""
        ability = ClassAbility.query.get(ability_id)
        if not ability:
            return None, "Abilidade não encontrada"
        
        if name:
            ability.name = name
        if description:
            ability.description = description
        if subclass_id:
            if (subclass := Subclass.query.get(subclass_id)):  # Validate subclass exists
                if ability.class_id and subclass.class_id != ability.class_id:
                    return None, "Subclass does not belong to the specified class"
                ability.subclass_id = subclass_id
            elif int(subclass_id, 0) == -1:
                ability.subclass_id = None
            else:
                return None, "Subclasse Não Encontrada"
        db.session.commit()
        return ability, None

    @staticmethod
    def delete_ability(ability_id):
        """Delete ability"""
        ability = ClassAbility.query.get(ability_id)
        if not ability:
            return False, "Ability not found"
        
        db.session.delete(ability)
        db.session.commit()
        return True, None

    @staticmethod
    def toggle_ability_hidden_status(ability_id):
        """Toggle ability hidden status"""
        ability = ClassAbility.query.get(ability_id)
        if not ability:
            return None, "Ability not found"
        
        ability.hidden = not ability.hidden
        db.session.commit()
        return ability, None

    @staticmethod
    def toggle_ability_visibility(ability_id):
        """Compatibility alias for toggling ability visibility"""
        return ClassAbilityService.toggle_ability_hidden_status(ability_id)

    @staticmethod
    def add_ability_to_character(character_id, ability_id):
        """Add an ability to a character"""
        character = Character.query.get(character_id)
        ability = ClassAbility.query.get(ability_id)
        if not character:
            return None, "Character not found"
        if not ability:
            return None, "Ability not found"
        
        if ability in character.abilities:
            return None, "Ability already assigned to character"
        
        character.abilities.append(ability)
        db.session.commit()
        return character, None
    
    @staticmethod
    def remove_ability_from_character(character_id, ability_id):
        """Remove an ability from a character"""
        character = Character.query.get(character_id)
        ability = ClassAbility.query.get(ability_id)
        if not character:
            return None, "Character not found"
        if not ability:
            return None, "Ability not found"
        
        if ability not in character.abilities:
            return None, "Ability not assigned to character"
        
        character.abilities.remove(ability)
        db.session.commit()
        return character, None
    
class SpecialAbilityService:
    @staticmethod
    def get_all_special_abilities():
        """Get all special abilities"""
        return CharacterSpecialAbility.query.all()
    
    @staticmethod
    def get_special_ability_by_id(special_ability_id):
        """Get special ability by ID"""
        return CharacterSpecialAbility.query.get(special_ability_id)

    @staticmethod
    def create_special_ability(name, description, character_id):
        """Create a new special ability for a character"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        special_ability = CharacterSpecialAbility(
            name=name,
            description=description,
            character_id=character_id
        )
        db.session.add(special_ability)
        db.session.commit()
        return special_ability, None
    
    @staticmethod
    def update_special_ability(special_ability_id, name=None, description=None):
        """Update a special ability"""
        special_ability = CharacterSpecialAbility.query.get(special_ability_id)
        if not special_ability:
            return None, "Special ability not found"
        
        if name:
            special_ability.name = name
        if description:
            special_ability.description = description
        
        db.session.commit()
        return special_ability, None
    
    @staticmethod
    def delete_special_ability(special_ability_id):
        """Delete a special ability"""
        special_ability = CharacterSpecialAbility.query.get(special_ability_id)
        if not special_ability:
            return False, "Special ability not found"
        
        db.session.delete(special_ability)
        db.session.commit()
        return True, None
    
    @staticmethod
    def delete_all_character_special_abilities(character_id):
        """Delete all special abilities of a character (used when deleting a character)"""
        special_abilities = CharacterSpecialAbility.query.filter_by(character_id=character_id).all()
        for ability in special_abilities:
            db.session.delete(ability)
        db.session.commit() 
    


class ClassPowerService:
    @staticmethod
    def create_class_power(name, description, class_id, level_to_unlock=1):
        """Create a new class power"""
        class_power = ClassPower(name=name, description=description, class_id=class_id, level_to_unlock=level_to_unlock)
        db.session.add(class_power)
        db.session.commit()
        return class_power

    @staticmethod
    def get_all_class_powers():
        """Get all class powers"""
        return ClassPower.query.all()

    @staticmethod
    def get_class_power_by_id(power_id):
        """Get class power by ID"""
        return ClassPower.query.get(power_id)
    
    @staticmethod
    def get_class_powers_by_class(class_id):
        """Get class powers by class ID"""
        return ClassPower.query.filter_by(class_id=class_id).all()
    
    @staticmethod
    def update_class_power(power_id, name=None, description=None, class_id=None, level_to_unlock=None):
        """Update class power"""
        class_power = ClassPower.query.get(power_id)
        if not class_power:
            return None, "Class power not found"
        
        if name:
            class_power.name = name
        if description:
            class_power.description = description
        if class_id:
            if (not Class.query.get(class_id)):  # Validate class exists
                return None, "Class not found"
            class_power.class_id = class_id
        if level_to_unlock is not None:
            class_power.level_to_unlock = level_to_unlock
        
        db.session.commit()
        return class_power, None
    
    @staticmethod
    def delete_class_power(power_id):
        """Delete class power"""
        class_power = ClassPower.query.get(power_id)
        if not class_power:
            return False, "Class power not found"
        
        db.session.delete(class_power)
        db.session.commit()
        return True, None
    
    @staticmethod
    def toggle_class_power_visibility(power_id):
        """Toggle class power visibility"""
        class_power = ClassPower.query.get(power_id)
        if not class_power:
            return None, "Class power not found"
        
        class_power.hidden = not class_power.hidden
        db.session.commit()
        return class_power, None
    

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
    
    @staticmethod
    def toggle_race_hidden_status(race_id):
        """Toggle race hidden status"""
        race = Race.query.get(race_id)
        if not race:
            return None, "Race not found"
        
        race.hidden = not race.hidden
        db.session.commit()
        return race, None

    @staticmethod
    def toggle_race_visibility(race_id):
        """Compatibility alias for toggling race visibility"""
        return RaceService.toggle_race_hidden_status(race_id)



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
    def get_pericias_by_attribute(attribute_id):
        """Get pericias by attribute ID"""
        return Pericia.query.filter_by(attribute_id=attribute_id).all()

    @staticmethod
    def update_pericia(pericia_id, name=None, description=None, attribute_id=None):
        """Update pericia"""
        pericia = Pericia.query.get(pericia_id)
        if not pericia:
            return None, "Pericia not found"

        
        if name:
            pericia.name = name
        if description:
            pericia.description = description
        if attribute_id:
            pericia.attribute_id = attribute_id
        
        db.session.commit()
        db.session.commit()
        return pericia, None

    @staticmethod
    def delete_pericia(pericia_id):
        """Delete pericia"""
        pericia = Pericia.query.get(pericia_id)
        if not pericia:
            return False, "Pericia not found"

      
        db.session.delete(pericia)
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


class AttributePowerService:
    @staticmethod
    def create_attribute_power(name, description, level_to_unlock, attribute_id):
        """Create a new attribute power"""
        attribute_power = AttributePower(name=name, description=description, attribute_id=attribute_id, level_to_unlock=level_to_unlock)
        db.session.add(attribute_power)
        db.session.commit()
        return attribute_power

    @staticmethod
    def get_all_attribute_powers():
        """Get all attribute powers"""
        return AttributePower.query.all()
    
    @staticmethod
    def get_attribute_power_by_id(power_id):
        """Get attribute power by ID"""
        return AttributePower.query.get(power_id)
    
    @staticmethod
    def get_attribute_powers_by_attribute(attribute_id):
        """Get attribute powers by attribute ID"""
        return AttributePower.query.filter_by(attribute_id=attribute_id).all()
    
    @staticmethod
    def update_attribute_power(power_id, name=None, description=None, level_to_unlock=None):
        """Update attribute power"""
        attribute_power = AttributePower.query.get(power_id)
        if not attribute_power:
            return None, "Attribute power not found"
        
        if name:
            attribute_power.name = name
        if description:
            attribute_power.description = description
        if level_to_unlock is not None:
            attribute_power.level_to_unlock = level_to_unlock
        
        db.session.commit()
        return attribute_power, None

    @staticmethod
    def delete_attribute_power(power_id):
        """Delete attribute power"""
        attribute_power = AttributePower.query.get(power_id)
        if not attribute_power:
            return False, "Attribute power not found"

        db.session.delete(attribute_power)
        db.session.commit()
        return True, None


    @staticmethod
    def toggle_attribute_power_visibility(power_id):
        """Toggle attribute power visibility"""
        attribute_power = AttributePower.query.get(power_id)
        if not attribute_power:
            return None, "Attribute power not found"
        
        attribute_power.hidden = not attribute_power.hidden
        db.session.commit()
        return attribute_power, None


class ClassService:
    @staticmethod
    def create_class(name, description, base_life=10, base_defense=10, base_sanity=10, base_mana=10, base_ocultism=10, base_power=10, has_mana=False, has_ocultism=False):
        """Create a new class"""
        char_class = Class(name=name, description=description, base_life=base_life, base_defense=base_defense, base_sanity=base_sanity, base_mana=base_mana, base_ocultism=base_ocultism, base_power=base_power, has_mana=has_mana, has_ocultism=has_ocultism)
        db.session.add(char_class)
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
    def update_class(class_id, name=None, description=None, base_life=None, base_defense=None, base_sanity=None, base_mana=None, base_ocultism=None, base_power=None, has_mana=None, has_ocultism=None):
        """Update class"""
        char_class: Class = Class.query.get(class_id)
        if not char_class:
            return None, "Class not found"
        
        if name:
            char_class.name = name
        if description:
            char_class.description = description
        if base_life is not None:
            char_class.base_life = base_life
        if base_defense is not None:
            char_class.base_defense = base_defense
        if base_sanity is not None:
            char_class.base_sanity = base_sanity
        if base_mana is not None:
            char_class.base_mana = base_mana
        if base_ocultism is not None:
            char_class.base_ocultism = base_ocultism
        if base_power is not None:
            char_class.base_power = base_power
        if has_mana is not None:
            char_class.has_mana = has_mana
        if has_ocultism is not None:
            char_class.has_ocultism = has_ocultism
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
    def create_subclass(name, description, class_id):
        """Create a new subclass under a class"""
        char_class = Class.query.get(class_id)
        if not char_class:
            return None, "Class not found"
        
        subclass = Subclass(name=name, description=description, class_id=class_id)
        db.session.add(subclass)
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
    def get_subclasses_by_class(class_id):
        """Get subclasses by class ID"""
        return Subclass.query.filter_by(class_id=class_id).all()

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

class AttributeValueService:
    @staticmethod
    def create_character_attributes(character_id):
        """Create attribute values for a new character"""
        attributes = Attribute.query.all()
        for attribute in attributes:
            char_attr_value = AttributeValue(attribute_id=attribute.id, character_id=character_id)
            db.session.add(char_attr_value)
            db.session.flush()  # Flush to get the ID for pericia values
            
            # Create pericia values for each attribute
            pericias = Pericia.query.filter_by(attribute_id=attribute.id).all()
            for pericia in pericias:
                char_pericia_value = PericiaValue(pericia_id=pericia.id, attribute_value_id=char_attr_value.id)
                char_attr_value.pericias.append(char_pericia_value)
      
        db.session.commit()

    @staticmethod
    def sync_character_attributes(character_id):
        """If an attribute or pericia is created/deleted, sync the character's attribute and pericia values accordingly"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        existing_attr_values = {attr_value.attribute_id: attr_value for attr_value in character.attributes}
        all_attributes = Attribute.query.all()
        for attribute in all_attributes:
            if attribute.id not in existing_attr_values:
                # Create missing attribute value
                char_attr_value = AttributeValue(attribute_id=attribute.id, character_id=character_id)
                db.session.add(char_attr_value)
                db.session.flush()  # Flush to get the ID for pericia values
                
                # Create pericia values for each new attribute
                pericias = Pericia.query.filter_by(attribute_id=attribute.id).all()
                for pericia in pericias:
                    char_pericia_value = PericiaValue(pericia_id=pericia.id, attribute_value_id=char_attr_value.id)
                    char_attr_value.pericias.append(char_pericia_value)

        # Check for deleted attributes and remove them
        existing_attribute_ids = set(existing_attr_values.keys())
        for attr_id in existing_attribute_ids:
            if attr_id not in {attr.id for attr in all_attributes}:
                char_attr_value = existing_attr_values[attr_id]
                db.session.delete(char_attr_value)


        periciass = Pericia.query.all()
        for pericia in periciass:
            if pericia.id not in [pericia_value.pericia_id for attr_value in character.attributes for pericia_value in attr_value.pericias]:
                # Create missing pericia value
                char_attr_value = AttributeValue.query.filter_by(character_id=character_id, attribute_id=pericia.attribute_id).first()
                if char_attr_value:
                    char_pericia_value = PericiaValue(pericia_id=pericia.id, attribute_value_id=char_attr_value.id)
                    char_attr_value.pericias.append(char_pericia_value)


        # Check for deleted pericias and remove them
        existing_pericia_ids = {pericia_value.pericia_id for attr_value in character.attributes for pericia_value in attr_value.pericias}
        for pericia_id in existing_pericia_ids:
            if pericia_id not in {pericia.id for pericia in periciass}:
                char_pericia_value = PericiaValue.query.filter_by(pericia_id=pericia_id).first()
                if char_pericia_value:
                    db.session.delete(char_pericia_value)
        db.session.commit()

    @staticmethod
    def sync_all_attributes():
        """Sync attributes and pericias for all characters (useful when an attribute or pericia is created/deleted)"""
        characters = Character.query.all()
        for character in characters:
            AttributeValueService.sync_character_attributes(character.id)

    @staticmethod
    def delete_character_attributes(character_id):
        """Delete attribute values when a character is deleted"""
        char_attr_values = AttributeValue.query.filter_by(character_id=character_id).all()
        for attr_value in char_attr_values:
            for pericia_value in attr_value.pericias:
                db.session.delete(pericia_value)
            db.session.delete(attr_value)
        db.session.commit()
    
    @staticmethod
    def get_attributes_by_character(character_id):
        """Get all attributes with their values and pericias for a character"""
        char_attr_values = AttributeValue.query.filter_by(character_id=character_id).all()
        attributes = []
        for attr_value in char_attr_values:
            attribute = Attribute.query.get(attr_value.attribute_id)
            if attribute:
                total_pericia_bonus = sum(pericia.value for pericia in attr_value.pericias)
                attributes.append({
                    'id': attribute.id,
                    'name': attribute.name,
                    'description': attribute.description,
                    'value': total_pericia_bonus,
                })
        return attributes, None
    
class PericiaValueService:
    @staticmethod
    def update_pericia_value(pericia_value_id, new_value):
        """Update the value of a character's pericia"""
        pericia_value = PericiaValue.query.get(pericia_value_id)
        if not pericia_value:
            return None, "Pericia value not found"
        
        pericia_value.value = new_value
        db.session.commit()
        return pericia_value, None
    

class CharacterService:
    @staticmethod
    def create_character(user_id, is_player=True):
        """Create a new character with default values"""
        character = Character(own=user_id, is_player=is_player)
        db.session.add(character)
        db.session.flush()
        
        # Create default attributes and pericias for the character
        AttributeValueService.create_character_attributes(character.id)
        

        stats_limits, error = CharacterService.calculate_stat_limits(character.id)
        if error:
            db.session.rollback()
            return None, error
        
        for stat, values in stats_limits.items():
            setattr(character, stat, values["total_max"])
        
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
    def calculate_stat_limits(character_id):
        """Calculate maximum stat limits for the character sheet"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        character_class = Class.query.get(character.charClass) if character.charClass else None
        
        stats = {
            "life": {
                "base": getattr(character_class, "base_life", 0) + getattr(character, "offset_life", 0),
                "bonus": getattr(character, "att_life", 0) + getattr(character, "offset_life", 0)
            },
            "sanity": {
                "base": getattr(character_class, "base_sanity", 0) + getattr(character, "offset_sanity", 0),
                "bonus": getattr(character, "att_sanity", 0) + getattr(character, "offset_sanity", 0)
            },
            "ocultism": {
                "base": getattr(character_class, "base_ocultism", 0) + getattr(character, "offset_ocultism", 0),
                "bonus": getattr(character, "att_ocultism", 0) + getattr(character, "offset_ocultism", 0)
            },
            "mana": {
                "base": getattr(character_class, "base_mana", 0) + getattr(character, "offset_mana", 0),
                "bonus": getattr(character, "att_mana", 0) + getattr(character, "offset_mana", 0)
            },
            "defense": {
                "base": getattr(character_class, "base_defense", 0) + getattr(character, "offset_defense", 0),
                "bonus": getattr(character, "att_defense", 0) + getattr(character, "offset_defense", 0)
            },
            "power": {
                "base": getattr(character_class, "base_power", 0) + getattr(character, "offset_power", 0),
                "bonus": getattr(character, "att_power", 0) + getattr(character, "offset_power", 0)
            },
            "inventory_capacity": {
                "base": getattr(character_class, "base_inventory_capacity", 10) + getattr(character, "offset_inventory_capacity", 0),
                "bonus": getattr(character, "att_inventory_capacity", 0) + getattr(character, "offset_inventory_capacity", 0)
            }
        }

        for stat, values in stats.items():
            values["total_max"] = values["base"] + values["bonus"]

        return stats, None

    @staticmethod
    def update_character_general(character_id, name=None, charClass=None, subclass=None, second_class=None, race=None, gender=None, age=None, level=None, experience=None):
        """Update character fields"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        if charClass and not Class.query.get(charClass):
            return None, "Class not found"
        if subclass and not Subclass.query.get(subclass):
            return None, "Subclass not found"
        if second_class and not Class.query.get(second_class):
            return None, "Second class not found"
        if race and not Race.query.get(race):
            return None, "Race not found"
        
        if name:
            character.name = name
        if charClass:
            character.charClass = charClass
        if subclass:
            character.subclass = subclass
        if second_class:
            character.second_class = second_class
        if race:
            character.race = race
        if gender:
            character.gender = gender
        if age is not None:
            character.age = age
        if level is not None:
            character.level = level
        if experience is not None:
            character.experience = experience
        db.session.commit()
        return character, None




    @staticmethod
    def update_character_stats(character_id, life=None, defense=None, sanity=None, ocultism=None, mana=None):
        """Update character stats"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        stats_limits, error = CharacterService.calculate_stat_limits(character_id)
        if error:
            return None, error

        if life is not None:
            if life > stats_limits["life"]["total_max"]:
                return None, f"Life cannot exceed {stats_limits['life']['total_max']}"
            character.life = life
        if sanity is not None:
            if sanity > stats_limits["sanity"]["total_max"]:
                return None, f"Sanity cannot exceed {stats_limits['sanity']['total_max']}"
            character.sanity = sanity
        if ocultism is not None:
            if ocultism > stats_limits["ocultism"]["total_max"]:
                return None, f"Ocultism cannot exceed {stats_limits['ocultism']['total_max']}"
            character.ocultism = ocultism
        if mana is not None:
            if mana > stats_limits["mana"]["total_max"]:
                return None, f"Mana cannot exceed {stats_limits['mana']['total_max']}"
            character.mana = mana

        db.session.commit()
        return character, None
    
    @staticmethod
    def update_stats_off_sets(character_id, offset_life=None, offset_defense=None, offset_sanity=None, offset_ocultism=None, offset_mana=None, offset_power=None):
        """Admin update character stat offsets"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        if offset_life is not None:
            character.offset_life = offset_life
        if offset_defense is not None:
            character.offset_defense = offset_defense
        if offset_sanity is not None:
            character.offset_sanity = offset_sanity
        if offset_ocultism is not None:
            character.offset_ocultism = offset_ocultism
        if offset_mana is not None:
            character.offset_mana = offset_mana
        if offset_power is not None:
            character.offset_power = offset_power

        db.session.commit()
        return character, None

    @staticmethod
    def update_character_description(character_id, physical_description=None, psychological_description=None, backstory=None):
        """Update character descriptions"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        if physical_description is not None:
            character.physical_description = physical_description
        if psychological_description is not None:
            character.psychological_description = psychological_description
        if backstory is not None:
            character.backstory = backstory

        db.session.commit()
        return character, None

    @staticmethod
    def delete_character(character_id):
        """Delete character"""
        character = Character.query.get(character_id)
        if not character:
            return False, "Character not found"
        
        # Delete associated attributes
        AttributeValueService.delete_character_attributes(character_id)
        SpecialAbilityService.delete_all_character_special_abilities(character_id)
        InventoryService.delete_character_inventories(character_id)

        db.session.delete(character)
        db.session.commit()
        return True, None
    
    @staticmethod
    def sync_stats_limit_change(character_id):
        """Sync character stats when class or level changes that affect stat limits"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        stats_limits, error = CharacterService.calculate_stat_limits(character_id)
        if error:
            return None, error

        if character.life > stats_limits["life"]["total_max"]:
            character.life = stats_limits["life"]["total_max"] if stats_limits["life"]["total_max"] >= 0 else 0
        if character.sanity > stats_limits["sanity"]["total_max"]:
            character.sanity = stats_limits["sanity"]["total_max"] if stats_limits["sanity"]["total_max"] >= 0 else 0
        if character.ocultism > stats_limits["ocultism"]["total_max"]:
            character.ocultism = stats_limits["ocultism"]["total_max"] if stats_limits["ocultism"]["total_max"] >= 0 else 0
        if character.mana > stats_limits["mana"]["total_max"]:
            character.mana = stats_limits["mana"]["total_max"] if stats_limits["mana"]["total_max"] >= 0 else 0

        db.session.commit()
        return character, None

    @staticmethod
    def sync_attributes_stats_change(character_id):
        """Sync character attributes and stats based on conversion rules"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        # Get all conversion rules
        conversion_rules = ConversionRule.query.all()

        # Set base stats to 0 before applying conversions
        character.att_life = 0
        character.att_defense = 0
        character.att_sanity = 0
        character.att_ocultism = 0
        character.att_mana = 0
        character.att_power = 0
        character.att_inventory_capacity = 0
        pericias_ids = [pericia_value.pericia_id for attr_value in character.attributes for pericia_value in attr_value.pericias]

        for rule in conversion_rules:
            if rule.conversion_type == "attribute":
                # Get the attribute value for the character
                attr_value = AttributeValue.query.filter_by(character_id=character_id, attribute_id=rule.attribute_id).first()
                if not attr_value:
                    continue
                total_pericia_bonus = sum(pericia.value for pericia in attr_value.pericias)
                att_stat = int(total_pericia_bonus * rule.rate)
            elif rule.conversion_type == "pericia":
                # Get the pericia value for the character
                pericias_values = PericiaValue.query.filter(PericiaValue.pericia_id == rule.pericia_id).all()
                for pericia_value in pericias_values:
                    attr_value = AttributeValue.query.get(pericia_value.attribute_value_id)
                    if attr_value and attr_value.character_id == character_id:
                        att_stat = int(pericia_value.value * rule.rate)
                        break
                else:
                    att_stat = 0
            else:
                continue
        
            # Update the corresponding stat on the character
            if rule.stat == "life":
                character.att_life += att_stat  # attribute bonus to life
            elif rule.stat == "defense":
                character.att_defense += att_stat  # attribute bonus to defense
            elif rule.stat == "sanity":
                character.att_sanity += att_stat  # attribute bonus to sanity
            elif rule.stat == "ocultism":
                character.att_ocultism += att_stat  # attribute bonus to ocultism
            elif rule.stat == "mana":
                character.att_mana += att_stat  # attribute bonus to mana
            elif rule.stat == "power":
                character.att_power += att_stat  # attribute bonus to power
            elif rule.stat == "inventory_capacity":
                character.att_inventory_capacity += att_stat  # attribute bonus to inventory capacity

        
        InventoryService.sync_carried_capacity(character_id)

        db.session.commit()
        return character, None

    def sync_all_conversions(character_id):
        """Sync all conversions for a character (stats and attributes)"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        # First sync attributes to update any pericia bonuses
        CharacterService.sync_attributes_stats_change(character_id)
        # Then sync stats to ensure they are within limits after attribute changes
        CharacterService.sync_stats_limit_change(character_id)

        return character, None
    
    def sync_all():
        """Sync all character data (attributes, stats, and limits)"""
        characters = Character.query.all()
        for character in characters:
            CharacterService.sync_attributes_stats_change(character.id)
            CharacterService.sync_stats_limit_change(character.id)

        return character, None

    @staticmethod
    def transferCharacterOwnership(character_id, new_user_id):
        """Transfer character ownership to another user"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        user = User.query.get(new_user_id)
        if not user:
            return None, "New owner not found"

        if user.role != "admin":
            character.is_player = True

        character.own = new_user_id
        db.session.commit()
        return character, None
    
    @staticmethod
    def toggle_character_active_status(character_id):
        """Toggle character active status"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        character.active = not character.active
        db.session.commit()
        return character, None
    
    @staticmethod
    def toggle_character_player_status(character_id):
        """Toggle character player status"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        character.is_player = not character.is_player
        db.session.commit()
        return character, None


class CharacterAttributesService:
    @staticmethod
    def get_character_attributes(character_id):
        """Return character attribute and pericia for the controller"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        attributes = []

        for attr_value in character.attributes:
            attributes.append({
                **attr_value.toDict(),
                **attr_value.attribute.toDict()
            })

        for attr in attributes:
            pericias = []
            for pericia_value in attr["pericias"]:
                pericia = Pericia.query.get(pericia_value["pericia_id"])
                if pericia:
                    pericias.append({
                        **pericia_value,
                        **pericia.toDict()
                    })
            attr["pericias"] = pericias

        return attributes, None


    @staticmethod
    def bulk_update_character_pericias(character_id, pericias):
        """Update the stored pericia values for a character"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        character_pericias = {pericia_value.pericia_id: pericia_value for attr_value in character.attributes for pericia_value in attr_value.pericias}

        for item in pericias or []:
            pericia_id = item.get("pericia_id")
            if pericia_id is None:
                continue

            value = item.get("value")

            if pericia_id in character_pericias:
                character_pericias[pericia_id].value = value

        
        for pericia_value in character_pericias.values():
            db.session.add(pericia_value)

        db.session.commit()
        return character, None

class ConversionRuleService:
    @staticmethod
    def create_conversion_rule(attribute_id, stat, rate, conversion_type, target_id=None):
        """Create a new conversion rule"""
        attribute_id = None
        pericia_id = None
        if conversion_type not in ["attribute", "pericia"]:
            return None, "Invalid conversion type"
        
        if conversion_type == "attribute":
            if not Attribute.query.get(target_id):
                return None, "Attribute not found"
            attribute_id = target_id
        elif conversion_type == "pericia":
            if not Pericia.query.get(target_id):
                return None, "Pericia not found"
            pericia_id = target_id

        if ConversionRule.query.filter_by(stat=stat, conversion_type=conversion_type, attribute_id=attribute_id, pericia_id=pericia_id).first():
            return None, "Conversion rule for this stat and source already exists"

        conversion_rule = ConversionRule(attribute_id=attribute_id, stat=stat, rate=rate, pericia_id=pericia_id, conversion_type=conversion_type)
        db.session.add(conversion_rule)
        db.session.commit()
        return conversion_rule, None

    @staticmethod
    def get_all_conversion_rules():
        """Get all conversion rules"""
        return ConversionRule.query.all()

    @staticmethod
    def get_conversion_rule_by_id(rule_id):
        """Get conversion rule by ID"""
        return ConversionRule.query.get(rule_id)

    @staticmethod
    def update_conversion_rule(rule_id, attribute_id=None, stat=None, rate=None):
        """Update conversion rule"""
        conversion_rule = ConversionRule.query.get(rule_id)
        if not conversion_rule:
            return None, "Conversion rule not found"
        
        if attribute_id:
            conversion_rule.attribute_id = attribute_id
        if stat:
            conversion_rule.stat = stat
        if rate is not None:
            conversion_rule.rate = rate
        db.session.commit()
        return conversion_rule, None
    
    @staticmethod
    def delete_conversion_rule(rule_id):
        """Delete conversion rule"""
        conversion_rule = ConversionRule.query.get(rule_id)
        if not conversion_rule:
            return False, "Conversion rule not found"
        
        db.session.delete(conversion_rule)
        db.session.commit()
        return True, None

class LevelUpRuleService:
    @staticmethod
    def create_level_up_rule(level, experience_required, description):
        """Create a new level up rule"""
        if LevelUpRule.query.filter_by(level=level).first():
            return None, "Level up rule for this level already exists"
        level_up_rule = LevelUpRule(level=level, experience_required=experience_required, description=description)
        db.session.add(level_up_rule)
        db.session.commit()
        return level_up_rule

    @staticmethod
    def get_all_level_up_rules():
        """Get all level up rules"""
        return LevelUpRule.query.all()

    @staticmethod
    def get_level_up_rule_by_id(rule_id):
        """Get level up rule by ID"""
        return LevelUpRule.query.get(rule_id)

    @staticmethod
    def update_level_up_rule(rule_id, level=None, experience_required=None, description=None):
        """Update level up rule"""
        level_up_rule = LevelUpRule.query.get(rule_id)
        if not level_up_rule:
            return None, "Level up rule not found"
        
        if level is not None:
            if (level_up_rule.level != level and LevelUpRule.query.filter_by(level=level).first()):
                return None, "Level up rule for this level already exists"
            level_up_rule.level = level
        if experience_required is not None:
            level_up_rule.experience_required = experience_required
        if description is not None:
            level_up_rule.description = description
        db.session.commit()
        return level_up_rule, None
    
    @staticmethod
    def delete_level_up_rule(rule_id):
        """Delete level up rule"""
        level_up_rule = LevelUpRule.query.get(rule_id)
        if not level_up_rule:
            return False, "Level up rule not found"
        
        db.session.delete(level_up_rule)
        db.session.commit()
        return True, None
    
# RITUALS SERVICE
class RitualService:
    def get_all_rituals():
        """Get all rituals"""
        return Ritual.query.all()

    def get_ritual_by_id(ritual_id):
        """Get ritual by ID"""
        return Ritual.query.get(ritual_id)
    
    def create_ritual(name, description, ocultism_cost, power_level, subclass_id=None):
        """Create a new ritual"""
        ritual = Ritual(name=name, description=description, ocultism_cost=ocultism_cost, power_level=power_level, subclass_id=subclass_id)
        db.session.add(ritual)
        db.session.commit()
        return ritual
    
    def update_ritual(ritual_id, name=None, description=None, ocultism_cost=None, power_level=None, subclass_id=None):
        """Update ritual"""
        ritual = Ritual.query.get(ritual_id)
        if not ritual:
            return None, "Ritual não encontrado"
        
        if name:
            ritual.name = name
        if description:
            ritual.description = description
        if ocultism_cost is not None:
            ritual.ocultism_cost = ocultism_cost
        if power_level is not None:
            ritual.power_level = power_level
        if subclass_id is not None:
            subclass = Subclass.query.get(subclass_id)
            if not subclass:
                return None, "Subclass não encontrada"
            cl = Class.query.get(subclass.class_id)
            if not cl:
                return None, "Class não encontrada"
            if not cl.has_ocultism:
                return None, "A classe associada à subclasse não possui ocultismo"
            ritual.subclass_id = subclass_id
        
        db.session.commit()
        return ritual, None
    
    def delete_ritual(ritual_id):
        """Delete ritual"""
        ritual = Ritual.query.get(ritual_id)
        if not ritual:
            return False, "Ritual não encontrado"
        
        db.session.delete(ritual)
        db.session.commit()
        return True, None
    
    def toggle_ritual_hidden_status(ritual_id):
        """Toggle ritual hidden status"""
        ritual = Ritual.query.get(ritual_id)
        if not ritual:
            return None, "Ritual não encontrado"
        
        ritual.hidden = not ritual.hidden
        db.session.commit()
        return ritual, None
    
    def assign_ritual_to_character(ritual_id, character_id):
        """Assign ritual to character"""
        ritual = Ritual.query.get(ritual_id)
        if not ritual:
            return None, "Ritual não encontrado"
        
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        if ritual in character.rituals:
            return None, "Ritual já atribuído ao personagem"
        
        character.rituals.append(ritual)
        db.session.commit()
        return character, None
    
    def unassign_ritual_from_character(ritual_id, character_id):
        """Unassign ritual from character"""
        ritual = Ritual.query.get(ritual_id)
        if not ritual:
            return None, "Ritual não encontrado"
        
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        if ritual not in character.rituals:
            return None, "Ritual não está atribuído ao personagem"
        character.rituals.remove(ritual)
        db.session.commit()
        return character, None

# WIZARDCRAFT SERVICE
class WizardcraftService:
    def get_all_wizardcrafts():
        """Get all wizardcrafts"""
        return Wizardcraft.query.all()

    def get_wizardcraft_by_id(wizardcraft_id):
        """Get wizardcraft by ID"""
        return Wizardcraft.query.get(wizardcraft_id)
    
    def create_wizardcraft(name, description, mana_cost):
        """Create a new wizardcraft"""
        wizardcraft = Wizardcraft(name=name, description=description, mana_cost=mana_cost)
        db.session.add(wizardcraft)
        db.session.commit()
        return wizardcraft
    
    def update_wizardcraft(wizardcraft_id, name=None, description=None, mana_cost=None):
        """Update wizardcraft"""
        wizardcraft = Wizardcraft.query.get(wizardcraft_id)
        if not wizardcraft:
            return None, "Feitiço não encontrado"
        
        if name:
            wizardcraft.name = name
        if description:
            wizardcraft.description = description
        if mana_cost is not None:
            wizardcraft.mana_cost = mana_cost
        
        db.session.commit()
        return wizardcraft, None
    
    def delete_wizardcraft(wizardcraft_id):
        """Delete wizardcraft"""
        wizardcraft = Wizardcraft.query.get(wizardcraft_id)
        if not wizardcraft:
            return False, "Feitiço não encontrado"
        
        db.session.delete(wizardcraft)
        db.session.commit()
        return True, None
    
    def toggle_wizardcraft_hidden_status(wizardcraft_id):
        """Toggle wizardcraft hidden status"""
        wizardcraft = Wizardcraft.query.get(wizardcraft_id)
        if not wizardcraft:
            return None, "Feitiço não encontrado"
        
        wizardcraft.hidden = not wizardcraft.hidden
        db.session.commit()
        return wizardcraft, None
    
    def assign_wizardcraft_to_character(wizardcraft_id, character_id):
        """Assign wizardcraft to character"""
        wizardcraft = Wizardcraft.query.get(wizardcraft_id)
        if not wizardcraft:
            return None, "Feitiço não encontrado"
        
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        if wizardcraft in character.wizardcrafts:
            return None, "Feitiço já atribuído ao personagem"
        
        character.wizardcrafts.append(wizardcraft)
        db.session.commit()
        return character, None
    
    def unassign_wizardcraft_from_character(wizardcraft_id, character_id):
        """Unassign wizardcraft from character"""
        wizardcraft = Wizardcraft.query.get(wizardcraft_id)
        if not wizardcraft:
            return None, "Feitiço não encontrado"
        
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        if wizardcraft not in character.wizardcrafts:
            return None, "Feitiço não está atribuído ao personagem"
        
        character.wizardcrafts.remove(wizardcraft)
        db.session.commit()
        return character, None
    

class InventoryService:
    @staticmethod
    def get_character_inventories(character_id):
        """Get all inventories for a character"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        inventories = Inventory.query.filter_by(character_id=character_id).all()

        has_equipment_inventory = any(inventory.inv_type == InventoryType.EQUIPED for inventory in inventories)
        has_cargo_inventory = any(inventory.inv_type == InventoryType.CARRIED for inventory in inventories)
        if (not has_equipment_inventory or not has_cargo_inventory):
            InventoryService.create_standards_inventories_for_character(character_id)
            inventories = Inventory.query.filter_by(character_id=character_id).all()
            
        
        return [i.toDict() for i in inventories], None
    
    @staticmethod
    def get_inventory_by_id(inventory_id):
        """Get inventory by ID"""
        return Inventory.query.get(inventory_id)
    
    @staticmethod
    def get_inventory_items(inventory_id):
        """Get all items in an inventory"""
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            return None, "Inventário não encontrado"
        
        items = {}
        for inventory_item in inventory.items:
            item = Item.query.get(inventory_item.item_id)
            if item:
                if item.item_type not in items:
                    items[item.item_type] = []
                items[item.item_type].append({
                    **inventory_item.toDict(),
                    **item.toDict()
                })
        
        return items, None
    
    @staticmethod
    def add_item_to_inventory(inventory_id, item_id, quantity=1):
        """Add an item to an inventory"""
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            return None, "Inventário não encontrado"
        
        item: Item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        items_added = 0

        max_quantity = item.max_quantity if item.max_quantity else 1

        # Check if the item is stackable and already exists in the inventory
        existing_inventory_items: list[Item] = InventoryItem.query.filter_by(inventory_id=inventory_id, item_id=item_id).all()
        if item.stackable and existing_inventory_items:
            for i, inventory_item in enumerate(existing_inventory_items):
                if item.stackable:
                    inventory_item.quantity += quantity
                    if inventory_item.quantity > max_quantity:
                        quantity = inventory_item.quantity - max_quantity
                        inventory_item.quantity = max_quantity
                        db.session.add(inventory_item)
                    else:
                        db.session.add(inventory_item)
                        db.session.commit()
                        return inventory_item, None
            
            while quantity > 0:
                if inventory.capacity != -1 and len(inventory.items) + items_added >= inventory.capacity:
                    db.session.rollback()
                    return None, "Inventário cheio"
                if quantity > max_quantity:
                    new_inventory_item = InventoryItem(inventory_id=inventory_id, item_id=item_id, quantity=max_quantity)
                    db.session.add(new_inventory_item)
                    quantity -= max_quantity
                    items_added += 1
                else:
                    new_inventory_item = InventoryItem(inventory_id=inventory_id, item_id=item_id, quantity=quantity)
                    db.session.add(new_inventory_item)
                    break
            db.session.commit()
            return existing_inventory_items, None
        
        while quantity > 0:
            if inventory.capacity != -1 and len(inventory.items) + items_added >= inventory.capacity:
                db.session.rollback()
                return None, "Inventário cheio"
            if not item.stackable and quantity > 1:
                new_inventory_item = InventoryItem(inventory_id=inventory_id, item_id=item_id, quantity=1)
                db.session.add(new_inventory_item)
                quantity -= 1
                items_added += 1
            elif not item.stackable and quantity == 1:
                new_inventory_item = InventoryItem(inventory_id=inventory_id, item_id=item_id, quantity=1)
                db.session.add(new_inventory_item)
                break
            else:
                if quantity > max_quantity:
                    new_inventory_item = InventoryItem(inventory_id=inventory_id, item_id=item_id, quantity=max_quantity)
                    db.session.add(new_inventory_item)
                    quantity -= max_quantity
                    items_added += 1
                else:
                    new_inventory_item = InventoryItem(inventory_id=inventory_id, item_id=item_id, quantity=quantity)
                    db.session.add(new_inventory_item)
                    break
        db.session.commit()
        return new_inventory_item, None if new_inventory_item else None, None
    
    @staticmethod
    def sync_carried_capacity(character_id):
        inventory = Inventory.query.filter(Inventory.character_id == character_id, Inventory.inv_type == InventoryType.CARRIED).first()

        if not inventory:
            return None, "Inventário não encontrado"

        if inventory.inv_type != InventoryType.CARRIED:
            return None, "Inventário não é do tipo carregado"
        
        stat_limits, _ = CharacterService.calculate_stat_limits(character_id)
        inventory_capacity = stat_limits["inventory_capacity"]["total_max"]
        
        inventory.capacity = inventory_capacity
        
        db.session.commit()
        return inventory_capacity, None

    @staticmethod
    def remove_item_from_inventory(inventory_id, item_id, quantity=1):
        """Remove an item from an inventory"""
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            return None, "Inventário não encontrado"
        
        item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        
        existing_inventory_items = InventoryItem.query.filter_by(inventory_id=inventory_id, item_id=item_id).all()
        if not existing_inventory_items:
            return None, "Item não encontrado no inventário"
        
        total_quantity = sum(item.quantity for item in existing_inventory_items)
        if total_quantity < quantity:
            return None, "Quantidade insuficiente para remover"
        
        for existing_inventory_item in existing_inventory_items:
            if quantity <= 0:
                break
            if existing_inventory_item.quantity <= quantity:
                quantity -= existing_inventory_item.quantity
                db.session.delete(existing_inventory_item)
            else:
                existing_inventory_item.quantity -= quantity
                quantity = 0
        
        db.session.commit()
        return existing_inventory_items, None
    
    @staticmethod
    def create_inventory(character_id, name, description, type, capacity=0):
        """Create a new inventory for a character"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        inventory = Inventory(character_id=character_id, name=name, description=description, inv_type=type, capacity=capacity)
        db.session.add(inventory)
        db.session.commit()
        return inventory, None
    
    @staticmethod
    def delete_inventory(inventory_id):
        """Delete an inventory"""
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            return False, "Inventário não encontrado"
        
        items = InventoryItem.query.filter_by(inventory_id=inventory_id).all()
        for item in items:
            db.session.delete(item)
        
        db.session.delete(inventory)
        db.session.commit()
        return True, None
    
    @staticmethod
    def update_inventory(inventory_id, name=None, description=None, capacity=None):
        """Update an inventory"""
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            return None, "Inventário não encontrado"
        
        if name:
            inventory.name = name
        if description:
            inventory.description = description
        if capacity is not None:
            inventory.capacity = capacity
        
        db.session.commit()
        return inventory, None
    
    @staticmethod
    def create_standards_inventories_for_character(character_id):
        """Create standard inventories for a character"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Personagem não encontrado"
        
        standard_inventories = [
            {"name": "Carregado", "description": "Inventário dos items carregados no corpo do personagem", "type": InventoryType.CARRIED, "capacity": 10},
            {"name": "Equipado", "description": "Inventário dos items equipados pelo personagem", "type": InventoryType.EQUIPED, "capacity": -1},
        ]

        created_inventories = []
        for inv in standard_inventories:
            inventory = Inventory(character_id=character_id, name=inv["name"], description=inv["description"], inv_type=inv["type"], capacity=inv["capacity"])
            db.session.add(inventory)
            created_inventories.append(inventory)

        db.session.commit()
        return created_inventories, None
        
    @staticmethod
    def transfer_item_between_inventories(source_inventory_id, target_inventory_id, item_id, quantity=1):
        """Transfer an item from one inventory to another"""
        source_inventory = Inventory.query.get(source_inventory_id)
        if not source_inventory:
            return None, "Inventário de origem não encontrado"
        
        target_inventory = Inventory.query.get(target_inventory_id)
        if not target_inventory:
            return None, "Inventário de destino não encontrado"
        
        item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        
        existing_source_item = InventoryItem.query.filter_by(inventory_id=source_inventory_id, item_id=item_id).first()
        if not existing_source_item:
            return None, "Item não encontrado no inventário de origem"
        
        if existing_source_item.quantity < quantity:
            return None, "Quantidade insuficiente para transferir"
        
        # Check if the target inventory has space
        if not target_inventory.capacity == -1 and len(target_inventory.items) >= target_inventory.capacity:
            return None, "Inventário de destino está cheio"
        
        # Remove from source inventory
        existing_source_item.quantity -= quantity
        if existing_source_item.quantity == 0:
            db.session.delete(existing_source_item)
        
        # Add to target inventory
        existing_target_item = InventoryItem.query.filter_by(inventory_id=target_inventory_id, item_id=item_id).first()
        if existing_target_item and item.stackable:
            existing_target_item.quantity += quantity
        else:
            new_target_item = InventoryItem(inventory_id=target_inventory_id, item_id=item_id, quantity=quantity)
            db.session.add(new_target_item)
        
        db.session.commit()
        return True, None
    
    def transfer_inventory_ownership(inventory_id, new_character_id):
        """Transfer inventory ownership to another character"""
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            return None, "Inventário não encontrado"
        
        new_character = Character.query.get(new_character_id)
        if not new_character:
            return None, "Personagem não encontrado"
        
        inventory.character_id = new_character_id
        db.session.commit()
        return inventory, None
    
    def get_inventory_types():
        """Get all inventory types"""
        return [inv_type.value for inv_type in InventoryType]
    
    def delete_character_inventories(character_id):
        """Delete all inventories for a character"""
        inventories = Inventory.query.filter_by(character_id=character_id).all()
        for inventory in inventories:
            items = InventoryItem.query.filter_by(inventory_id=inventory.id).all()
            for item in items:
                db.session.delete(item)
            db.session.delete(inventory)
        db.session.commit()
        return True, None
    
class ItemService:
    @staticmethod
    def create_item(name, description, item_type, data, stackable=False, equipable=False, max_quantity=None, temporary=False, hidden=False):
        """Create a new item"""
        if item_type == "weapon":
            item = Weapon(name=name, description=description, max_quantity=max_quantity, **data, stackable=stackable, equipable=equipable, temporary=temporary, hidden=hidden)
        elif item_type == "armor":
            item = Armor(name=name, description=description, max_quantity=max_quantity, **data, stackable=stackable, equipable=equipable, temporary=temporary, hidden=hidden)
        elif item_type == "artefact":
            item = Artefact(name=name, description=description, max_quantity=max_quantity, **data, stackable=stackable, equipable=equipable, temporary=temporary, hidden=hidden)
        elif item_type == "utility":
            item = Utility(name=name, description=description, max_quantity=max_quantity, stackable=stackable, equipable=equipable, temporary=temporary, hidden=hidden)
        else:
            return None, "Tipo de item inválido"
        
        db.session.add(item)
        db.session.commit()
        return item
    
    @staticmethod
    def get_all_items():
        """Get all items"""
        return Item.query.all()
    
    @staticmethod
    def get_item_by_id(item_id):
        """Get item by ID"""
        return Item.query.get(item_id)
    
    @staticmethod
    def update_item(item_id, data=None, name=None, description=None, stackable=None, equipable=None, max_quantity=None):
        """Update an item"""
        item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        
        if item.item_type == "weapon" and data:
            constraints = ["damage", "pericia", "critical", "range"]
            # Handle weapon-specific update logic here
            for key in constraints:
                if key in data:
                    setattr(item, key, data[key])
        
        if item.item_type == "armor" and data:
            constraints = ["resistance", "reduction", "pericia", "size", "effect"]
            # Handle armor-specific update logic here
            for key in constraints:
                if key in data:
                    setattr(item, key, data[key])

        if item.item_type == "artefact" and data:
            constraints = ["effect"]
            # Handle artefact-specific update logic here
            for key in constraints:
                if key in data:
                    setattr(item, key, data[key])
        if name:
            item.name = name
        if description:
            item.description = description
        if stackable is not None:
            item.stackable = stackable
        if equipable is not None:
            item.equipable = equipable
        if max_quantity is not None:
            item.max_quantity = max_quantity
        
        db.session.commit()
        return item, None
    
    @staticmethod
    def delete_item(item_id):
        """Delete an item"""
        item = Item.query.get(item_id)
        if not item:
            return False, "Item não encontrado"
        
        inventory_items = InventoryItem.query.filter_by(item_id=item_id).all()
        for inventory_item in inventory_items:
            db.session.delete(inventory_item)
        
        db.session.delete(item)
        db.session.commit()
        return True, None
    
    @staticmethod
    def toggle_item_hidden_status(item_id):
        """Toggle item hidden status"""
        item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        
        item.hidden = not item.hidden
        db.session.commit()
        return item, None

    @staticmethod
    def toggle_item_temporary_status(item_id):
        """Toggle item temporary status"""
        item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        
        item.temporary = not item.temporary
        db.session.commit()
        return item, None
    

class InventoryItemService:
    @staticmethod
    def get_inventory_item(inventory_id, item_id):
        """Get an inventory item by inventory and item ID"""
        return InventoryItem.query.filter_by(inventory_id=inventory_id, item_id=item_id).first()
    
    @staticmethod
    def get_all_inventory_items(inventory_id):
        """Get all inventory items"""
        return InventoryItem.query.filter_by(inventory_id=inventory_id).all()
    
    @staticmethod
    def update_inventory_item_quantity(inventory_id, item_id, quantity):
        """Update the quantity of an inventory item"""
        inventory_item = InventoryItem.query.filter_by(inventory_id=inventory_id, item_id=item_id).first()
        item = Item.query.get(item_id)
        if not item:
            return None, "Item não encontrado"
        if not inventory_item:
            return None, "Item do inventário não encontrado"
        
        if item.max_quantity is not None and item.stackable and quantity > item.max_quantity:
            return None, f"Quantidade excede o máximo permitido para este item ({item.max_quantity})"

        inventory_item.quantity = quantity
        db.session.commit()
        return inventory_item, None
    
    @staticmethod
    def delete_inventory_item(inventory_id, item_id):
        """Delete an inventory item"""
        inventory_item = InventoryItem.query.filter_by(inventory_id=inventory_id, item_id=item_id).all()
        if not inventory_item:
            return False, "Item do inventário não encontrado"
        
        for item in inventory_item:
            db.session.delete(item)
        db.session.commit()
        return True, None
