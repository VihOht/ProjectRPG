from flask import Blueprint, request, jsonify

from application.services.character import (
    CharacterService,
    InventoryService,
    ItemService,
    InventoryItemService,
)
from application.controlers.auth import token_required


inventory_bp = Blueprint('inventory', __name__, url_prefix='/api')


def _is_admin(user):
    return (getattr(user, 'role', 'USER') or 'USER').upper() == 'ADMIN'


def _can_access_character(current_user, character_id):
    character = CharacterService.get_character_by_id(character_id)
    if not character:
        return None, jsonify({'message': 'Personagem não encontrado'}), 404

    if character.own != current_user.id and not _is_admin(current_user):
        return None, jsonify({'message': 'Acesso Negado'}), 403

    return character, None, None


# ==================== INVENTORIES ====================

@inventory_bp.route('/characters/<int:character_id>/inventories', methods=['GET'])
@token_required
def get_character_inventories(current_user, character_id):
    character, response, status = _can_access_character(current_user, character_id)
    if response:
        return response, status

    inventories, error = InventoryService.get_character_inventories(character_id)
    if error:
        return jsonify({'message': error}), 404

    return jsonify({'inventories': inventories}), 200


@inventory_bp.route('/characters/<int:character_id>/inventories', methods=['POST'])
@token_required
def create_inventory(current_user, character_id):
    character, response, status = _can_access_character(current_user, character_id)
    if response:
        return response, status

    data = request.get_json(silent=True) or {}

    if not data.get('name') or not data.get('description') or not data.get('type'):
        return jsonify({
            'message': 'Campos obrigatórios ausentes (name, description, type)'
        }), 400

    inventory, error = InventoryService.create_inventory(
        character_id=character_id,
        name=data.get('name'),
        description=data.get('description'),
        type=data.get('type'),
        capacity=data.get('capacity', 0),
    )

    if error:
        return jsonify({'message': error}), 400

    return jsonify({
        'message': 'Inventário criado com sucesso',
        'inventory': inventory.toDict()
    }), 201


@inventory_bp.route('/inventories/<int:inventory_id>', methods=['PUT'])
@token_required
def update_inventory(current_user, inventory_id):
    data = request.get_json(silent=True) or {}

    inventory, error = InventoryService.update_inventory(
        inventory_id=inventory_id,
        name=data.get('name'),
        description=data.get('description'),
        capacity=data.get('capacity'),
    )

    if error:
        return jsonify({'message': error}), 404

    character, response, status = _can_access_character(current_user, inventory.character_id)
    if response:
        return response, status

    return jsonify({
        'message': 'Inventário atualizado com sucesso',
        'inventory': inventory.toDict()
    }), 200


@inventory_bp.route('/inventories/<int:inventory_id>', methods=['DELETE'])
@token_required
def delete_inventory(current_user, inventory_id):
    inventory = InventoryService.get_inventory_by_id(inventory_id)
    if not inventory:
        return jsonify({'message': 'Inventário não encontrado'}), 404
    
    if inventory.character_id != current_user.id and not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403
    success, error = InventoryService.delete_inventory(inventory_id)

    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Inventário excluído com sucesso'}), 200


@inventory_bp.route('/inventories/types', methods=['GET'])
@token_required
def get_inventory_types(current_user):
    return jsonify({
        'inventory_types': InventoryService.get_inventory_types()
    }), 200


@inventory_bp.route('/inventories/<int:inventory_id>/transfer-ownership/<int:new_character_id>', methods=['POST'])
@token_required
def transfer_inventory_ownership(current_user, inventory_id, new_character_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    inventory, error = InventoryService.transfer_inventory_ownership(
        inventory_id,
        new_character_id
    )

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Inventário transferido com sucesso',
        'inventory': inventory.toDict()
    }), 200


# ==================== INVENTORY ITEMS ====================

