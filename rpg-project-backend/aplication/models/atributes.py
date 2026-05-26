from aplication import db

class Attribute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def __init__(self, name, description):
        self.name = name
        self.description = description


class Pericia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)

    def __init__(self, name, description, attribute_id):
        self.name = name
        self.description = description
        self.attribute_id = attribute_id


class CharacterAttributeValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    character_attributes_pericias_id = db.Column(
        db.Integer,
        db.ForeignKey('character_attributes_pericias.id'),
        nullable=False
    )
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)

    value = db.Column(db.Integer, nullable=False, default=0)
    baseValue = db.Column(db.Integer, nullable=False, default=5)
    bonusValue = db.Column(db.Integer, nullable=False, default=0)

    attribute = db.relationship('Attribute', backref='character_values', lazy=True)

    def __init__(self, character_attributes_pericias_id, attribute_id, baseValue=5, bonusValue=0):
        self.character_attributes_pericias_id = character_attributes_pericias_id
        self.attribute_id = attribute_id
        self.baseValue = baseValue
        self.bonusValue = bonusValue
        self.value = int(baseValue) + int(bonusValue)

    @property
    def total(self):
        return int(self.baseValue) + int(self.bonusValue)

    @property
    def dt(self):
        return max(0, 20 - self.total)

    def sync_legacy_value(self):
        self.value = int(self.baseValue) + int(self.bonusValue)


class CharacterPericiaValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    character_attributes_pericias_id = db.Column(
        db.Integer,
        db.ForeignKey('character_attributes_pericias.id'),
        nullable=False
    )
    pericia_id = db.Column(db.Integer, db.ForeignKey('pericia.id'), nullable=False)

    value = db.Column(db.Integer, nullable=False, default=0)
    baseValue = db.Column(db.Integer, nullable=False, default=0)
    bonusValue = db.Column(db.Integer, nullable=False, default=0)

    pericia = db.relationship('Pericia', backref='character_pericia_values', lazy=True)

    def __init__(self, character_attributes_pericias_id, pericia_id, baseValue=0, bonusValue=0):
        self.character_attributes_pericias_id = character_attributes_pericias_id
        self.pericia_id = pericia_id
        self.baseValue = baseValue
        self.bonusValue = bonusValue
        self.value = int(baseValue) + int(bonusValue)

    @property
    def total(self):
        return int(self.baseValue) + int(self.bonusValue)


class CharacterAttributesPericias(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    character_id = db.Column(db.Integer, db.ForeignKey('character.id'), nullable=False)
    attributes = db.relationship(
        'CharacterAttributeValue',
        backref='character_attributes',
        lazy=True,
        cascade='all, delete-orphan'
    )
    pericias = db.relationship(
    'CharacterPericiaValue',
    backref='character_pericias',
    lazy=True,
    cascade='all, delete-orphan'
    )

    def __init__(self, character_id):
        self.character_id = character_id
        
