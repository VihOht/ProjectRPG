from flask import Blueprint, request, jsonify
from application.services.character import (
    ClassAbilityService, RaceService, AttributeService, PericiasService,
    ClassService, SubclassService, CharacterAttributesService,
    CharacterService, ConversionRuleService, LevelUpRuleService, ClassPowerService
)
from application.controlers.auth import token_required
from application.constants import *

character_bp = Blueprint('character', __name__, url_prefix='/api')


def _is_admin(user):
    return (getattr(user, 'role', 'USER') or 'USER').upper() == 'ADMIN'


# ==================== CLASS ABILITIES ====================

@character_bp.route('/abilities', methods=['GET'])
@token_required
def get_abilities(current_user):
    """Get all abilities"""
    abilities = ClassAbilityService.get_all_abilities()

    l = []
    for a in abilities:
        if a.hidden and not _is_admin(current_user):
            continue
        ability_dict = a.toDict()
        if not _is_admin(current_user):
            ability_dict.pop('hidden', None)
        l.append(ability_dict)
    
    return jsonify({'abilities': l}), 200


@character_bp.route('/abilities', methods=['POST'])
@token_required
def create_ability(current_user):
    """Create a new ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    ability = ClassAbilityService.create_ability(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        subclass_id=data.get('subclass_id'),
    )
    ability_dict = ability.toDict()

    
    return jsonify({
        'message': 'Ability created successfully',
        'ability': ability_dict
    }), 201


@character_bp.route('/abilities/<int:ability_id>', methods=['GET'])
@token_required
def get_ability(current_user, ability_id):
    """Get ability by ID"""
    ability = ClassAbilityService.get_ability_by_id(ability_id)
    if not ability or (ability.hidden and not _is_admin(current_user)):
        return jsonify({'message': 'Ability not found'}), 404
    
    if not ability:
        return jsonify({'message': 'Ability not found'}), 404
    
    ability_dict = ability.toDict()
    if not _is_admin(current_user):
        ability_dict.pop('hidden', None)

    return jsonify({'ability': ability_dict}), 200
    
    


@character_bp.route('/abilities/<int:ability_id>', methods=['PUT'])
@token_required
def update_ability(current_user, ability_id):
    """Update ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    ability, error = ClassAbilityService.update_ability(
        ability_id,
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        subclass_id=data.get('subclass_id'),
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Ability updated successfully',
        'ability': ability.toDict()
    }), 200



@character_bp.route('/abilities/<int:ability_id>', methods=['DELETE'])
@token_required
def delete_ability(current_user, ability_id):
    """Delete ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    success, error = ClassAbilityService.delete_ability(ability_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Ability deleted successfully'}), 200

@character_bp.route('/abilities/<int:ability_id>/visibility', methods=['POST'])
@token_required
def toggle_ability_visibility(current_user, ability_id):
    """Toggle ability visibility (admin only)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    ability, error = ClassAbilityService.toggle_ability_visibility(ability_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': f'Ability visibility toggled to {"hidden" if ability.hidden else "visible"}',
        'ability': ability.toDict()
    }), 200


# ================ POWER ABILITIES ==============

@character_bp.route('/class-powers', methods=['GET'])
@token_required
def get_class_powers(current_user):
    """Get all class powers"""
    class_powers = ClassPowerService.get_all_class_powers()
    l = []
    for cp in class_powers:
        if cp.hidden and not _is_admin(current_user):
            continue
        cp_dict = cp.toDict()
        if not _is_admin(current_user):
            cp_dict.pop('hidden', None)
        l.append(cp_dict)

    return jsonify({
        'class_powers': l
    }), 200


