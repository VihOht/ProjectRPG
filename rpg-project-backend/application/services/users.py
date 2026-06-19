from werkzeug.security import generate_password_hash
from application.models._user import User
from application.models._characters import Character
from application import db


class UserService:
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)

    @staticmethod
    def get_all_users():
        """Get all users"""
        return User.query.all()
    
    @staticmethod
    def update_user_info(user_id, username=None, email=None):
        """Update user information"""
        user = User.query.get(user_id)
        if not user:
            return None, "Usuário não encontrado"
        
        if username:
            if User.query.filter_by(username=username).first():
                return None, "Username já existe"
            user.username = username
        
        if email:
            if User.query.filter_by(email=email).first():
                return None, "Email já existe"
            user.email = email
        
        db.session.commit()
        return user, None
    
    @staticmethod
    def change_user_password(user_id, new_password):
        """Change user password"""
        user = User.query.get(user_id)
        if not user:
            return None, "Usuário não encontrado"
        
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return user, None
    
    @staticmethod
    def delete_user(user_id, new_owner_id=None):
        """Delete user by ID"""
        user = User.query.get(user_id)
        if not user:
            return None, "Usuário não encontrado"
        
        if new_owner_id:
            new_owner = User.query.get(new_owner_id)
            if not new_owner:
                return None, "Novo proprietário não encontrado"
            # Transfer characters to new owner
            characters = Character.query.filter_by(own=user_id).all()
            for character in characters:
                character.own = new_owner_id
        else:
            new_owner = User.query.filter(User.role == 'ADMIN', User.id != user_id).first()
            if new_owner:
                characters = Character.query.filter_by(own=user_id).all()
                for character in characters:
                    character.own = new_owner.id
            else:
                return None, "Não há administradores disponíveis para assumir os personagens"

        db.session.delete(user)
        db.session.commit()
        return True, None
    
    @staticmethod
    def transfer_all_user_characters(user_id, new_user_id):
        """Transfer all characters from one user to another"""
        user = User.query.get(user_id)
        new_user = User.query.get(new_user_id)
        
        if not user:
            return None, "Usuário de origem não encontrado"
        
        if not new_user:
            return None, "Usuário de destino não encontrado"
        
        characters = Character.query.filter_by(owner_id=user_id).all()
        for character in characters:
            character.owner_id = new_user_id
        
        db.session.commit()
        return True, None
    
    @staticmethod
    def toggle_user_active(user_id):
        """Toggle user active status"""
        user = User.query.get(user_id)
        if not user:
            return None, "Usuário não encontrado"
        
        user.active = not user.active
        db.session.commit()
        return user, None