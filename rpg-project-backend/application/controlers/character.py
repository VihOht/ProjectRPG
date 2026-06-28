from flask import Blueprint, request, jsonify
from application.services.character import (
    AttributePowerService, AttributeValueService, ClassAbilityService, InventoryService, RaceService, AttributeService, PericiasService,
    ClassService, RitualService, SpecialAbilityService, SubclassService, CharacterAttributesService,
    CharacterService, ConversionRuleService, LevelUpRuleService, ClassPowerService, WizardcraftService
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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    ability = ClassAbilityService.create_ability(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        subclass_id=data.get('subclass_id'),
    )
    ability_dict = ability.toDict()

    
    return jsonify({
        'message': 'Abilidade criada com sucesso',
        'ability': ability_dict
    }), 201


@character_bp.route('/abilities/<int:ability_id>', methods=['GET'])
@token_required
def get_ability(current_user, ability_id):
    """Get ability by ID"""
    ability = ClassAbilityService.get_ability_by_id(ability_id)
    if not ability or (ability.hidden and not _is_admin(current_user)):
        return jsonify({'message': 'Abilidade não encontrada'}), 404
    
    if not ability:
        return jsonify({'message': 'Abilidade não encontrada'}), 404
    
    ability_dict = ability.toDict()
    if not _is_admin(current_user):
        ability_dict.pop('hidden', None)

    return jsonify({'ability': ability_dict}), 200
    
    


@character_bp.route('/abilities/<int:ability_id>', methods=['PUT'])
@token_required
def update_ability(current_user, ability_id):
    """Update ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    ability, error = ClassAbilityService.update_ability(
        ability_id,
        name=data.get('name'),
        description=data.get('description'),
        subclass_id=data.get('subclass_id'),
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Abilidade atualizada com sucesso',
        'ability': ability.toDict()
    }), 200



@character_bp.route('/abilities/<int:ability_id>', methods=['DELETE'])
@token_required
def delete_ability(current_user, ability_id):
    """Delete ability"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = ClassAbilityService.delete_ability(ability_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Abilidade excluída com sucesso'}), 200

@character_bp.route('/abilities/<int:ability_id>/visibility', methods=['POST'])
@token_required
def toggle_ability_visibility(current_user, ability_id):
    """Toggle ability visibility (Acesso Negado)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    ability, error = ClassAbilityService.toggle_ability_visibility(ability_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': f'Visibility da abilidade alternada para {"oculta" if ability.hidden else "visível"}',
        'ability': ability.toDict()
    }), 200



@character_bp.route('/abilities/<int:ability_id>/assign/<int:character_id>', methods=['POST'])
@token_required
def assign_ability_to_character(current_user, ability_id, character_id):
    """Assign an ability to a character""" 
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    _, error = ClassAbilityService.add_ability_to_character(character_id, ability_id)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Abilidade atribuída ao personagem com sucesso',
    }), 200


@character_bp.route('/abilities/<int:ability_id>/unassign/<int:character_id>', methods=['POST'])
@token_required
def unassign_ability_from_character(current_user, ability_id, character_id):
    """Unassign an ability from a character"""
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404

    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    _, error = ClassAbilityService.remove_ability_from_character(character_id, ability_id)
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Abilidade removida do personagem com sucesso',
    }), 200


# =============== SPECIAL ABILITIES =============

@character_bp.route('/special-abilities', methods=['GET'])
@token_required
def get_special_abilities(current_user):
    """Get all special abilities"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403
    special_abilities = SpecialAbilityService.get_all_special_abilities()

    return jsonify({
        'special_abilities': [sa.toDict() for sa in special_abilities]
    }), 200

@character_bp.route('/special-abilities/<int:special_ability_id>', methods=['GET'])
@token_required
def get_special_ability_by_id(current_user, special_ability_id):
    """Get a special ability by ID"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403
    special_ability, error = SpecialAbilityService.get_special_ability_by_id(special_ability_id)
    if error:
        return jsonify({'message': error}), 404
    
    character, error = CharacterService.get_character_by_id(special_ability.character_id)
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    return jsonify({
        'special_ability': special_ability.toDict()
    }), 200

@character_bp.route('/special-abilities', methods=['POST'])
@token_required
def create_special_ability(current_user):
    """Create a new special ability"""
    data = request.get_json(silent=True) or {}

    character_id = data.get('character_id')
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    special_ability, error = SpecialAbilityService.create_special_ability(
        name=data.get('name'),
        description=data.get('description'),
        character_id=character_id
    )
    if error:
        return jsonify({'message': error}), 400


    return jsonify({
        'message': 'Habilidade especial criada com sucesso',
        'special_ability': special_ability.toDict()
    }), 201

@character_bp.route('/special-abilities/<int:special_ability_id>', methods=['DELETE'])
@token_required
def delete_special_ability(current_user, special_ability_id):
    """Delete a special ability"""
    special_ability = SpecialAbilityService.get_special_ability_by_id(special_ability_id)
    if not special_ability:
        return jsonify({'message': 'Habilidade especial não encontrada'}), 404

    character = CharacterService.get_character_by_id(special_ability.character_id)
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = SpecialAbilityService.delete_special_ability(special_ability_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({}), 204

@character_bp.route('/special-abilities/<int:special_ability_id>', methods=['PUT'])
@token_required
def update_special_ability(current_user, special_ability_id):
    """Update a special ability"""
    special_ability = SpecialAbilityService.get_special_ability_by_id(special_ability_id)
    if not special_ability:
        return jsonify({'message': 'Habilidade especial não encontrada'}), 404

    character = CharacterService.get_character_by_id(special_ability.character_id)
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}

    if not data:
        return jsonify({'message': 'Nenhum dado fornecido'}), 400

    success, error = SpecialAbilityService.update_special_ability(
        special_ability_id,
        name=data.get('name'),
        description=data.get('description')
    )

    if not success:
        return jsonify({'message': error}), 400

    return jsonify({'message': 'Habilidade especial atualizada com sucesso'}), 200


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

@character_bp.route('/class-powers/<int:class_power_id>', methods=['GET'])
@token_required
def get_class_power(current_user, class_power_id):
    """Get class power by ID"""
    class_power = ClassPowerService.get_class_power_by_id(class_power_id)
    
    if not class_power or (class_power.hidden and not _is_admin(current_user)):
        return jsonify({'message': 'Class power não encontrada'}), 404
    
    cp_dict = class_power.toDict()
    if not _is_admin(current_user):
        cp_dict.pop('hidden', None)

    return jsonify({
        'class_power': cp_dict
    }), 200

@character_bp.route('/classes/<int:class_id>/class-powers', methods=['GET'])
@token_required
def get_class_powers_by_class(current_user, class_id):
    """Get all class powers for a specific class"""
    class_powers = ClassPowerService.get_class_powers_by_class(class_id)
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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    if not data.get('class_id'):
        return jsonify({'message': 'Campo obrigatório ausente: class_id'}), 400
    
    if not ClassService.get_class_by_id(data.get('class_id')):
        return jsonify({'message': 'Classe não encontrada'}), 404
    

    class_power = ClassPowerService.create_class_power(
        name=data.get('name'),
        description=data.get('description'),
        class_id=data.get('class_id'),
        level_to_unlock=data.get('level_to_unlock', 1)
    )
    
    return jsonify({
        'message': 'Class power criada com sucesso',
        'class_power': class_power.toDict()
    }), 201


@character_bp.route('/class-powers/<int:class_power_id>', methods=['PUT'])
@token_required
def update_class_power(current_user, class_power_id):
    """Update class power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

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
        'message': 'Class power atualizada com sucesso',
        'class_power': class_power.toDict()
    }), 200

