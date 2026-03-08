from aplication import db

class Subclass (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    abilities = db.relationship(
        'Ability',
        backref='subclass_ref',
        lazy=True,
        foreign_keys='Ability.subclass_id'
    )

    def __init__(self, name, description, class_id):
        self.name = name
        self.description = description
        self.class_id = class_id

class Class (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    subclasses = db.relationship('Subclass', backref='class_ref', lazy=True)
    abilities = db.relationship(
        'Ability',
        backref='class_ref',
        lazy=True,
        foreign_keys='Ability.class_id'
    )

    def __init__(self, name, description):
        self.name = name
        self.description = description

class Ability (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)
    subclass_id = db.Column(db.Integer, db.ForeignKey('subclass.id'), nullable=True)
    character_id = db.Column(db.Integer, db.ForeignKey('character.id'), nullable=True)

    def __init__(self, name, description, class_id=None, subclass_id=None, character_id=None):
        self.name = name
        self.description = description
        self.class_id = class_id
        self.subclass_id = subclass_id
        self.character_id = character_id