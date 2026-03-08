from flask import Blueprint, request, jsonify
from aplication.services.character import (
    AbilityService, RaceService, AttributeService,
    ClassService, SubclassService, CharacterAttributesService,
    CharacterService
)
from aplication.controlers.auth import token_required
from aplication.constants import AtributesModelsSheet

character_bp = Blueprint('character', __name__, url_prefix='/api')


# ==================== ABILITIES ====================

@character_bp.route('/abilities', methods=['GET'])
def get_abilities():
    """Get all abilities"""
    abilities = AbilityService.get_all_abilities()
    return jsonify({
        'abilities': [
            {'id': a.id, 'name': a.name, 'description': a.description}
            for a in abilities
        ]
    }), 200


@character_bp.route('/abilities', methods=['POST'])
def create_ability():
    """Create a new ability"""
    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    ability = AbilityService.create_ability(
        name=data.get('name'),
        description=data.get('description')
    )
    
    return jsonify({
        'message': 'Ability created successfully',
        'ability': {'id': ability.id, 'name': ability.name, 'description': ability.description}
    }), 201


@character_bp.route('/abilities/<int:ability_id>', methods=['GET'])
def get_ability(ability_id):
    """Get ability by ID"""
    ability = AbilityService.get_ability_by_id(ability_id)
    
    if not ability:
        return jsonify({'message': 'Ability not found'}), 404
    
    return jsonify({
        'ability': {'id': ability.id, 'name': ability.name, 'description': ability.description}
    }), 200


@character_bp.route('/abilities/<int:ability_id>', methods=['PUT'])
def update_ability(ability_id):
    """Update ability"""
    data = request.get_json(silent=True) or {}
    
    ability, error = AbilityService.update_ability(
        ability_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Ability updated successfully',
        'ability': {'id': ability.id, 'name': ability.name, 'description': ability.description}
    }), 200


@character_bp.route('/abilities/<int:ability_id>', methods=['DELETE'])
def delete_ability(ability_id):
    """Delete ability"""
    success, error = AbilityService.delete_ability(ability_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Ability deleted successfully'}), 200


# ==================== RACES ====================

@character_bp.route('/races', methods=['GET'])
def get_races():
    """Get all races"""
    races = RaceService.get_all_races()
    return jsonify({
        'races': [
            {'id': r.id, 'name': r.name, 'description': r.description}
            for r in races
        ]
    }), 200


@character_bp.route('/races', methods=['POST'])
def create_race():
    """Create a new race"""
    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    race = RaceService.create_race(
        name=data.get('name'),
        description=data.get('description')
    )
    
    return jsonify({
        'message': 'Race created successfully',
        'race': {'id': race.id, 'name': race.name, 'description': race.description}
    }), 201


@character_bp.route('/races/<int:race_id>', methods=['GET'])
def get_race(race_id):
    """Get race by ID"""
    race = RaceService.get_race_by_id(race_id)
    
    if not race:
        return jsonify({'message': 'Race not found'}), 404
    
    return jsonify({
        'race': {'id': race.id, 'name': race.name, 'description': race.description}
    }), 200


@character_bp.route('/races/<int:race_id>', methods=['PUT'])
def update_race(race_id):
    """Update race"""
    data = request.get_json(silent=True) or {}
    
    race, error = RaceService.update_race(
        race_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Race updated successfully',
        'race': {'id': race.id, 'name': race.name, 'description': race.description}
    }), 200


@character_bp.route('/races/<int:race_id>', methods=['DELETE'])
def delete_race(race_id):
    """Delete race"""
    success, error = RaceService.delete_race(race_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Race deleted successfully'}), 200


# ==================== ATTRIBUTES ====================

@character_bp.route('/attributes', methods=['GET'])
def get_attributes():
    """Get all attributes"""
    attributes = AttributeService.get_all_attributes()
    return jsonify({
        'attributes': [
            {'id': a.id, 'name': a.name, 'description': a.description}
            for a in attributes
        ]
    }), 200


@character_bp.route('/attributes', methods=['POST'])
def create_attribute():
    """Create a new attribute"""
    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    attribute = AttributeService.create_attribute(
        name=data.get('name'),
        description=data.get('description')
    )
    
    return jsonify({
        'message': 'Attribute created successfully',
        'attribute': {'id': attribute.id, 'name': attribute.name, 'description': attribute.description}
    }), 201


@character_bp.route('/attributes/<int:attribute_id>', methods=['GET'])
def get_attribute(attribute_id):
    """Get attribute by ID"""
    attribute = AttributeService.get_attribute_by_id(attribute_id)
    
    if not attribute:
        return jsonify({'message': 'Attribute not found'}), 404
    
    return jsonify({
        'attribute': {'id': attribute.id, 'name': attribute.name, 'description': attribute.description}
    }), 200


@character_bp.route('/attributes/<int:attribute_id>', methods=['PUT'])
def update_attribute(attribute_id):
    """Update attribute"""
    data = request.get_json(silent=True) or {}
    
    attribute, error = AttributeService.update_attribute(
        attribute_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Attribute updated successfully',
        'attribute': {'id': attribute.id, 'name': attribute.name, 'description': attribute.description}
    }), 200