@character_bp.route('/class-powers/<int:class_power_id>', methods=['DELETE'])
@token_required
def delete_class_power(current_user, class_power_id):
    """Delete class power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = ClassPowerService.delete_class_power(class_power_id)

    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Class power excluída com sucesso'}), 200

@character_bp.route('/class-powers/<int:class_power_id>/visibility', methods=['POST'])
@token_required
def toggle_class_power_visibility(current_user, class_power_id):
    """Toggle class power visibility (Acesso Negado)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    class_power, error = ClassPowerService.toggle_class_power_visibility(class_power_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': f'Visibility da class power alternada para {"oculta" if class_power.hidden else "visível"}',
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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    race = RaceService.create_race(
        name=data.get('name'),
        description=data.get('description')
    )
    
    return jsonify({
        'message': 'Raça criada com sucesso',
        'race': race.toDict()
    }), 201


@character_bp.route('/races/<int:race_id>', methods=['GET'])
@token_required
def get_race(current_user, race_id):
    """Get race by ID"""
    race = RaceService.get_race_by_id(race_id)

    if not race:
        return jsonify({'message': 'Raça não encontrada'}), 404
    
    if race.hidden and not _is_admin(current_user):
        return jsonify({'message': 'Raça não encontrada'}), 404
    
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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    race, error = RaceService.update_race(
        race_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Raça atualizada com sucesso',
        'race': race.toDict()
    }), 200


