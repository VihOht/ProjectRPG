from application import db

class Attribute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)

    attribute_values = db.relationship(
        'AttributeValue',
        back_populates='attribute',
        lazy=True,
        cascade='all, delete-orphan'
        )
    pericias = db.relationship(
        'Pericia',
        backref='attribute_ref',
        lazy=True,
        cascade='all, delete-orphan'
    )

    def __init__(self, name, description):
        self.name = name
        self.description = description

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class AttributeValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)
    pericias = db.relationship(
        'PericiaValue',
        backref='character_attribute_value',
        lazy=True,
        cascade='all, delete-orphan'
    )
    attribute = db.relationship('Attribute', back_populates='attribute_values', lazy=True)
    character_id = db.Column(db.Integer, db.ForeignKey('character.id'), nullable=False)

    def __init__(self, attribute_id, character_id):
        self.attribute_id = attribute_id
        self.character_id = character_id

    def toDict(self):
        return {
            'id': self.id,
            'attribute_id': self.attribute_id,
            'character_id': self.character_id,
            'pericias': [pericia.toDict() for pericia in self.pericias],
            "value": sum([pericia.value for pericia in self.pericias])
        }

class AttributePower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)
    level_to_unlock = db.Column(db.Integer, nullable=False)
    hidden = db.Column(db.Boolean, default=True)

    def __init__(self, name, description, attribute_id, level_to_unlock):
        self.name = name
        self.description = description
        self.attribute_id = attribute_id
        self.level_to_unlock = level_to_unlock

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'attribute_id': self.attribute_id,
            'level_to_unlock': self.level_to_unlock,
            'hidden': self.hidden
        }