from __future__ import annotations
from application import db
from application.models._characters import Character, ConversionRule, LevelUpRule, Race
from application.models._classes import Subclass, Class, ClassAbility, ClassPower
from application.models._pericia import Pericia, PericiaValue
from application.models._attribute import Attribute, AttributeValue


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
    def update_ability(ability_id, name=None, description=None, class_id=None, subclass_id=None):
        """Update ability"""
        ability = ClassAbility.query.get(ability_id)
        if not ability:
            return None, "Ability not found"
        
        if name:
            ability.name = name
        if description:
            ability.description = description
        if class_id:
            if (not Class.query.get(class_id)):  # Validate class exists
                return None, "Class not found"
            ability.class_id = class_id
        if subclass_id:
            if (subclass := Subclass.query.get(subclass_id)):  # Validate subclass exists
                if class_id and subclass.class_id != class_id:
                    return None, "Subclass does not belong to the specified class"
                elif not class_id and ability.class_id and subclass.class_id != ability.class_id:
                    return None, "Subclass does not belong to the ability's class"
                ability.subclass_id = subclass_id
            else:
                return None, "Subclass not found"
            ability.subclass_id = subclass_id
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
    
class ClassPowerService:
    @staticmethod
    def create_class_power(name, description, class_id):
        """Create a new class power"""
        class_power = ClassPower(name=name, description=description, class_id=class_id)
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
    def toggle_class_power_hidden_status(power_id):
        """Toggle class power hidden status"""
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



class ClassService:
    @staticmethod
    def create_class(name, description, abilities=None):
        """Create a new class with abilities"""
        char_class = Class(name=name, description=description)
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
        db.session.commit()

    @staticmethod
    def delete_character_attributes(character_id):
        """Delete attribute values when a character is deleted"""
        char_attr_values = AttributeValue.query.filter_by(character_id=character_id).all()
        for attr_value in char_attr_values:
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
    def create_character(user_id, **kwargs):
        """Create a new character with default values"""
        character = Character(own=user_id)
        db.session.add(character)
        db.session.flush()
        CharacterService._apply_character_updates(character, **kwargs)
        
        # Create default attributes and pericias for the character
        AttributeValueService.create_character_attributes(character.id)
        
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
        base_limits = {
            "life": getattr(character_class, "base_life", 100) + getattr(character, "offset_life", 0),
            "defense": getattr(character_class, "base_defense", 10) + getattr(character, "offset_defense", 0),
            "sanity": getattr(character_class, "base_sanity", 100) + getattr(character, "offset_sanity", 0),
            "ocultism": getattr(character_class, "base_ocultism", 10) + getattr(character, "offset_ocultism", 0),
            "mana": getattr(character_class, "base_mana", 100) + getattr(character, "offset_mana", 0),
        }

        stat_limits = {
            stat: {"base_max": base, "bonus_max": 0, "total_max": base}
            for stat, base in base_limits.items()
        }

        conversion_rules = ConversionRule.query.all()
        rule_rows = [(ar.attribute_id, ar.stat, ar.rate) for ar in conversion_rules]

        for attribute_id, stat, rate in rule_rows:
            if stat not in stat_limits:
                continue

            attr_value = AttributeValue.query.filter_by(
                character_id=character_id,
                attribute_id=attribute_id,
            ).first()
            if not attr_value:
                continue

            total_pericia_bonus = sum(pericia.value for pericia in attr_value.pericias)
            stat_limits[stat]["bonus_max"] += total_pericia_bonus * rate

        for stat, values in stat_limits.items():
            values["total_max"] = values["base_max"] + values["bonus_max"]


        return stat_limits, None

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

        if life is not None:
            character.life = life
        if defense is not None:
            character.defense = defense
        if sanity is not None:
            character.sanity = sanity
        if ocultism is not None:
            character.ocultism = ocultism
        if mana is not None:
            character.mana = mana

        db.session.commit()
        return character, None
    
    @staticmethod
    def update_stats_off_sets(character_id, offset_life=None, offset_defense=None, offset_sanity=None, offset_ocultism=None, offset_mana=None):
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

        db.session.commit()
        return character, None

    @staticmethod
    def update_character_description(character_id, descricao_fisica=None, descricao_psicologica=None, historia=None):
        """Update character descriptions"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        if descricao_fisica is not None:
            character.descricao_fisica = descricao_fisica
        if descricao_psicologica is not None:
            character.descricao_psicologica = descricao_psicologica
        if historia is not None:
            character.historia = historia

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
        
        db.session.delete(character)
        db.session.commit()
        return True, None

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

        for rule in conversion_rules:
            # Get the attribute value for the character
            attr_value = AttributeValue.query.filter_by(character_id=character_id, attribute_id=rule.attribute_id).first()
            if attr_value:
                # Calculate total pericia bonus for this attribute
                total_pericia_bonus = sum(pericia.value for pericia in attr_value.pericias)
                # Calculate the stat bonus based on the conversion rate
                att_stat = total_pericia_bonus * rule.rate
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
        
        db.session.commit()
        return character, None


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
    
    @staticmethod
    def toggle_character_active_status(character_id):
        """Toggle character active status"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"
        
        character.active = not character.active
        db.session.commit()
        return character, None


class CharacterAttributesService:
    @staticmethod
    def get_character_attributes(character_id):
        """Return character attribute and pericia snapshots for the controller"""
        character = Character.query.get(character_id)
        if not character:
            return None, "Character not found"

        def make_item(**kwargs):
            return type("CharacterAttributeSnapshot", (), kwargs)()

        attributes = []
        pericias = []

        for attr_value in character.attributes:
            attribute = Attribute.query.get(attr_value.attribute_id)
            if not attribute:
                continue

            total = sum(pericia.value for pericia in attr_value.pericias)
            attributes.append(
                make_item(
                    attribute=attribute,
                    baseValue=0,
                    bonusValue=total,
                    total=total,
                )
            )

            for pericia_value in attr_value.pericias:
                pericia = pericia_value.pericia
                if not pericia:
                    continue
                pericias.append(
                    make_item(
                        pericia=pericia,
                        baseValue=0,
                        bonusValue=pericia_value.value,
                        total=pericia_value.value,
                    )
                )

        return make_item(attributes=attributes, pericias=pericias), None


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
    def create_conversion_rule(attribute_id, stat, rate):
        """Create a new conversion rule"""
        conversion_rule = ConversionRule(attribute_id=attribute_id, stat=stat, rate=rate)
        db.session.add(conversion_rule)
        db.session.commit()
        return conversion_rule

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
    

class LevelUpRuleService:
    @staticmethod
    def create_level_up_rule(level, experience_required):
        """Create a new level up rule"""
        level_up_rule = LevelUpRule(level=level, experience_required=experience_required)
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
    def update_level_up_rule(rule_id, level=None, experience_required=None):
        """Update level up rule"""
        level_up_rule = LevelUpRule.query.get(rule_id)
        if not level_up_rule:
            return None, "Level up rule not found"
        
        if level is not None:
            level_up_rule.level = level
        if experience_required is not None:
            level_up_rule.experience_required = experience_required
        
        db.session.commit()
        return level_up_rule, None