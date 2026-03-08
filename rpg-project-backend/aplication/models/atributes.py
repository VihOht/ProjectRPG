from aplication import db

class Attribute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def __init__(self, name, description):
        self.name = name
        self.description = description


class CharacterAttributeValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    character_attributes_id = db.Column(
        db.Integer,
        db.ForeignKey('character_attributes.id'),
        nullable=False
    )
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)
    value = db.Column(db.Integer, nullable=False, default=0)

    attribute = db.relationship('Attribute', backref='character_values', lazy=True)

    def __init__(self, character_attributes_id, attribute_id, value=0):
        self.character_attributes_id = character_attributes_id
        self.attribute_id = attribute_id
        self.value = value

class CharacterAttributes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('character.id'), nullable=False)
    values = db.relationship(
        'CharacterAttributeValue',
        backref='character_attributes',
        lazy=True,
        cascade='all, delete-orphan'
    )

    def __init__(self, character_id):
        self.character_id = character_id
        