@character_bp.route('/races/<int:race_id>', methods=['DELETE'])
@token_required
def delete_race(current_user, race_id):
    """Delete race"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = RaceService.delete_race(race_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Raça excluída com sucesso'}), 200

@character_bp.route('/races/<int:race_id>/visibility', methods=['POST'])
@token_required
def toggle_race_visibility(current_user, race_id):
    """Toggle race visibility (Acesso Negado)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403
    
    race, error = RaceService.toggle_race_visibility(race_id)
    if error:
        return jsonify({'message': error}), 404
    else:
        return jsonify({
            'message': f'Visibilidade da raça alternada para {"oculta" if race.hidden else "visível"}',
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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    attribute = AttributeService.create_attribute(
        name=data.get('name'),
        description=data.get('description')
    )

    AttributeValueService.sync_all_attributes()  # Ensure all characters are updated
    
    return jsonify({
        'message': 'Atributo criado com sucesso',
        'attribute': attribute.toDict()
    }), 201


@character_bp.route('/attributes/<int:attribute_id>', methods=['GET'])
@token_required
def get_attribute(current_user, attribute_id):
    """Get attribute by ID"""
    attribute = AttributeService.get_attribute_by_id(attribute_id)
    
    if not attribute:
        return jsonify({'message': 'Atributo não encontrado'}), 404
    
    return jsonify({
        'attribute': attribute.toDict()
    }), 200


@character_bp.route('/attributes/<int:attribute_id>', methods=['PUT'])
@token_required
def update_attribute(current_user, attribute_id):
    """Update attribute"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    attribute, error = AttributeService.update_attribute(
        attribute_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Atributo atualizado com sucesso',
        'attribute': attribute.toDict()
    }), 200


@character_bp.route('/attributes/<int:attribute_id>', methods=['DELETE'])
@token_required
def delete_attribute(current_user, attribute_id):
    """Delete attribute"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = AttributeService.delete_attribute(attribute_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    AttributeValueService.sync_all_attributes()  # Ensure all characters are updated
    
    return jsonify({'message': 'Atributo excluído com sucesso'}), 200


# ================= ATTRIBUTE POWERS ===============
@character_bp.route('/attribute-powers', methods=['GET'])
@token_required
def get_attribute_powers(current_user):
    """Get all attribute powers"""
    attribute_powers = AttributePowerService.get_all_attribute_powers()
    l = []
    for ap in attribute_powers:
        if ap.hidden and not _is_admin(current_user):
            continue
        ap_dict = ap.toDict()
        if not _is_admin(current_user):
            ap_dict.pop('hidden', None)
        l.append(ap_dict)
    return jsonify({
        'attribute_powers': l
    }), 200

@character_bp.route('/attribute-powers/<int:attribute_power_id>', methods=['GET'])
@token_required
def get_attribute_power_by_id(current_user, attribute_power_id):
    """Get attribute power by ID"""
    attribute_power = AttributePowerService.get_attribute_power_by_id(attribute_power_id)
    
    if not attribute_power or (attribute_power.hidden and not _is_admin(current_user)):
        return jsonify({'message': 'Poder de atributo não encontrado'}), 404
    
    ap_dict = attribute_power.toDict()
    if not _is_admin(current_user):
        ap_dict.pop('hidden', None)

    return jsonify({
        'attribute_power': ap_dict
    }), 200

@character_bp.route('/attributes/<int:attribute_id>/attribute-powers', methods=['GET'])
@token_required
def get_attribute_powers_by_attribute(current_user, attribute_id):
    """Get all attribute powers for a specific attribute"""
    attribute_powers = AttributePowerService.get_attribute_powers_by_attribute(attribute_id)
    l = []
    for ap in attribute_powers:
        if ap.hidden and not _is_admin(current_user):
            continue
        ap_dict = ap.toDict()
        if not _is_admin(current_user):
            ap_dict.pop('hidden', None)
        l.append(ap_dict)
    return jsonify({
        'attribute_powers': l
    }), 200

@character_bp.route('/attribute-powers', methods=['POST'])
@token_required
def create_attribute_power(current_user):
    """Create a new attribute power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description') or not data.get('attribute_id'):
        return jsonify({'message': 'Campos obrigatórios ausentes (name, description, attribute_id)'}), 400
    
    if not AttributeService.get_attribute_by_id(data.get('attribute_id')):
        return jsonify({'message': 'Atributo não encontrado'}), 404

    attribute_power = AttributePowerService.create_attribute_power(
        name=data.get('name'),
        description=data.get('description'),
        attribute_id=data.get('attribute_id'),
        level_to_unlock=data.get('level_to_unlock', 1)
    )

    return jsonify({
        'message': 'Poder de atributo criado com sucesso',
        'attribute_power': attribute_power.toDict()
    }), 201

@character_bp.route('/attribute-powers/<int:attribute_power_id>', methods=['PUT'])
@token_required
def update_attribute_power(current_user, attribute_power_id):
    """Update attribute power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    attribute_power, error = AttributePowerService.update_attribute_power(
        attribute_power_id,
        name=data.get('name'),
        description=data.get('description'),
        level_to_unlock=data.get('level_to_unlock'),
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Poder de atributo atualizado com sucesso',
        'attribute_power': attribute_power.toDict()
    }), 200

@character_bp.route('/attribute-powers/<int:attribute_power_id>', methods=['DELETE'])
@token_required
def delete_attribute_power(current_user, attribute_power_id):
    """Delete attribute power"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = AttributePowerService.delete_attribute_power(attribute_power_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Poder de atributo excluído com sucesso'}), 200

@character_bp.route('/attribute-powers/<int:attribute_power_id>/visibility', methods=['POST'])
@token_required
def toggle_attribute_power_visibility(current_user, attribute_power_id):
    """Toggle attribute power visibility (Acesso Negado)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    attribute_power, error = AttributePowerService.toggle_attribute_power_visibility(attribute_power_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': f'Visibility do poder de atributo alternada para {"oculta" if attribute_power.hidden else "visível"}',
        'attribute_power': attribute_power.toDict()
    }), 200

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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description') or not data.get('attribute_id'):
        return jsonify({'message': 'Campos obrigatórios ausentes (name, description, attribute_id)'}), 400
    
    if not AttributeService.get_attribute_by_id(data.get('attribute_id')):
        return jsonify({'message': 'Atributo não encontrado'}), 404

    pericia = PericiasService.create_pericia(
        name=data.get('name'),
        description=data.get('description'),
        attribute_id=data.get('attribute_id')
    )

    AttributeValueService.sync_all_attributes()  # Ensure all characters are updated
    
    return jsonify({
        'message': 'Pericia criada com sucesso',
        'pericia': pericia.toDict()
    }), 201


