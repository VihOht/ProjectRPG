from flask import Blueprint, request, jsonify
from aplication.services.character import (
    AbilityService, RaceService, AttributeService, PericiasService,
    ClassService, SubclassService, CharacterAttributesService,
    CharacterService
)
from aplication.controlers.auth import token_required
from aplication.constants import *

character_bp = Blueprint('character', __name__, url_prefix='/api')


def _is_admin(user):
    return (getattr(user, 'role', 'USER') or 'USER').upper() == 'ADMIN'


# ==================== ABILITIES ====================

@character_bp.route('/abilities', methods=['GET'])
def get_abilities():
    """Get all abilities"""
    abilities = AbilityService.get_all_abilities()
    return jsonify({
        'abilities': [
            {
                'id': a.id,
                'name': a.name,
                'description': a.description,
                'class_id': a.class_id,
                'subclass_id': a.subclass_id,
            }
            for a in abilities
        ]
    }), 200


@character_bp.route('/abilities', methods=['POST'])
@token_required
def create_ability(current_user):
    """Create a new ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    ability = AbilityService.create_ability(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        subclass_id=data.get('subclass_id'),
    )
    
    return jsonify({
        'message': 'Ability created successfully',
        'ability': {
            'id': ability.id,
            'name': ability.name,
            'description': ability.description,
            'class_id': ability.class_id,
            'subclass_id': ability.subclass_id,
        }
    }), 201


@character_bp.route('/abilities/<int:ability_id>', methods=['GET'])
def get_ability(ability_id):
    """Get ability by ID"""
    ability = AbilityService.get_ability_by_id(ability_id)
    
    if not ability:
        return jsonify({'message': 'Ability not found'}), 404
    
    return jsonify({
        'ability': {
            'id': ability.id,
            'name': ability.name,
            'description': ability.description,
            'class_id': ability.class_id,
            'subclass_id': ability.subclass_id,
        }
    }), 200


@character_bp.route('/abilities/<int:ability_id>', methods=['PUT'])
@token_required
def update_ability(current_user, ability_id):
    """Update ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
        'ability': {
            'id': ability.id,
            'name': ability.name,
            'description': ability.description,
            'class_id': ability.class_id,
            'subclass_id': ability.subclass_id,
        }
    }), 200


@character_bp.route('/abilities/<int:ability_id>', methods=['DELETE'])
@token_required
def delete_ability(current_user, ability_id):
    """Delete ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def create_race(current_user):
    """Create a new race"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def update_race(current_user, race_id):
    """Update race"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def delete_race(current_user, race_id):
    """Delete race"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def create_attribute(current_user):
    """Create a new attribute"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def update_attribute(current_user, attribute_id):
    """Update attribute"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def delete_attribute(current_user, attribute_id):
    """Delete attribute"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    success, error = AttributeService.delete_attribute(attribute_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Attribute deleted successfully'}), 200


# ==================== PERICIAS ====================

@character_bp.route('/pericias', methods=['GET'])
def get_pericias():
    """Get all pericias"""
    pericias = PericiasService.get_all_pericias()
    return jsonify({
        'pericias': [
            {
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'attribute_id': p.attribute_id,
            }
            for p in pericias
        ]
    }), 200


@character_bp.route('/pericias', methods=['POST'])
@token_required
def create_pericia(current_user):
    """Create a new pericia"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description') or not data.get('attribute_id'):
        return jsonify({'message': 'Missing required fields (name, description, attribute_id)'}), 400
    
    pericia = PericiasService.create_pericia(
        name=data.get('name'),
        description=data.get('description'),
        attribute_id=data.get('attribute_id')
    )
    
    return jsonify({
        'message': 'Pericia created successfully',
        'pericia': {
            'id': pericia.id,
            'name': pericia.name,
            'description': pericia.description,
            'attribute_id': pericia.attribute_id,
        }
    }), 201


@character_bp.route('/pericias/<int:pericia_id>', methods=['GET'])
def get_pericia(pericia_id):
    """Get pericia by ID"""
    pericia = PericiasService.get_pericia_by_id(pericia_id)
    
    if not pericia:
        return jsonify({'message': 'Pericia not found'}), 404
    
    return jsonify({
        'pericia': {
            'id': pericia.id,
            'name': pericia.name,
            'description': pericia.description,
            'attribute_id': pericia.attribute_id,
        }
    }), 200


@character_bp.route('/pericias/<int:pericia_id>', methods=['PUT'])
@token_required
def update_pericia(current_user, pericia_id):
    """Update pericia"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    pericia, error = PericiasService.update_pericia(
        pericia_id,
        name=data.get('name'),
        description=data.get('description'),
        attribute_id=data.get('attribute_id')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Pericia updated successfully',
        'pericia': {
            'id': pericia.id,
            'name': pericia.name,
            'description': pericia.description,
            'attribute_id': pericia.attribute_id,
        }
    }), 200


@character_bp.route('/pericias/<int:pericia_id>', methods=['DELETE'])
@token_required
def delete_pericia(current_user, pericia_id):
    """Delete pericia"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    success, error = PericiasService.delete_pericia(pericia_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Pericia deleted successfully'}), 200


