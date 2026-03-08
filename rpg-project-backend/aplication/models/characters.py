from aplication import db
from aplication.models.classes import Class, Subclass, Ability
from aplication.models.atributes import Attribute, CharacterAttributes
from aplication.models.user import User

class Race(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def __init__(self, name, description):
        self.name = name
        self.description = description

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    own = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Basic character information
    name = db.Column(db.String(80), nullable=False)
    charClass = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False, default=0)
    subclass = db.Column(db.Integer, db.ForeignKey('subclass.id'), nullable=True)
    second_class = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)
    race = db.Column(db.Integer, db.ForeignKey('race.id'), nullable=False)
    gender = db.Column(db.String(20), nullable=False, default='Unknown')
    age = db.Column(db.Integer, nullable=False, default=0)
    level = db.Column(db.Integer, nullable=False, default=1)

    # Stats
    life = db.Column(db.Integer, nullable=False, default=10)
    defense = db.Column(db.Integer, nullable=False, default=10)
    sanity = db.Column(db.Integer, nullable=False, default=10)
    ocultism = db.Column(db.Integer, nullable=False, default=10)
    mana = db.Column(db.Integer, nullable=False, default=10)

    # Atributes
    attributes = db.relationship('CharacterAttributes', backref='character', lazy=True)


    # Char Abilities
    abilities = db.relationship('Ability', backref='character', lazy=True)

    