@character_bp.route('/pericias/<int:pericia_id>', methods=['GET'])
@token_required
def get_pericia(current_user, pericia_id):
    """Get pericia by ID"""
    pericia = PericiasService.get_pericia_by_id(pericia_id)
    
    if not pericia:
        return jsonify({'message': 'Pericia não encontrada'}), 404
    
    return jsonify({
        'pericia': pericia.toDict()
    }), 200


@character_bp.route('/pericias/<int:pericia_id>', methods=['PUT'])
@token_required
def update_pericia(current_user, pericia_id):
    """Update pericia"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

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
        'message': 'Pericia atualizada com sucesso',
        'pericia': pericia.toDict()
    }), 200


@character_bp.route('/pericias/<int:pericia_id>', methods=['DELETE'])
@token_required
def delete_pericia(current_user, pericia_id):
    """Delete pericia"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = PericiasService.delete_pericia(pericia_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    AttributeValueService.sync_all_attributes()  # Ensure all characters are updated
    return jsonify({'message': 'Pericia excluída com sucesso'}), 200


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
        return jsonify({'message': 'Acesso negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes (name, description)'}), 400
    

    
    char_class = ClassService.create_class(
        name=data.get('name'),
        description=data.get('description'),
        base_life=data.get('base_life', 10),
        base_defense=data.get('base_defense', 10),
        base_sanity=data.get('base_sanity', 10),
        base_mana=data.get('base_mana', 10),
        base_ocultism=data.get('base_ocultism', 10),
        base_power=data.get('base_power', 10),
        base_inventory_capacity=data.get('base_inventory_capacity', 10),
        has_mana=data.get('has_mana', False),
        has_ocultism=data.get('has_ocultism', False)
    )
    
    return jsonify({
        'message': 'Classe criada com sucesso',
        'class': char_class.toDict()
    }), 201


