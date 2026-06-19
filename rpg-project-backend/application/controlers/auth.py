from flask import Blueprint, request, jsonify
from application.services.users import UserService
from application.services.auth import AuthService
from functools import wraps

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Formado do token inválido'}), 401
        
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        # Verify token
        token_data, error = AuthService.verify_token(token)
        
        if error:
            return jsonify({'message': error}), 401
        
        # Get user
        current_user = UserService.get_user_by_id(token_data['id'])
        
        if not current_user:
            return jsonify({'message': 'Usuário não encontrado'}), 401
        
        if current_user.role != token_data['role']:
            return jsonify({'message': 'Função do usuário não corresponde ao token'}), 401
        
        if not current_user.active and current_user.role != 'ADMIN':
            return jsonify({'message': 'Usuário inativo'}), 403


        return f(current_user, *args, **kwargs)
    
    return decorated



@auth_bp.route('/invite', methods=['POST'])
@token_required
def invite_user(current_user):
    """Invite a new user (admin only)"""
    if current_user.role != 'ADMIN':
        return jsonify({'message': 'Acesso negado'}), 403
    
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('role'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    email = data.get('email')
    role = data.get('role')
    
    # Invite user
    user, error = AuthService.invite_user(email=email, role=role)
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Convite enviado com sucesso',
        'user': user['user'],
        'token': user['token']
    }), 201

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    token = data.get('token')
    username = data.get('username')
    password = data.get('password')
    
    # Register user
    user, error = AuthService.accept_invitation(token, username, password)
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Usuário registrado com sucesso',
        'user': user.toDict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('login_identifier') or not data.get('password'):
        return jsonify({'message': 'Campos obrigatórios ausentes'}), 400
    
    login_identifier = data.get('login_identifier')
    password = data.get('password')
    
    # Login user
    result, error = AuthService.login_user(login_identifier=login_identifier, password=password)
    
    if error:
        return jsonify({'message': error}), 401
    
    return jsonify({
        'message': 'Login bem-sucedido',
        'token': result['token'],
        'user': result['user']
    }), 200


@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify(current_user):
    """Verify token and get current user"""
    return jsonify({
        'message': 'Token válido',
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'role': current_user.role
        }
    }), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user info"""
    return jsonify({
        'user': current_user.toDict()
    }), 200


@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    """Change current user's password"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('password'):
        return jsonify({'message': 'Campo de senha ausente'}), 400
    
    new_password = data.get('password')
    
    # Change password
    user, error = UserService.change_user_password(user_id=current_user.id, new_password=new_password)
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'Senha alterada com sucesso',
    }), 200