@character_bp.route('/attributes/<int:attribute_id>', methods=['DELETE'])
def delete_attribute(attribute_id):
    """Delete attribute"""
    success, error = AttributeService.delete_attribute(attribute_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Attribute deleted successfully'}), 200


# ==================== CLASSES ====================

@character_bp.route('/classes', methods=['GET'])
def get_classes():
    """Get all classes"""
    classes = ClassService.get_all_classes()
    return jsonify({
        'classes': [
            {'id': c.id, 'name': c.name, 'description': c.description}
            for c in classes
        ]
    }), 200


@character_bp.route('/classes', methods=['POST'])
def create_class():
    """Create a new class"""
    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    abilities = data.get('abilities', [])
    
    char_class = ClassService.create_class(
        name=data.get('name'),
        description=data.get('description'),
        abilities=abilities
    )
    
    return jsonify({
        'message': 'Class created successfully',
        'class': {'id': char_class.id, 'name': char_class.name, 'description': char_class.description}
    }), 201


@character_bp.route('/classes/<int:class_id>', methods=['GET'])
def get_class(class_id):
    """Get class by ID"""
    char_class = ClassService.get_class_by_id(class_id)
    
    if not char_class:
        return jsonify({'message': 'Class not found'}), 404
    
    return jsonify({
        'class': {'id': char_class.id, 'name': char_class.name, 'description': char_class.description}
    }), 200


@character_bp.route('/classes/<int:class_id>', methods=['PUT'])
def update_class(class_id):
    """Update class"""
    data = request.get_json(silent=True) or {}
    
    char_class, error = ClassService.update_class(
        class_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Class updated successfully',
        'class': {'id': char_class.id, 'name': char_class.name, 'description': char_class.description}
    }), 200


@character_bp.route('/classes/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    """Delete class"""
    success, error = ClassService.delete_class(class_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Class deleted successfully'}), 200


# ==================== SUBCLASSES ====================

@character_bp.route('/subclasses', methods=['GET'])
def get_subclasses():
    """Get all subclasses"""
    subclasses = SubclassService.get_all_subclasses()
    return jsonify({
        'subclasses': [
            {
                'id': s.id, 'name': s.name, 'description': s.description,
                'class_id': s.class_id
            }
            for s in subclasses
        ]
    }), 200


@character_bp.route('/subclasses', methods=['POST'])
def create_subclass():
    """Create a new subclass (must specify parent class)"""
    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description') or not data.get('class_id'):
        return jsonify({'message': 'Missing required fields (name, description, class_id)'}), 400
    
    subclass, error = SubclassService.create_subclass(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        abilities=data.get('abilities', [])
    )
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Subclass created successfully',
        'subclass': {
            'id': subclass.id, 'name': subclass.name, 'description': subclass.description,
            'class_id': subclass.class_id
        }
    }), 201


@character_bp.route('/subclasses/<int:subclass_id>', methods=['GET'])
def get_subclass(subclass_id):
    """Get subclass by ID"""
    subclass = SubclassService.get_subclass_by_id(subclass_id)
    
    if not subclass:
        return jsonify({'message': 'Subclass not found'}), 404
    
    return jsonify({
        'subclass': {
            'id': subclass.id, 'name': subclass.name, 'description': subclass.description,
            'class_id': subclass.class_id
        }
    }), 200


@character_bp.route('/subclasses/<int:subclass_id>', methods=['PUT'])
def update_subclass(subclass_id):
    """Update subclass"""
    data = request.get_json(silent=True) or {}
    
    subclass, error = SubclassService.update_subclass(
        subclass_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Subclass updated successfully',
        'subclass': {
            'id': subclass.id, 'name': subclass.name, 'description': subclass.description,
            'class_id': subclass.class_id
        }
    }), 200