@character_bp.route('/classes/<int:class_id>', methods=['GET'])
@token_required
def get_class(current_user, class_id):
    """Get class by ID"""
    char_class = ClassService.get_class_by_id(class_id)
    
    if not char_class:
        return jsonify({'message': 'Classe não encontrada'}), 404
    
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
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    char_class, error = ClassService.update_class(
        class_id,
        name=data.get('name'),
        description=data.get('description'),
        base_life=data.get('base_life'),
        base_defense=data.get('base_defense'),
        base_sanity=data.get('base_sanity'),
        base_mana=data.get('base_mana'),
        base_ocultism=data.get('base_ocultism'),
        base_power=data.get('base_power'),
        base_inventory_capacity=data.get('base_inventory_capacity'),
        has_mana=data.get('has_mana'),
        has_ocultism=data.get('has_ocultism')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Classe atualizada com sucesso',
        'class': char_class.toDict()
    }), 200


@character_bp.route('/classes/<int:class_id>', methods=['DELETE'])
@token_required
def delete_class(current_user, class_id):
    """Delete class"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = ClassService.delete_class(class_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Classe excluída com sucesso'}), 200


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
        return jsonify({'message': 'Acesso Negado'}), 403

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
        'message': 'Subclass criada com sucesso',
        'subclass': subclass.toDict()
    }), 201


@character_bp.route('/subclasses/<int:subclass_id>', methods=['GET'])
@token_required
def get_subclass(current_user, subclass_id):
    """Get subclass by ID"""
    subclass = SubclassService.get_subclass_by_id(subclass_id)
    
    if not subclass:
        return jsonify({'message': 'Subclass não encontrada'}), 404
    
    return jsonify({
        'subclass': subclass.toDict()
    }), 200


@character_bp.route('/subclasses/<int:subclass_id>', methods=['PUT'])
@token_required
def update_subclass(current_user, subclass_id):
    """Update subclass"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    subclass, error = SubclassService.update_subclass(
        subclass_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Subclass atualizada com sucesso',
        'subclass': subclass.toDict()
    }), 200


@character_bp.route('/subclasses/<int:subclass_id>', methods=['DELETE'])
@token_required
def delete_subclass(current_user, subclass_id):
    """Delete subclass"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = SubclassService.delete_subclass(subclass_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Subclass excluída com sucesso'}), 200


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
        return jsonify({'message': 'Array de perícias ausente'}), 400
    
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
        'message': 'Perícias do personagem atualizadas com sucesso',
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
    
    created_inventories, error = InventoryService.create_standards_inventories_for_character(character.id)
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Personagem criado com sucesso',
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
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403
    
    if character.own == current_user.id and not _is_admin(current_user) and not character.active:
        return jsonify({'message': 'Personagem não está ativo'}), 403
    
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
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = ['life', 'mana', 'sanity', 'ocultism']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Campo inesperado: {key}'}), 400
    
    character, error = CharacterService.update_character_stats(character_id, **data)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Estatísticas do personagem atualizadas com sucesso',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/general', methods=['PUT'])
@token_required
def update_character_general(current_user, character_id):
    """Update character general info (name, class, race, etc)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = ['name', 'charClass', 'race', 'gender', 'age', 'subclass', 'second_class', 'level', 'experience']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Campo inesperado: {key}'}), 400
    
    character, error = CharacterService.update_character_general(character_id, **data)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Informações gerais do personagem atualizadas com sucesso',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/description', methods=['PUT'])
@token_required
def update_character_description(current_user, character_id):
    """Update character description (physical, psychological, backstory)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403
    
    data = request.get_json(silent=True) or {}

    allowed_fields = ['physical_description', 'psychological_description', 'backstory']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Campo inesperado: {key}'}), 400

    character, error = CharacterService.update_character_description(character_id, **data)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Descrição do personagem atualizada com sucesso',
        'character': character.toDict()
    }), 200


@character_bp.route('/characters/<int:character_id>/stats-offset', methods=['PUT'])
@token_required
def update_character_stats_offset(current_user, character_id):
    """Update character stats (only for admin)"""
    character = CharacterService.get_character_by_id(character_id)

    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404

    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403

    data = request.get_json(silent=True) or {}

    allowed_fields = ['offset_life', 'offset_defense', 'offset_sanity', 'offset_ocultism', 'offset_mana', 'offset_power']
    for key in data.keys():
        if key not in allowed_fields:
            return jsonify({'message': f'Campo inesperado: {key}'}), 400

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
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403
    
    CharacterService.toggle_character_active_status(character_id)
    
    return jsonify({'message': 'Personagem ' + ('ativado com sucesso' if character.active else 'desativado com sucesso')}), 200



@character_bp.route('/characters/<int:character_id>/transfer-ownership/<int:new_user_id>', methods=['POST'])
@token_required
def transfer_character_ownership(current_user, character_id, new_user_id):
    """Transfer character ownership to another user (only for admin)"""
    # Check if the current user is admin
    if not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403

    character, error = CharacterService.transferCharacterOwnership(character_id, new_user_id)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Propriedade do personagem transferida com sucesso'}), 200    


@character_bp.route('/characters/<int:character_id>/return-to-admin', methods=['POST'])
@token_required
def return_character_to_admin(current_user, character_id):
    """Return character to admin and convert to NPC (for admins only)"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Only admins can convert player characters to NPC
    if not _is_admin(current_user):
        return jsonify({'message': 'Apenas administradores podem converter personagens em NPC'}), 403
    
    if character.own == current_user.id:
        return jsonify({'message': 'Personagem já pertence ao admin'}), 400
    
    # Transfer ownership to admin
    CharacterService.transferCharacterOwnership(character_id, current_user.id)
    if character.is_player:
        CharacterService.toggle_character_player_status(character_id)
    
    return jsonify({'message': 'Personagem convertido para NPC e transferido para o admin com sucesso'}), 200