@inventory_bp.route('/inventories/<int:inventory_id>/items', methods=['GET'])
@token_required
def get_inventory_items(current_user, inventory_id):
    items, error = InventoryService.get_inventory_items(inventory_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({'items': items}), 200


@inventory_bp.route('/inventories/<int:inventory_id>/items', methods=['POST'])
@token_required
def add_item_to_inventory(current_user, inventory_id):
    data = request.get_json(silent=True) or {}

    if data.get('item_id') is None:
        return jsonify({'message': 'Campo obrigatório ausente: item_id'}), 400

    inventory_items, error = InventoryService.add_item_to_inventory(
        inventory_id=inventory_id,
        item_id=data.get('item_id'),
        quantity=data.get('quantity', 1),
    )

    if error:
        return jsonify({'message': error}), 400

    return jsonify({
        'message': 'Item adicionado ao inventário com sucesso',
        'inventory_item': [item.toDict() for item in inventory_items] if isinstance(inventory_items, list) else inventory_items.toDict()
    }), 201


@inventory_bp.route('/inventories/<int:inventory_id>/items/<int:item_id>', methods=['DELETE'])
@token_required
def delete_inventory_item(current_user, inventory_id, item_id):
    success, error = InventoryItemService.delete_inventory_item(inventory_id, item_id)

    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Item removido do inventário com sucesso'}), 200


@inventory_bp.route('/inventories/<int:inventory_id>/items/<int:item_id>/remove', methods=['POST'])
@token_required
def remove_item_from_inventory(current_user, inventory_id, item_id):
    data = request.get_json(silent=True) or {}

    inventory_item, error = InventoryService.remove_item_from_inventory(
        inventory_id=inventory_id,
        item_id=item_id,
        quantity=data.get('quantity', 1),
    )

    if error:
        return jsonify({'message': error}), 400

    return jsonify({
        'message': 'Item removido do inventário com sucesso',
        'inventory_item': [i.toDict() for i in inventory_item] if isinstance(inventory_item, list) else inventory_item.toDict() if inventory_item else None
    }), 200


@inventory_bp.route('/inventories/<int:source_inventory_id>/transfer-item/<int:target_inventory_id>', methods=['POST'])
@token_required
def transfer_item_between_inventories(current_user, source_inventory_id, target_inventory_id):
    data = request.get_json(silent=True) or {}

    if data.get('item_id') is None:
        return jsonify({'message': 'Campo obrigatório ausente: item_id'}), 400

    success, error = InventoryService.transfer_item_between_inventories(
        source_inventory_id=source_inventory_id,
        target_inventory_id=target_inventory_id,
        item_id=data.get('item_id'),
        quantity=data.get('quantity', 1),
    )

    if error:
        return jsonify({'message': error}), 400

    return jsonify({'message': 'Item transferido com sucesso'}), 200


# ==================== ITEMS ====================

@inventory_bp.route('/items', methods=['GET'])
@token_required
def get_items(current_user):
    items = ItemService.get_all_items()
    items_dict = []
    for item in items:
        item_dict = item.toDict()
        if not _is_admin(current_user) and item_dict.get('hidden', False):
            continue
        if not _is_admin(current_user):
            item_dict.pop('hidden', None)
            item_dict.pop('temporary', None)
        items_dict.append(item_dict)
    return jsonify({
        'items': items_dict
    }), 200


@inventory_bp.route('/items/<int:item_id>', methods=['GET'])
@token_required
def get_item(current_user, item_id):
    item = ItemService.get_item_by_id(item_id)

    if not item:
        return jsonify({'message': 'Item não encontrado'}), 404
    
    dic = item.toDict()
    if not _is_admin(current_user) and dic.get('hidden', False):
        return jsonify({'message': 'Item não encontrado'}), 404
    if not _is_admin(current_user):
        dic.pop('hidden', None)
        dic.pop('temporary', None)

    return jsonify({'item': dic}), 200


@inventory_bp.route('/items', methods=['POST'])
@token_required
def create_item(current_user):
    data = request.get_json(silent=True) or {}

    required_fields = ['name', 'description', 'item_type']
    missing = [field for field in required_fields if not data.get(field)]

    temporary = not _is_admin(current_user)

    if missing:
        return jsonify({
            'message': f'Campos obrigatórios ausentes: {", ".join(missing)}'
        }), 400

    item = ItemService.create_item(
        name=data.get('name'),
        description=data.get('description'),
        item_type=data.get('item_type'),
        data=data.get('data', {}),
        stackable=data.get('stackable', False),
        equipable=data.get('equipable', False),
        max_quantity=data.get('max_quantity'),
        temporary=temporary,
        hidden=_is_admin(current_user)
    )

    if isinstance(item, tuple):
        item, error = item
        if error:
            return jsonify({'message': error}), 400

    return jsonify({
        'message': 'Item criado com sucesso',
        'item': item.toDict()
    }), 201


@inventory_bp.route('/items/<int:item_id>', methods=['PUT'])
@token_required
def update_item(current_user, item_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    data = request.get_json(silent=True) or {}

    item, error = ItemService.update_item(
        item_id=item_id,
        data=data.get('data', {}),
        name=data.get('name'),
        description=data.get('description'),
        stackable=data.get('stackable'),
        equipable=data.get('equipable'),
        max_quantity=data.get('max_quantity'),
    )

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Item atualizado com sucesso',
        'item': item.toDict()
    }), 200


@inventory_bp.route('/items/<int:item_id>', methods=['DELETE'])
@token_required
def delete_item(current_user, item_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    success, error = ItemService.delete_item(item_id)

    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Item excluído com sucesso'}), 200

@inventory_bp.route('/items/<int:item_id>/toggle-visibility', methods=['POST'])
@token_required
def toggle_item_visibility(current_user, item_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    item, error = ItemService.toggle_item_hidden_status(item_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Visibilidade do item atualizada com sucesso',
        'item': item.toDict()
    }), 200

@inventory_bp.route('/items/<int:item_id>/toggle-temporary', methods=['POST'])
@token_required
def toggle_item_temporary(current_user, item_id):
    if not _is_admin(current_user):
        return jsonify({'message': 'Acesso Negado'}), 403

    item, error = ItemService.toggle_item_temporary_status(item_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Status temporário do item atualizado com sucesso',
        'item': item.toDict()
    }), 200
