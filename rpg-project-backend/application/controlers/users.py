from flask import Blueprint, request, jsonify
from application.services.users import UserService
from application.services.auth import AuthService
from application.controlers.auth import token_required

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('', methods=['GET'])
@token_required
def get_all_users(current_user):
    """Get all users"""
    if current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403
    users = UserService.get_all_users()
    return jsonify({
        "users": [
            user.toDict()
            for user in users
        ]
    }), 200

@users_bp.route('/<int:user_id>', methods=['GET'])
@token_required
def get_user_by_id(current_user, user_id):
    """Get user by ID"""
    if current_user.id != user_id and current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403

    user = UserService.get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    
    return jsonify({
        "user": user.toDict()
    }), 200

@users_bp.route('', methods=['POST'])
@token_required
def create_user(current_user):
    """Create a new user"""
    if current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'USER')

    if not username or not email or not password:
        return jsonify({'message': 'Username, email e senha são obrigatórios'}), 400

    user, error = AuthService.register_user(username, email, password, role)
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Usuário criado com sucesso',
        'user': user.toDict()
    }), 201

@users_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user_info(current_user, user_id):
    """Update user information"""
    if current_user.id != user_id and current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    user, error = UserService.update_user_info(user_id, username, email)
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Informações do usuário atualizadas com sucesso',
        'user': user.toDict()
    }), 200

@users_bp.route('/<int:user_id>/password', methods=['POST'])
@token_required
def change_user_password(current_user, user_id):
    """Change user password"""
    if current_user.id != user_id and current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({'message': 'Nova senha é obrigatória'}), 400
    
    user, error = UserService.change_user_password(user_id, new_password)
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Senha atualizada com sucesso',
    }), 200



@users_bp.route('/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, user_id):
    """Delete user by ID"""
    if current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403

    user, error = UserService.delete_user(user_id, current_user.id)
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({}), 204  


@users_bp.route('/<int:user_id>/toggle-active', methods=['POST'])
@token_required
def toggle_user_active(current_user, user_id):
    """Toggle user active status"""
    if current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403

    user, error = UserService.toggle_user_active(user_id)
    if error:
        return jsonify({'message': error}), 400

    return jsonify({
        'message': 'Status do usuário atualizado com sucesso',
    }), 200