@character_bp.route('/characters/<int:character_id>', methods=['DELETE'])
@token_required
def delete_character(current_user, character_id):
    """Delete character"""
    character = CharacterService.get_character_by_id(character_id)
    
    if not character:
        return jsonify({'message': 'Personagem não encontrado'}), 404
    
    # Check if character belongs to current user
    if character.own != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Não autorizado'}), 403
    
    if character.own == current_user.id and not _is_admin(current_user):
        if character.active:
            CharacterService.toggle_character_active_status(character_id)
        return jsonify({'message': 'Personagem desativado com sucesso'}), 200

    success, error = CharacterService.delete_character(character_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Personagem excluído com sucesso'}), 200


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
        return jsonify({'message': 'Regra de conversão não encontrada'}), 404

    return jsonify({
        'conversion_rule': rule.toDict()
    }), 200


@character_bp.route('/conversion-rules', methods=['POST'])
@token_required
def create_conversion_rule(current_user):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    required_fields = ['stat', 'rate', 'conversion_type', 'target_id']

    for field in required_fields:
        missing = []
        if data.get(field) is None:
            missing.append(field)
        if field not in required_fields:
            return jsonify({'message': f'Campo inválido: {field}'}), 400
    if missing:
        return jsonify({'message': f'Campos obrigatórios ausentes: {", ".join(missing)}'}), 400

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
        'message': 'Regra de conversão criada com sucesso',
        'conversion_rule': rule.toDict()
    }), 201


@character_bp.route('/conversion-rules/<int:rule_id>', methods=['PUT'])
@token_required
def update_conversion_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

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
        'message': 'Regra de conversão atualizada com sucesso',
        'conversion_rule': rule.toDict()
    }), 200

@character_bp.route('/conversion-rules/<int:rule_id>', methods=['DELETE'])
@token_required
def delete_conversion_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = ConversionRuleService.delete_conversion_rule(rule_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Regra de conversão excluída com sucesso'}), 200


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
        return jsonify({'message': 'Regra de subida de nível não encontrada'}), 404

    return jsonify({
        'level_up_rule': rule.toDict()
    }), 200


@character_bp.route('/level-up-rules', methods=['POST'])
@token_required
def create_level_up_rule(current_user):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    if data.get('level') is None or data.get('experience_required') is None or data.get("description") is None:
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400

    rule = LevelUpRuleService.create_level_up_rule(
        level=data.get('level'),
        experience_required=data.get('experience_required'),
        description=data.get('description')
    )

    return jsonify({
        'message': 'Regra de subida de nível criada com sucesso',
        'level_up_rule': rule.toDict()
    }), 201


@character_bp.route('/level-up-rules/<int:rule_id>', methods=['PUT'])
@token_required
def update_level_up_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    rule, error = LevelUpRuleService.update_level_up_rule(
        rule_id,
        level=data.get('level'),
        experience_required=data.get('experience_required'),
        description=data.get('description')
    )

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Regra de subida de nível atualizada com sucesso',
        'level_up_rule': rule.toDict()
    }), 200