# ==================== CLASSES ====================

@character_bp.route('/classes', methods=['GET'])
def get_classes():
    """Get all classes"""
    classes = ClassService.get_all_classes()
    return jsonify({
        'classes': [
            {
                'id': c.id,
                'name': c.name,
                'description': c.description,
                'abilities': [
                    {
                        'id': a.id,
                        'name': a.name,
                        'description': a.description,
                        'class_id': a.class_id,
                        'subclass_id': a.subclass_id,
                    }
                    for a in c.abilities
                ],
                'subclasses': [
                    {
                        'id': s.id,
                        'name': s.name,
                        'description': s.description,
                        'class_id': s.class_id,
                        'abilities': [
                            {
                                'id': sa.id,
                                'name': sa.name,
                                'description': sa.description,
                                'class_id': sa.class_id,
                                'subclass_id': sa.subclass_id,
                            }
                            for sa in s.abilities
                        ],
                    }
                    for s in c.subclasses
                ],
            }
            for c in classes
        ]
    }), 200


@character_bp.route('/classes', methods=['POST'])
@token_required
def create_class(current_user):
    """Create a new class"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
        'class': {
            'id': char_class.id,
            'name': char_class.name,
            'description': char_class.description,
            'abilities': [
                {
                    'id': a.id,
                    'name': a.name,
                    'description': a.description,
                    'class_id': a.class_id,
                    'subclass_id': a.subclass_id,
                }
                for a in char_class.abilities
            ],
            'subclasses': [
                {
                    'id': s.id,
                    'name': s.name,
                    'description': s.description,
                    'class_id': s.class_id,
                    'abilities': [
                        {
                            'id': sa.id,
                            'name': sa.name,
                            'description': sa.description,
                            'class_id': sa.class_id,
                            'subclass_id': sa.subclass_id,
                        }
                        for sa in s.abilities
                    ],
                }
                for s in char_class.subclasses
            ],
        }
    }), 200


@character_bp.route('/classes/<int:class_id>', methods=['PUT'])
@token_required
def update_class(current_user, class_id):
    """Update class"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def delete_class(current_user, class_id):
    """Delete class"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
                'class_id': s.class_id,
                'abilities': [
                    {
                        'id': a.id,
                        'name': a.name,
                        'description': a.description,
                        'class_id': a.class_id,
                        'subclass_id': a.subclass_id,
                    }
                    for a in s.abilities
                ],
            }
            for s in subclasses
        ]
    }), 200


@character_bp.route('/subclasses', methods=['POST'])
@token_required
def create_subclass(current_user):
    """Create a new subclass (must specify parent class)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def update_subclass(current_user, subclass_id):
    """Update subclass"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

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
@token_required
def delete_subclass(current_user, subclass_id):
    """Delete subclass"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    success, error = SubclassService.delete_subclass(subclass_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Subclass deleted successfully'}), 200


# ==================== CHARACTER ATTRIBUTES ====================

@character_bp.route('/characters/<int:character_id>/attributes', methods=['GET'])
@token_required
def get_character_attributes(current_user, character_id):
    """Get all attributes for a character"""
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403

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
                'base': int(item.baseValue),
                'bonus': int(item.bonusValue),
                'total': item.total,
            }
            for item in char_attrs.attributes
        ],
        'pericias': [
            {
                'pericia_id': item.pericia.id,
                'attribute_id': item.pericia.attribute_id,
                'name': item.pericia.name,
                'description': item.pericia.description,
                'base': int(item.baseValue),
                'bonus': int(item.bonusValue),
                'total': item.total,
            }
            for item in char_attrs.pericias
        ]
    }), 200


@character_bp.route('/characters/<int:character_id>/attributes', methods=['PUT'])
@token_required
def bulk_update_character_attributes(current_user, character_id):
    """Bulk update all attributes for a character
    
    Request body should contain 'attributes' array with attribute updates
    in the format: [{"attribute_id": 1, "base": 10, "bonus": 2}]
    """
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403

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


@character_bp.route('/characters/<int:character_id>/pericias', methods=['PUT'])
@token_required
def bulk_update_character_pericias(current_user, character_id):
    """Bulk update all pericias for a character
    
    Request body should contain 'pericias' array with pericia updates
    in the format: [{"pericia_id": 1, "base": 5, "bonus": 1}]
    """
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('pericias'):
        return jsonify({'message': 'Missing pericias array'}), 400
    
    char_attrs, error = CharacterAttributesService.bulk_update_character_pericias(
        character_id,
        data.get('pericias')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Character pericias updated successfully',
        'character_id': character_id
    }), 200


# ==================== CHARACTERS ====================

