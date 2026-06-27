from application import db

class Subclass (db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    class_id: int = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    abilities = db.relationship(
        'ClassAbility',
        backref='subclass_ref',
        lazy=True,
        foreign_keys='ClassAbility.subclass_id'
    )

    def __init__(self, name, description, class_id):
        self.name = name
        self.description = description
        self.class_id = class_id

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'class_id': self.class_id,
            'abilities': [ability.toDict() for ability in self.abilities]
        }

class Class (db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    subclasses = db.relationship('Subclass', backref='class_ref', lazy=True)
    abilities = db.relationship(
        'ClassAbility',
        backref='class_ref',
        lazy=True,
        foreign_keys='ClassAbility.class_id'
    )
    classPowers = db.relationship('ClassPower', backref='class_ref', lazy=True)
    base_life: int = db.Column(db.Integer, nullable=False, default=10)
    base_defense: int = db.Column(db.Integer, nullable=False, default=10)
    base_sanity: int = db.Column(db.Integer, nullable=False, default=10)
    base_mana: int = db.Column(db.Integer, nullable=False, default=10)
    base_ocultism: int = db.Column(db.Integer, nullable=False, default=10)
    base_power: int = db.Column(db.Integer, nullable=False, default=10)
    has_mana: bool = db.Column(db.Boolean, default=False)
    has_ocultism: bool = db.Column(db.Boolean, default=False)


    def __init__(self, name, description, base_life=10, base_defense=10, base_sanity=10, base_mana=10, base_ocultism=10, base_power=10, has_mana=False, has_ocultism=False):
        self.name = name
        self.description = description
        self.base_life = base_life
        self.base_defense = base_defense
        self.base_sanity = base_sanity
        self.base_mana = base_mana
        self.base_ocultism = base_ocultism
        self.base_power = base_power
        self.has_mana = has_mana
        self.has_ocultism = has_ocultism

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'base_life': self.base_life,
            'base_defense': self.base_defense,
            'base_sanity': self.base_sanity,
            'base_mana': self.base_mana,
            'base_ocultism': self.base_ocultism,
            'base_power': self.base_power,
            'has_mana': self.has_mana,
            'has_ocultism': self.has_ocultism,
            "abilities": [ability.toDict() for ability in self.abilities],
            "classPowers": [power.toDict() for power in self.classPowers],
            "subclasses": [subclass.toDict() for subclass in self.subclasses]
        }

class ClassAbility (db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    class_id: int = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)
    subclass_id: int = db.Column(db.Integer, db.ForeignKey('subclass.id'), nullable=True)
    hidden: bool = db.Column(db.Boolean, default=True)

    def __init__(self, name, description, class_id=None, subclass_id=None, hidden=True):
        self.name = name
        self.description = description
        self.class_id = class_id
        self.subclass_id = subclass_id
        self.hidden = hidden

    characters = db.relationship(
        'Character',
        secondary='character_abilities',
        back_populates='abilities',
        lazy=True
    )
        

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'class_id': self.class_id,
            'subclass_id': self.subclass_id,
            'hidden': self.hidden
        }

class ClassPower(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    class_id: int = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    level_to_unlock: int = db.Column(db.Integer, nullable=False, default=1)
    hidden: bool = db.Column(db.Boolean, default=True)


    def __init__(self, name, description, class_id, level_to_unlock=1):
        self.name = name
        self.description = description
        self.class_id = class_id
        self.level_to_unlock = level_to_unlock

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'class_id': self.class_id,
            'level_to_unlock': self.level_to_unlock,
            'hidden': self.hidden
        }
    

class CharacterSpecialAbility(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    character_id: int = db.Column(db.Integer, db.ForeignKey('character.id'), nullable=False)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)

    def __init__(self, character_id, name, description):
        self.character_id = character_id
        self.name = name
        self.description = description

    def toDict(self):
        return {
            'id': self.id,
            'character_id': self.character_id,
            'name': self.name,
            'description': self.description
        }
    

class Ritual(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    ocultism_cost: int = db.Column(db.Integer, nullable=False, default=1)
    power_level: int = db.Column(db.Integer, nullable=False, default=1)
    subclass_id: int = db.Column(db.Integer, db.ForeignKey('subclass.id'), nullable=True)
    hidden: bool = db.Column(db.Boolean, default=True)

    characters = db.relationship(
        'Character',
        secondary='character_rituals',
        back_populates='rituals',
        lazy=True
    )

    def __init__(self, name, description, ocultism_cost=1, power_level=1, subclass_id=None):
        self.name = name
        self.description = description
        self.ocultism_cost = ocultism_cost
        self.power_level = power_level
        self.subclass_id = subclass_id

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'ocultism_cost': self.ocultism_cost,
            'power_level': self.power_level,
            'subclass_id': self.subclass_id,
            'hidden': self.hidden
        }
    
class Wizardcraft(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    mana_cost: int = db.Column(db.Integer, nullable=False, default=1)
    hidden: bool = db.Column(db.Boolean, default=True)

    characters = db.relationship(
        'Character',
        secondary='character_wizardcrafts',
        back_populates='wizardcrafts',
        lazy=True
    )

    def __init__(self, name, description, mana_cost=1):
        self.name = name
        self.description = description
        self.mana_cost = mana_cost

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'mana_cost': self.mana_cost,
            'hidden': self.hidden
        }

    