@character_bp.route('/level-up-rules/<int:rule_id>', methods=['DELETE'])
@token_required
def delete_level_up_rule(current_user, rule_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = LevelUpRuleService.delete_level_up_rule(rule_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Regra de subida de nível excluída com sucesso'}), 200


# ==================== RITUALS ====================
@character_bp.route('/rituals', methods=['GET'])
@token_required
def get_rituals(current_user):
    """Get all rituals"""
    rituals = RitualService.get_all_rituals()
    l = []
    for r in rituals:
        ritual_dict = r.toDict()
        if ritual_dict.get('hidden', False) and not _is_admin(current_user):
            continue
        elif not _is_admin(current_user):
            ritual_dict.pop('hidden', None)
        l.append(ritual_dict)
    return jsonify({
        'rituals': l
    }), 200


@character_bp.route('/rituals/<int:ritual_id>', methods=['GET'])
@token_required
def get_ritual(current_user, ritual_id):
    """Get ritual by ID"""
    ritual = RitualService.get_ritual_by_id(ritual_id)
    
    if not ritual:
        return jsonify({'message': 'Ritual não encontrado'}), 404
    
    ritual_dict = ritual.toDict()
    if ritual_dict.get('hidden', False) and not _is_admin(current_user):
        return jsonify({'message': 'Ritual não encontrado'}), 404
    elif not _is_admin(current_user):
        ritual_dict.pop('hidden', None)
    
    return jsonify({
        'ritual': ritual_dict
    }), 200

@character_bp.route('/rituals', methods=['POST'])
@token_required
def create_ritual(current_user):
    """Create a new ritual"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes (name, description)'}), 400
    
    if not data.get('ocultism_cost') or not isinstance(data.get('ocultism_cost'), int) or data.get('ocultism_cost') < 0:
        return jsonify({'message': 'Campo obrigatório ausente ou inválido: ocultism_cost (deve ser um inteiro não negativo)'}), 400

    if not data.get('power_level') or not isinstance(data.get('power_level'), int) or data.get('power_level') < 0:
        return jsonify({'message': 'Campo obrigatório ausente ou inválido: power_level (deve ser um inteiro não negativo)'}), 400

    ritual = RitualService.create_ritual(
        name=data.get('name'),
        description=data.get('description'),
        ocultism_cost=data.get('ocultism_cost'),
        power_level=data.get('power_level'),
        subclass_id=data.get('subclass_id', None),
    )
    
    return jsonify({
        'message': 'Ritual criado com sucesso',
        'ritual': ritual.toDict()
    }), 201

@character_bp.route('/rituals/<int:ritual_id>', methods=['PUT'])
@token_required
def update_ritual(current_user, ritual_id):
    """Update ritual"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    ritual, error = RitualService.update_ritual(
        ritual_id,
        name=data.get('name'),
        description=data.get('description'),
        ocultism_cost=data.get('ocultism_cost'),
        power_level=data.get('power_level'),
        subclass_id=data.get('subclass_id', None),
    )

    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Ritual atualizado com sucesso',
        'ritual': ritual.toDict()
    }), 200

@character_bp.route('/rituals/<int:ritual_id>', methods=['DELETE'])
@token_required
def delete_ritual(current_user, ritual_id):
    """Delete ritual"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = RitualService.delete_ritual(ritual_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Ritual excluído com sucesso'}), 200

@character_bp.route('/rituals/<int:ritual_id>/toggle-hidden', methods=['POST'])
@token_required
def toggle_ritual_hidden_status(current_user, ritual_id):
    """Toggle ritual hidden status (only for admin)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    ritual, error = RitualService.toggle_ritual_hidden_status(ritual_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Status de oculto do ritual alterado com sucesso',
        'ritual': ritual.toDict()
    }), 200


@character_bp.route('/rituals/<int:ritual_id>/assign/<int:character_id>', methods=['POST'])
@token_required
def assign_ritual_to_character(current_user, ritual_id, character_id):
    """Assign ritual to character"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    character, error = RitualService.assign_ritual_to_character(ritual_id, character_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Ritual atribuído ao personagem com sucesso',
        'character': character.toDict()
    }), 200

@character_bp.route('/rituals/<int:ritual_id>/unassign/<int:character_id>', methods=['POST'])
@token_required
def unassign_ritual_from_character(current_user, ritual_id, character_id):
    """Unassign ritual from character"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    character, error = RitualService.unassign_ritual_from_character(ritual_id, character_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Ritual desatribuído do personagem com sucesso',
        'character': character.toDict()
    }), 200

