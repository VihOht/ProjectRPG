import os

from werkzeug.security import generate_password_hash, check_password_hash
from application.models._user import User
from application.models._characters import Character
from application import db
import jwt
import datetime
from flask import current_app
from application.utils import send_email


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
            role=(role or 'USER').upper(),
            active=True
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user, None
    
    @staticmethod
    def accept_invitation(token, username, password):
        """Accept invitation and set username and password"""
        # Verify token
        payload, error = AuthService.verify_invitation_token(token)
        if error:
            return None, error
        
        email = payload['email']
        role = payload['role']
        
        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return None, "Usuário não encontrado"
        
        if user.active:
            return None, "Convite já aceito"
        
        if User.query.filter_by(username=username).first():
            return None, "Username já existe"
        

        # Update user with username and password
        user.username = username
        user.password = generate_password_hash(password)
        user.role = role.upper()
        user.active = True
        
        db.session.commit()
        
        return user, None
    
    @staticmethod
    def toggle_user_active_status(user_id):
        """Toggle user active status"""
        user = User.query.get(user_id)
        if not user:
            return None, "Usuário não encontrado"
        
        user.active = not user.active
        db.session.commit()
        
        return user, None
    
    @staticmethod
    def login_user(login_identifier, password):
        """Login user and return token"""
        user = None
        if '@' in login_identifier:
            user = User.query.filter_by(email=login_identifier).first()
        if not user:
            user = User.query.filter_by(username=login_identifier).first()
        
        if not user:
            return None, "Credenciais inválidas"
        
        if not check_password_hash(user.password, password):
            return None, "Credenciais inválidas"
        
        if not user.active and user.role != 'ADMIN':
            return None, "Usuário inativo"
        
        # Generate JWT token
        token = AuthService.generate_token(user.id, user.role)
        
        return {"token": token, "user": user.toDict()}, None
    
    @staticmethod
    def generate_token(user_id, role):
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            "role": role,
            'exp': datetime.datetime.now() + datetime.timedelta(days=1),
            'iat': datetime.datetime.now()
        }
        
        token = jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
        
        return token
    
    @staticmethod
    def generate_invitation_token(email, role):
        """Generate JWT token for invitation"""
        payload = {
            'email': email,
            "role": role,
            'exp': datetime.datetime.now() + datetime.timedelta(days=7),
            'iat': datetime.datetime.now()
        }
        
        token = jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
        
        return token

    @staticmethod
    def invite_user(email, role):
        """Invite a new user by email"""
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return None, "Email já existe"
        
        # Create new user with a temporary password
        temp_password = generate_password_hash(os.urandom(16).hex())
        new_user = User(
            username=email.split('@')[0],  # Default username from email
            email=email,
            password=temp_password,
            role=(role or 'USER').upper(),
            active=False
        )
        
        token = AuthService.generate_invitation_token(email, role)
        invitation_link = f"{os.getenv('FRONTEND_URL')}/auth/register/{token}"

        # Send invitation email
        result = send_email(
            recipient_email=email,
            subject="Convite para o RPG",
            template_name="invitation.html",
            template_data={"invitation_link": invitation_link}
        )
        if result:
            return None, f"Erro ao enviar convite: {result}"
        
        db.session.add(new_user)
        db.session.commit()

        return {"token": token, "user": new_user.toDict()}, None
    
    @staticmethod
    def verify_token(token):
        """Verify JWT token and return user_id"""
        try:
            payload = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256']
            )
            return {"id": payload['user_id'], "role": payload['role']}, None
        except jwt.ExpiredSignatureError:
            return None, "Token Expirado"
        except jwt.InvalidTokenError:
            return None, "Token Inválido"
        
    @staticmethod
    def verify_invitation_token(token):
        """Verify JWT invitation token and return email and role"""
        try:
            payload = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256']
            )
            return {"email": payload['email'], "role": payload['role']}, None
        except jwt.ExpiredSignatureError:
            return None, "Token de convite expirado"
        except jwt.InvalidTokenError:
            return None, "Token de convite inválido"
        