@character_bp.route('/class-powers', methods=['POST'])
@token_required
def create_class_power(current_user):
    """Create a new class power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if not data.get('class_id'):
        return jsonify({'message': 'Missing required field: class_id'}), 400
    
    if not ClassService.get_class_by_id(data.get('class_id')):
        return jsonify({'message': 'Class not found'}), 404
    

    class_power = ClassPowerService.create_class_power(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        level_to_unlock=data.get('level_to_unlock', 1)
    )
    
    return jsonify({
        'message': 'Class power created successfully',
        'class_power': class_power.toDict()
    }), 201


@character_bp.route('/class-powers/<int:class_power_id>', methods=['GET'])
@token_required
def get_class_power(current_user, class_power_id):
    """Get class power by ID"""
    class_power = ClassPowerService.get_class_power_by_id(class_power_id)
    
    if not class_power or (class_power.hidden and not _is_admin(current_user)):
        return jsonify({'message': 'Class power not found'}), 404
    
    cp_dict = class_power.toDict()
    if not _is_admin(current_user):
        cp_dict.pop('hidden', None)

    return jsonify({
        'class_power': cp_dict
    }), 200

@character_bp.route('/class-powers/<int:class_power_id>', methods=['PUT'])
@token_required
def update_class_power(current_user, class_power_id):
    """Update class power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    
    class_power, error = ClassPowerService.update_class_power(
        class_power_id,
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        level_to_unlock=data.get('level_to_unlock')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Class power updated successfully',
        'class_power': class_power.toDict()
    }), 200

@character_bp.route('/class-powers/<int:class_power_id>', methods=['DELETE'])
@token_required
def delete_class_power(current_user, class_power_id):
    """Delete class power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    success, error = ClassPowerService.delete_class_power(class_power_id)

    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Class power deleted successfully'}), 200

@character_bp.route('/class-powers/<int:class_power_id>/visibility', methods=['POST'])
@token_required
def toggle_class_power_visibility(current_user, class_power_id):
    """Toggle class power visibility (admin only)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    class_power, error = ClassPowerService.toggle_class_power_visibility(class_power_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': f'Class power visibility toggled to {"hidden" if class_power.hidden else "visible"}',
        'class_power': class_power.toDict()
    }), 200

# ==================== RACES ====================

@character_bp.route('/races', methods=['GET'])
@token_required
def get_races(current_user):
    """Get all races"""
    races = RaceService.get_all_races()
    l = []
    for r in races:
        if r.hidden and not _is_admin(current_user):
            continue
        r_dict = r.toDict()
        if not _is_admin(current_user):
            r_dict.pop('hidden', None)
        l.append(r_dict)

    return jsonify({
        'races': l
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
        'race': race.toDict()
    }), 201