# ===================== WIZARDCRAFT ====================
@character_bp.route('/wizardcrafts', methods=['GET'])
@token_required
def get_wizardcrafts(current_user):
    """Get all wizardcrafts"""
    wizardcrafts = WizardcraftService.get_all_wizardcrafts()
    l = []
    for w in wizardcrafts:
        wizardcraft_dict = w.toDict()
        if wizardcraft_dict.get('hidden', False) and not _is_admin(current_user):
            continue
        elif not _is_admin(current_user):
            wizardcraft_dict.pop('hidden', None)
        l.append(wizardcraft_dict)
    return jsonify({
        'wizardcrafts': l
    }), 200
    
@character_bp.route('/wizardcrafts/<int:wizardcraft_id>', methods=['GET'])
@token_required
def get_wizardcraft(current_user, wizardcraft_id):
    """Get wizardcraft by ID"""
    wizardcraft = WizardcraftService.get_wizardcraft_by_id(wizardcraft_id)
    
    if not wizardcraft:
        return jsonify({'message': 'Wizardcraft não encontrado'}), 404
    
    wizardcraft_dict = wizardcraft.toDict()
    if wizardcraft_dict.get('hidden', False) and not _is_admin(current_user):
        return jsonify({'message': 'Wizardcraft não encontrado'}), 404
    elif not _is_admin(current_user):
        wizardcraft_dict.pop('hidden', None)
    
    return jsonify({
        'wizardcraft': wizardcraft_dict
    }), 200

@character_bp.route('/wizardcrafts', methods=['POST'])
@token_required
def create_wizardcraft(current_user):
    """Create a new wizardcraft"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Campos obrigatórios ausentes (name, description)'}), 400
    
    if not data.get('mana_cost') or not isinstance(data.get('mana_cost'), int) or data.get('mana_cost') < 0:
        return jsonify({'message': 'Campo obrigatório ausente ou inválido: mana_cost (deve ser um inteiro não negativo)'}), 400
    
    wizardcraft = WizardcraftService.create_wizardcraft(
        name=data.get('name'),
        description=data.get('description'),
        mana_cost=data.get('mana_cost'),
    )
    
    return jsonify({
        'message': 'Wizardcraft criado com sucesso',
        'wizardcraft': wizardcraft.toDict()
    }), 201

@character_bp.route('/wizardcrafts/<int:wizardcraft_id>', methods=['PUT'])
@token_required
def update_wizardcraft(current_user, wizardcraft_id):
    """Update wizardcraft"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}
    
    wizardcraft, error = WizardcraftService.update_wizardcraft(
        wizardcraft_id,
        name=data.get('name'),
        description=data.get('description'),
        mana_cost=data.get('mana_cost'),
    )

    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Wizardcraft atualizado com sucesso',
        'wizardcraft': wizardcraft.toDict()
    }), 200

@character_bp.route('/wizardcrafts/<int:wizardcraft_id>', methods=['DELETE'])
@token_required
def delete_wizardcraft(current_user, wizardcraft_id):
    """Delete wizardcraft"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = WizardcraftService.delete_wizardcraft(wizardcraft_id)
    
    if not success:
        return jsonify({'message': error}), 404
    
    return jsonify({'message': 'Wizardcraft excluído com sucesso'}), 200


@character_bp.route('/wizardcrafts/<int:wizardcraft_id>/toggle-hidden', methods=['POST'])
@token_required
def toggle_wizardcraft_hidden_status(current_user, wizardcraft_id):
    """Toggle wizardcraft hidden status (only for admin)"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    wizardcraft, error = WizardcraftService.toggle_wizardcraft_hidden_status(wizardcraft_id)
    
    if error:
        return jsonify({'message': error}), 404
    
    return jsonify({
        'message': 'Status de oculto do wizardcraft alterado com sucesso',
        'wizardcraft': wizardcraft.toDict()
    }), 200


@character_bp.route('/wizardcrafts/<int:wizardcraft_id>/assign/<int:character_id>', methods=['POST'])
@token_required
def assign_wizardcraft_to_character(current_user, wizardcraft_id, character_id):
    """Assign wizardcraft to character"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    character, error = WizardcraftService.assign_wizardcraft_to_character(wizardcraft_id, character_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Wizardcraft atribuído ao personagem com sucesso',
        'character': character.toDict()
    }), 200

@character_bp.route('/wizardcrafts/<int:wizardcraft_id>/unassign/<int:character_id>', methods=['POST'])
@token_required
def unassign_wizardcraft_from_character(current_user, wizardcraft_id, character_id):
    """Unassign wizardcraft from character"""
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    character, error = WizardcraftService.unassign_wizardcraft_from_character(wizardcraft_id, character_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Wizardcraft desatribuído do personagem com sucesso',
        'character': character.toDict()
    }), 200



