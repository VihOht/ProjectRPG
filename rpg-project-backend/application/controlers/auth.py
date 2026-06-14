from flask import Blueprint, request, jsonify
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
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        # Verify token
        token_data, error = AuthService.verify_token(token)
        
        if error:
            return jsonify({'message': error}), 401
        
        # Get user
        current_user = AuthService.get_user_by_id(token_data['id'])
        
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Register user
    user, error = AuthService.register_user(username, email, password, role='USER')
    
    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    # Login user
    result, error = AuthService.login_user(username, password)
    
    if error:
        return jsonify({'message': error}), 401
    
    return jsonify({
        'message': 'Login successful',
        'token': result['token'],
        'user': result['user']
    }), 200


@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify(current_user):
    """Verify token and get current user"""
    return jsonify({
        'message': 'Token is valid',
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
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'role': current_user.role
        }
    }), 200


@auth_bp.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    """Get all users (admin only)"""
    if (getattr(current_user, 'role', 'USER') or 'USER').upper() != 'ADMIN':
        return jsonify({'message': 'Unauthorized'}), 403

    users = AuthService.get_all_users()

    return jsonify({
        'users': [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            }
            for user in users
        ]
    }), 200



@auth_bp.route('/users/<int:user_id>', methods=['GET'])
@token_required
def get_user_by_id(user_id):
    """Helper function to get user by ID"""
    return AuthService.get_user_by_id(user_id)