@character_bp.route('/characters', methods=['POST'])
@token_required
def create_character(current_user):
    """Create a new character for the current user"""
    data = request.get_json(silent=True) or {}
    
    optional_fields = ['name', 'charClass', 'race', 'gender', 'age', 'subclass', 'second_class']
    for key in data.keys():
        if key not in optional_fields:
            return jsonify({'message': f'Unexpected field: {key}'}), 400
    
    if _is_admin(current_user):
        data["is_player"] = False
    character, error = CharacterService.create_character(user_id=current_user.id, **data)
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Character created successfully',
        'character': {
            'id': character.id,
            'own': character.own,
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
            'mana': character.mana,
            'is_player': character.is_player,
            'active': character.active,
            'equipament': character.equipament,
            'equipDescription': character.equipDescription
        }
    }), 201


@character_bp.route('/characters', methods=['GET'])
@token_required
def get_user_characters(current_user):
    """Get all characters for the current user"""
    if _is_admin(current_user):
        characters = CharacterService.get_all_characters()
    else:
        characters = CharacterService.get_user_characters(current_user.id)
    
    return jsonify({
        'characters': [
            {
                'id': c.id,
                'own': c.own,
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
                'mana': c.mana,
                'is_player': c.is_player,
                'active': c.active,
                'equipament': c.equipament,
                'equipDescription': c.equipDescription
            }
            for c in characters if c.active or _is_admin(current_user)
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
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    if character.own == current_user.id and not _is_admin(current_user) and not character.active:
        return jsonify({'message': 'Character is not active'}), 403
    
    # Calculate stat limits
    stat_limits, error = CharacterService.calculate_stat_limits(character_id)
    if error:
        stat_limits = {}
    
    return jsonify({
        'character': {
            'id': character.id,
            'own': character.own,
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
            'mana': character.mana,
            'base_life': character.base_life,
            'base_defense': character.base_defense,
            'base_sanity': character.base_sanity,
            'base_ocultism': character.base_ocultism,
            'base_mana': character.base_mana,
            'stat_limits': stat_limits,
            'active': character.active,
            'is_player': character.is_player,
            'equipament': character.equipament,
            'equipDescription': character.equipDescription
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
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = [
        'name', 'charClass', 'subclass', 'second_class',
        'race', 'gender', 'age', "level", 'life', 'defense',
        'sanity', 'ocultism', 'mana', 'base_life', 'base_defense', 'base_sanity',
        'base_ocultism', 'base_mana', 'equipament', 'equipDescription']
    
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Unexpected field: {key}'}), 400
    

    character, error = CharacterService.update_character(character_id, **data)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Character updated successfully',
        'character': {
            'id': character.id,
            'own': character.own,
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
            'mana': character.mana,
            'base_life': character.base_life,
            'base_defense': character.base_defense,
            'base_sanity': character.base_sanity,
            'base_ocultism': character.base_ocultism,
            'base_mana': character.base_mana,
            'active': character.active,
            'is_player': character.is_player,
            'equipament': character.equipament,
            'equipDescription': character.equipDescription
        }
    }), 200

@character_bp.route('/characters/<int:character_id>/activate', methods=['POST'])
@token_required
def activate_character(current_user, character_id):
    """Activate a character (only for admin)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    if character.active:
        return jsonify({'message': 'Character is already active'}), 400
    
    CharacterService.update_character(character_id, active=True)
    
    return jsonify({'message': 'Character activated successfully'}), 200

@character_bp.route('/characters/<int:character_id>/deactivate', methods=['POST'])
@token_required
def deactivate_character(current_user, character_id):
    """Deactivate a character (only for admin)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    if not character.active:
        return jsonify({'message': 'Character is already inactive'}), 400
    
    CharacterService.update_character(character_id, active=False)
    
    return jsonify({'message': 'Character deactivated successfully'}), 200


@character_bp.route('/characters/<int:character_id>/transfer-ownership/<int:new_user_id>', methods=['POST'])
@token_required
def transfer_character_ownership(current_user, character_id, new_user_id):
    """Transfer character ownership to another user (only for admin)"""
    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403

    character, error = CharacterService.transferCharacterOwnership(character_id, new_user_id)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Character ownership transferred successfully'}), 200    


@character_bp.route('/characters/<int:character_id>/return-to-admin', methods=['POST'])
@token_required
def return_character_to_admin(current_user, character_id):
    """Return character to admin and convert to NPC (for admins only)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Only admins can convert player characters to NPC
    if not _is_admin(current_user):
        return jsonify({'message': 'Only admins can convert characters to NPC'}), 403
    
    # Find the first admin user to transfer ownership
    from aplication.models.user import User
    admin_user = User.query.filter_by(role='ADMIN').first()
    
    if not admin_user:
        return jsonify({'message': 'No admin user found'}), 500
    
    # Transfer ownership to admin and convert to NPC
    CharacterService.transferCharacterOwnership(character_id, admin_user.id)
    CharacterService.update_character(character_id, is_player=False)
    
    return jsonify({'message': 'Character converted to NPC and transferred to admin successfully'}), 200


@character_bp.route('/characters/<int:character_id>', methods=['DELETE'])
@token_required
def delete_character(current_user, character_id):
    """Delete character"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    if character.own == current_user.id and not _is_admin(current_user):
        CharacterService.update_character(character_id, active=False)
        return jsonify({'message': 'Character deactivated successfully'}), 200

    success, error = CharacterService.delete_character(character_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Character deleted successfully'}), 200
