from flask import Blueprint, jsonify, request

from aplication.controlers.auth import token_required
from aplication.services.lore import LoreService

lore_bp = Blueprint('lore', __name__, url_prefix='/api')


@lore_bp.route('/lore/sessions', methods=['GET'])
@token_required
def get_lore_sessions(current_user):
    """Return all lore sessions with nested documents and images."""
    sessions = LoreService.get_all_sessions()
    return jsonify({'sessions': sessions}), 200


@lore_bp.route('/lore/sessions/<int:session_id>', methods=['GET'])
@token_required
def get_lore_session(current_user, session_id):
    """Return one lore session with nested documents and images."""
    session = LoreService.get_session_by_id(session_id)
    if not session:
        return jsonify({'message': 'Lore session not found'}), 404

    return jsonify({'session': session}), 200


@lore_bp.route('/lore/sessions', methods=['POST'])
@token_required
def create_lore_session(current_user):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    if not data.get('name') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400

    session = LoreService.create_session(data.get('name'), data.get('description'))
    return jsonify({
        'message': 'Lore session created successfully',
        'session': {
            'id': session.id,
            'name': session.name,
            'description': session.description,
            'documents': [],
            'images': [],
        }
    }), 201


@lore_bp.route('/lore/sessions/<int:session_id>', methods=['DELETE'])
@token_required
def delete_lore_session(current_user, session_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    success, error = LoreService.delete_session(session_id)
    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Lore session deleted successfully'}), 200


@lore_bp.route('/lore/sessions/<int:session_id>/documents', methods=['POST'])
@token_required
def create_lore_document(current_user, session_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    if not data.get('title') or not data.get('content'):
        return jsonify({'message': 'Missing required fields'}), 400

    document, error = LoreService.create_document(session_id, data.get('title'), data.get('content'))
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Document created successfully',
        'document': {
            'id': document.id,
            'title': document.title,
            'content': document.content,
            'session_id': document.section_id,
            'order': document.order,
            'subdocuments': [],
        }
    }), 201


@lore_bp.route('/lore/documents/<int:document_id>', methods=['DELETE'])
@token_required
def delete_lore_document(current_user, document_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    success, error = LoreService.delete_document(document_id)
    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Document deleted successfully'}), 200


@lore_bp.route('/lore/sessions/<int:session_id>/images', methods=['POST'])
@token_required
def create_lore_image(current_user, session_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    if not data.get('url'):
        return jsonify({'message': 'Missing required fields'}), 400

    image, error = LoreService.create_image(session_id, data.get('url'))
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Image created successfully',
        'image': {
            'id': image.id,
            'url': image.url,
            'session_id': image.section_id,
            'order': image.order,
        }
    }), 201


@lore_bp.route('/lore/images/<int:image_id>', methods=['DELETE'])
@token_required
def delete_lore_image(current_user, image_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    success, error = LoreService.delete_image(image_id)
    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Image deleted successfully'}), 200


@lore_bp.route('/lore/documents/<int:document_id>/subdocuments', methods=['POST'])
@token_required
def create_lore_subdocument(current_user, document_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    data = request.get_json(silent=True) or {}
    if not data.get('title') or not data.get('content'):
        return jsonify({'message': 'Missing required fields'}), 400

    item, error = LoreService.create_subdocument(document_id, data.get('title'), data.get('content'))
    if error:
        return jsonify({'message': error}), 404

    return jsonify({
        'message': 'Subdocument created successfully',
        'subdocument': {
            'id': item.id,
            'title': item.title,
            'content': item.content,
            'document_id': item.document_id,
            'order': item.order,
        }
    }), 201


@lore_bp.route('/lore/subdocuments/<int:subdocument_id>', methods=['DELETE'])
@token_required
def delete_lore_subdocument(current_user, subdocument_id):
    if getattr(current_user, 'role', 'USER') != 'ADMIN':
        return jsonify({'message': 'Admin only'}), 403

    success, error = LoreService.delete_subdocument(subdocument_id)
    if not success:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Subdocument deleted successfully'}), 200