@character_bp.route('/races/<int:race_id>', methods=['GET'])
@token_required
def get_race(current_user, race_id):
    """Get race by ID"""
    race = RaceService.get_race_by_id(race_id)

    if not race:
        return jsonify({'message': 'Race not found'}), 404
    
    if race.hidden and not _is_admin(current_user):
        return jsonify({'message': 'Race not found'}), 404
    
    r_dict = race.toDict()
    if not _is_admin(current_user):
        r_dict.pop('hidden', None)

    return jsonify({
        'race': r_dict
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
        'race': race.toDict()
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

@character_bp.route('/races/<int:race_id>/visibility', methods=['POST'])
@token_required
def toggle_race_visibility(current_user, race_id):
    """Toggle race visibility (admin only)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403
    
    race, error = RaceService.toggle_race_visibility(race_id)
    if error:
        return jsonify({'message': error}), 404
    else:
        return jsonify({
            'message': f'Race visibility toggled to {"hidden" if race.hidden else "visible"}',
            'race': race.toDict()
        }), 200

# ==================== ATTRIBUTES ====================

@character_bp.route('/attributes', methods=['GET'])
@token_required
def get_attributes(current_user):
    """Get all attributes"""
    attributes = AttributeService.get_all_attributes()
    return jsonify({
        'attributes': [a.toDict() for a in attributes]
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
        'attribute': attribute.toDict()
    }), 201


@character_bp.route('/attributes/<int:attribute_id>', methods=['GET'])
@token_required
def get_attribute(current_user, attribute_id):
    """Get attribute by ID"""
    attribute = AttributeService.get_attribute_by_id(attribute_id)
    
    if not attribute:
        return jsonify({'message': 'Attribute not found'}), 404
    
    return jsonify({
        'attribute': attribute.toDict()
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
        'attribute': attribute.toDict()
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
@token_required
def get_pericias(current_user):
    """Get all pericias"""
    pericias = PericiasService.get_all_pericias()
    return jsonify({
        'pericias': [
            p.toDict()
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
    
    if not AttributeService.get_attribute_by_id(data.get('attribute_id')):
        return jsonify({'message': 'Attribute not found'}), 404

    pericia = PericiasService.create_pericia(
        name=data.get('name'),
        description=data.get('description'),
        attribute_id=data.get('attribute_id')
    )
    
    return jsonify({
        'message': 'Pericia created successfully',
        'pericia': pericia.toDict()
    }), 201


@character_bp.route('/pericias/<int:pericia_id>', methods=['GET'])
@token_required
def get_pericia(current_user, pericia_id):
    """Get pericia by ID"""
    pericia = PericiasService.get_pericia_by_id(pericia_id)
    
    if not pericia:
        return jsonify({'message': 'Pericia not found'}), 404
    
    return jsonify({
        'pericia': pericia.toDict()
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
        'pericia': pericia.toDict()
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
@token_required
def get_classes(current_user):
    """Get all classes"""
    classes = ClassService.get_all_classes()
    l = []
    for cl in classes:
        class_dict = cl.toDict()

        for ability in class_dict.get('abilities', []):
            if ability.get('hidden', False) and not _is_admin(current_user):
                class_dict['abilities'].remove(ability)
            elif not _is_admin(current_user):
                ability.pop('hidden', None)

        for power in class_dict.get('classPowers', []):
            if power.get('hidden', False) and not _is_admin(current_user):
                class_dict['classPowers'].remove(power)
            elif not _is_admin(current_user):
                power.pop('hidden', None)
    
        l.append(class_dict)

    return jsonify({
        'classes': l
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
    

    
    char_class = ClassService.create_class(
        name=data.get('name'),
        description=data.get('description'),
        base_life=data.get('base_life', 10),
        base_defense=data.get('base_defense', 10),
        base_sanity=data.get('base_sanity', 10),
        base_mana=data.get('base_mana', 10),
        base_ocultism=data.get('base_ocultism', 10),
        has_mana=data.get('has_mana', False),
        has_ocultism=data.get('has_ocultism', False)
    )
    
    return jsonify({
        'message': 'Class created successfully',
        'class': char_class.toDict()
    }), 201


@character_bp.route('/classes/<int:class_id>', methods=['GET'])
@token_required
def get_class(current_user, class_id):
    """Get class by ID"""
    char_class = ClassService.get_class_by_id(class_id)
    
    if not char_class:
        return jsonify({'message': 'Class not found'}), 404
    
    class_dict = char_class.toDict()

    for ability in class_dict.get('abilities', []):
        if ability.get('hidden', False) and not _is_admin(current_user):
            class_dict['abilities'].remove(ability)
        elif not _is_admin(current_user):
            ability.pop('hidden', None)

    for power in class_dict.get('classPowers', []):
        if power.get('hidden', False) and not _is_admin(current_user):
            class_dict['classPowers'].remove(power)
        elif not _is_admin(current_user):
            power.pop('hidden', None)
    
    return jsonify({
        'class': class_dict
    }), 200


@character_bp.route('/classes/<int:class_id>', methods=['PUT'])
@token_required
def update_class(current_user, class_id):
    """Update class"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    print(data)
    char_class, error = ClassService.update_class(
        class_id,
        name=data.get('name'),
        description=data.get('description'),
        base_life=data.get('base_life'),
        base_defense=data.get('base_defense'),
        base_sanity=data.get('base_sanity'),
        base_mana=data.get('base_mana'),
        base_ocultism=data.get('base_ocultism'),
        has_mana=data.get('has_mana'),
        has_ocultism=data.get('has_ocultism')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Class updated successfully',
        'class': char_class.toDict()
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
@token_required
def get_subclasses(current_user):
    """Get all subclasses"""
    subclasses = SubclassService.get_all_subclasses()
    l = []
    for s in subclasses:
        subclass_dict = s.toDict()

        for ability in subclass_dict.get('abilities', []):
            if ability.get('hidden', False) and not _is_admin(current_user):
                subclass_dict['abilities'].remove(ability)
            elif not _is_admin(current_user):
                ability.pop('hidden', None)
        
        l.append(subclass_dict)

    return jsonify({
        'subclasses': l
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
    
    if not ClassService.get_class_by_id(data.get('class_id')):
        return jsonify({'message': 'Parent class not found'}), 404

    subclass, error = SubclassService.create_subclass(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
    )
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Subclass created successfully',
        'subclass': subclass.toDict()
    }), 201


@character_bp.route('/subclasses/<int:subclass_id>', methods=['GET'])
@token_required
def get_subclass(current_user, subclass_id):
    """Get subclass by ID"""
    subclass = SubclassService.get_subclass_by_id(subclass_id)
    
    if not subclass:
        return jsonify({'message': 'Subclass not found'}), 404
    
    return jsonify({
        'subclass': subclass.toDict()
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
        'subclass': subclass.toDict()
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

    char_attrs, error = CharacterAttributesService.get_character_attributes(character_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({'attributes': char_attrs}), 200


@character_bp.route('/characters/<int:character_id>/pericias', methods=['PUT'])
@token_required
def bulk_update_character_pericias(current_user, character_id):
    """Bulk update all pericias for a character
    
    Request body should contain 'pericias' array with pericia updates
    in the format: [{"pericia_id": 1, "value": 5}, ...]
    """
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or data.get('pericias') is None:
        return jsonify({'message': 'Missing pericias array'}), 400
    
    char_attrs, error = CharacterAttributesService.bulk_update_character_pericias(
        character_id,
        data.get('pericias', [])
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    _, error = CharacterService.sync_all_conversions(character_id)
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

    character, error = CharacterService.create_character(user_id=current_user.id, is_player=True if not _is_admin(current_user) else False)
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Character created successfully',
        'character': character.toDict()
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
            c.toDict()
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
        return jsonify({'message': error}), 404
    
    return jsonify({
        'character': character.toDict(),
        'stat_limits': stat_limits
    }), 200

@character_bp.route('/characters/<int:character_id>/stats', methods=['PUT'])
@token_required
def update_character_stats(current_user, character_id):
    """Update character stats (life, mana, sanity)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = ['life', 'mana', 'sanity', 'ocultism']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Unexpected field: {key}'}), 400
    
    character, error = CharacterService.update_character_stats(character_id, **data)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Character stats updated successfully',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/general', methods=['PUT'])
@token_required
def update_character_general(current_user, character_id):
    """Update character general info (name, class, race, etc)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = ['name', 'charClass', 'race', 'gender', 'age', 'subclass', 'second_class']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Unexpected field: {key}'}), 400
    
    character, error = CharacterService.update_character_general(character_id, **data)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Character general info updated successfully',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/description', methods=['PUT'])
@token_required
def update_character_description(current_user, character_id):
    """Update character description (physical, psychological, backstory)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = ['physical_description', 'psychological_description', 'backstory']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Unexpected field: {key}'}), 400

    character, error = CharacterService.update_character_description(character_id, **data)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Character description updated successfully',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/stats-offset', methods=['PUT'])
@token_required
def update_character_stats_offset(current_user, character_id):
    """Update character stats (only for admin)"""
    character = CharacterService.get_character_by_id(character_id)

    if not character:
        return jsonify({'message': 'Character not found'}), 404

    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json(silent=True) or {}

    allowed_fields = ['offset_life', 'offset_defense', 'offset_sanity', 'offset_ocultism', 'offset_mana']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Unexpected field: {key}'}), 400

    character, error = CharacterService.update_stats_off_sets(character_id, **data)

    if error:
        return jsonify({'message': error}), 404
    
    CharacterService.sync_stats_limit_change(character_id)  # Ensure current stats are within new limits after offset change

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Character stats updated successfully',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/toggle-active-status', methods=['POST'])
@token_required
def toggle_character_active_status(current_user, character_id):
    """Toggle character active status (only for admin)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Character not found'}), 404
    
    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Unauthorized'}), 403
    
    CharacterService.toggle_character_active_status(character_id)
    
    return jsonify({'message': 'Character ' + ('activated successfully' if character.active else 'deactivated successfully')}), 200



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
    
    if character.own == current_user.id:
        return jsonify({'message': 'Character already belongs to admin'}), 400
    
    # Transfer ownership to admin
    CharacterService.transferCharacterOwnership(character_id, current_user.id)
    if character.is_player:
        CharacterService.toggle_character_player_status(character_id)
    
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
        if character.active:
            CharacterService.toggle_character_active_status(character_id)
        return jsonify({'message': 'Character deactivated successfully'}), 200

    success, error = CharacterService.delete_character(character_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Character deleted successfully'}), 200


# ==================== CONVERSION RULES ====================

@character_bp.route('/conversion-rules', methods=['GET'])
@token_required
def get_conversion_rules(current_user):
    conversion_rules = ConversionRuleService.get_all_conversion_rules()
    return jsonify({
        'conversion_rules': [
            rule.toDict()
            for rule in conversion_rules
        ]
    }), 200


@character_bp.route('/conversion-rules/<int:rule_id>', methods=['GET'])
@token_required
def get_conversion_rule(current_user, rule_id):
    rule = ConversionRuleService.get_conversion_rule_by_id(rule_id)
    if not rule:
        return jsonify({'message': 'Conversion rule not found'}), 404

    return jsonify({
        'conversion_rule': rule.toDict()
    }), 200


@character_bp.route('/conversion-rules', methods=['POST'])
@token_required
def create_conversion_rule(current_user):
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    required_fields = ['stat', 'rate', 'conversion_type', 'target_id']

    for field in required_fields:
        missing = []
        if data.get(field) is None:
            missing.append(field)
        if field not in required_fields:
            return jsonify({'message': f'Unexpected field: {field}'}), 400
    if missing:
        return jsonify({'message': f'Missing required fields: {", ".join(missing)}'}), 400

    rule, error = ConversionRuleService.create_conversion_rule(
        attribute_id=data.get('attribute_id'),
        stat=data.get('stat'),
        rate=data.get('rate'),
        conversion_type=data.get('conversion_type'),
        target_id=data.get('target_id')
    )
    if error:
        return jsonify({'message': error}), 400
    
    _, error = CharacterService.sync_all()  # Sync all characters to apply new conversion rule immediately

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Conversion rule created successfully',
        'conversion_rule': rule.toDict()
    }), 201


@character_bp.route('/conversion-rules/<int:rule_id>', methods=['PUT'])
@token_required
def update_conversion_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    rule, error = ConversionRuleService.update_conversion_rule(
        rule_id,
        attribute_id=data.get('attribute_id'),
        stat=data.get('stat'),
        rate=data.get('rate'),
    )

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Conversion rule updated successfully',
        'conversion_rule': rule.toDict()
    }), 200

@character_bp.route('/conversion-rules/<int:rule_id>', methods=['DELETE'])
@token_required
def delete_conversion_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    success, error = ConversionRuleService.delete_conversion_rule(rule_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Conversion rule deleted successfully'}), 200


# ==================== LEVEL UP RULES ====================

@character_bp.route('/level-up-rules', methods=['GET'])
@token_required
def get_level_up_rules(current_user):
    level_up_rules = LevelUpRuleService.get_all_level_up_rules()
    return jsonify({
        'level_up_rules': [
            rule.toDict()
            for rule in level_up_rules
        ]
    }), 200


@character_bp.route('/level-up-rules/<int:rule_id>', methods=['GET'])
@token_required
def get_level_up_rule(current_user, rule_id):
    rule = LevelUpRuleService.get_level_up_rule_by_id(rule_id)
    if not rule:
        return jsonify({'message': 'Level up rule not found'}), 404

    return jsonify({
        'level_up_rule': rule.toDict()
    }), 200


@character_bp.route('/level-up-rules', methods=['POST'])
@token_required
def create_level_up_rule(current_user):
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    if data.get('level') is None or data.get('experience_required') is None:
        return jsonify({'message': 'Missing required fields'}), 400

    rule = LevelUpRuleService.create_level_up_rule(
        level=data.get('level'),
        experience_required=data.get('experience_required'),
    )

    return jsonify({
        'message': 'Level up rule created successfully',
        'level_up_rule': rule.toDict()
    }), 201


@character_bp.route('/level-up-rules/<int:rule_id>', methods=['PUT'])
@token_required
def update_level_up_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    rule, error = LevelUpRuleService.update_level_up_rule(
        rule_id,
        level=data.get('level'),
        experience_required=data.get('experience_required'),
    )

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Level up rule updated successfully',
        'level_up_rule': rule.toDict()
    }), 200