from werkzeug.security import generate_password_hash, check_password_hash
from aplication.models.user import User
from aplication import db
import jwt
import datetime
from flask import current_app


class AuthService:
    
    @staticmethod
    def register_user(username, email, password, role='USER'):
        """Register a new user"""
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return None, "Username already exists"
        
        if User.query.filter_by(email=email).first():
            return None, "Email already exists"
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            role=(role or 'USER').upper()
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user, None
    
    @staticmethod
    def login_user(username, password):
        """Login user and return token"""
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return None, "Invalid username or password"
        
        if not check_password_hash(user.password, password):
            return None, "Invalid username or password"
        
        # Generate JWT token
        token = AuthService.generate_token(user.id)
        
        return {"token": token, "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }}, None
    
    @staticmethod
    def generate_token(user_id):
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.now() + datetime.timedelta(days=1),
            'iat': datetime.datetime.now()
        }
        
        token = jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY', 'default-secret-key'),
            algorithm='HS256'
        )
        
        return token
    
    @staticmethod
    def verify_token(token):
        """Verify JWT token and return user_id"""
        try:
            payload = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY', 'default-secret-key'),
                algorithms=['HS256']
            )
            return payload['user_id'], None
        except jwt.ExpiredSignatureError:
            return None, "Token has expired"
        except jwt.InvalidTokenError:
            return None, "Invalid token"
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)