@character_bp.route('/subclasses/<int:subclass_id>', methods=['DELETE'])
def delete_subclass(subclass_id):
    """Delete subclass"""
    success, error = SubclassService.delete_subclass(subclass_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Subclass deleted successfully'}), 200


# ==================== CHARACTER ATTRIBUTES ====================

@character_bp.route('/characters/<int:character_id>/attributes', methods=['GET'])
@token_required
def get_character_attributes(current_user, character_id):
    """Get all attributes for a character"""
    char_attrs = CharacterAttributesService.get_character_attributes(character_id)
    
    if not char_attrs:
        return jsonify({'message': 'Character attributes not found'}), 404
    
    
    return jsonify({
        'character_id': character_id,
        'attributes': [
            {
                'attribute_id': item.attribute.id,
                'name': item.attribute.name,
                'description': item.attribute.description,
                'value': item.value
            }
            for item in char_attrs.values
        ]
    }), 200


@character_bp.route('/characters/<int:character_id>/attributes', methods=['PUT'])
@token_required
def bulk_update_character_attributes(current_user, character_id):
    """Bulk update all attributes for a character
    
    Request body should contain 'attributes' array with attribute updates
    """
    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('attributes'):
        return jsonify({'message': 'Missing attributes array'}), 400
    
    char_attrs, error = CharacterAttributesService.bulk_update_character_attributes(
        character_id,
        data.get('attributes')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Character attributes updated successfully',
        'character_id': character_id
    }), 200


# ==================== CHARACTERS ====================

@character_bp.route('/characters', methods=['POST'])
@token_required
def create_character(current_user):
    """Create a new character for the current user"""
    data = request.get_json(silent=True) or {}
    
    required_fields = ['name', 'charClass', 'race', 'gender', 'age']
    if not data or not all(data.get(field) for field in required_fields):
        return jsonify({'message': f'Missing required fields: {", ".join(required_fields)}'}), 400
    
    character, error = CharacterService.create_character(
        user_id=current_user.id,
        name=data.get('name'),
        char_class_id=data.get('charClass'),
        race_id=data.get('race'),
        gender=data.get('gender'),
        age=data.get('age')
    )
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Character created successfully',
        'character': {
            'id': character.id,
            'name': character.name,
            'charClass': character.charClass,
            'race': character.race,
            'gender': character.gender,
            'age': character.age,
            'level': character.level,
            'life': character.life,
            'defense': character.defense,
            'sanity': character.sanity,
            'ocultism': character.ocultism,
            'mana': character.mana
        }
    }), 201


@character_bp.route('/characters', methods=['GET'])
@token_required
def get_user_characters(current_user):
    """Get all characters for the current user"""
    characters = CharacterService.get_user_characters(current_user.id)
    
    return jsonify({
        'characters': [
            {
                'id': c.id,
                'name': c.name,
                'charClass': c.charClass,
                'race': c.race,
                'gender': c.gender,
                'age': c.age,
                'level': c.level,
                'life': c.life,
                'defense': c.defense,
                'sanity': c.sanity,
                'ocultism': c.ocultism,
                'mana': c.mana
            }
            for c in characters
        ]
    }), 200


@character_bp.route('/characters/<int:character_id>', methods=['GET'])
@token_required
def get_character(current_user, character_id):
    """Get character by ID"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    return jsonify({
        'character': {
            'id': character.id,
            'name': character.name,
            'charClass': character.charClass,
            'subclass': character.subclass,
            'second_class': character.second_class,
            'race': character.race,
            'gender': character.gender,
            'age': character.age,
            'level': character.level,
            'life': character.life,
            'defense': character.defense,
            'sanity': character.sanity,
            'ocultism': character.ocultism,
            'mana': character.mana
        }
    }), 200


@character_bp.route('/characters/<int:character_id>', methods=['PUT'])
@token_required
def update_character(current_user, character_id):
    """Update character fields"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json(silent=True) or {}
    
    character, error = CharacterService.update_character(character_id, **data)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Character updated successfully',
        'character': {
            'id': character.id,
            'name': character.name,
            'charClass': character.charClass,
            'subclass': character.subclass,
            'second_class': character.second_class,
            'race': character.race,
            'gender': character.gender,
            'age': character.age,
            'level': character.level,
            'life': character.life,
            'defense': character.defense,
            'sanity': character.sanity,
            'ocultism': character.ocultism,
            'mana': character.mana
        }
    }), 200


@character_bp.route('/characters/<int:character_id>', methods=['DELETE'])
@token_required
def delete_character(current_user, character_id):
    """Delete character"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    success, error = CharacterService.delete_character(character_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Character deleted successfully'}), 200
