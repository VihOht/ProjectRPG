from application import db



class Race(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    hidden: bool = db.Column(db.Boolean, default=True)

    def __init__(self, name, description, hidden=True):
        self.name = name
        self.description = description
        self.hidden = hidden

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'hidden': self.hidden
        }
    
class ConversionRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    attribute_id: int = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)
    stat: str = db.Column(db.String(80), nullable=False)
    rate: int = db.Column(db.Integer, nullable=False)

    def __init__(self, attribute_id, stat, rate):
        self.attribute_id = attribute_id
        self.stat = stat
        self.rate = rate    

    def toDict(self):
        return {
            'id': self.id,
            'attribute_id': self.attribute_id,
            'stat': self.stat,
            'rate': self.rate
        }
    
class LevelUpRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    level: int = db.Column(db.Integer, nullable=False)
    experience_required: int = db.Column(db.Integer, nullable=False)

    def __init__(self, level, experience_required):
        self.level = level
        self.experience_required = experience_required

    def toDict(self):
        return {
            'id': self.id,
            'level': self.level,
            'experience_required': self.experience_required
        }
    

character_abilities = db.Table(
    'character_abilities',

    db.Column(
        'character_id',
        db.Integer,
        db.ForeignKey('character.id'),
        primary_key=True
    ),

    db.Column(
        'ability_id',
        db.Integer,
        db.ForeignKey('class_ability.id'),
        primary_key=True
    )
)

class Character(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    own: int = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Basic character information
    name: str = db.Column(db.String(80), nullable=False, default='Unnamed Hero')
    charClass: int = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True, default=0)
    subclass: int = db.Column(db.Integer, db.ForeignKey('subclass.id'), nullable=True)
    second_class: int = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)
    race: int = db.Column(db.Integer, db.ForeignKey('race.id'), nullable=True)
    gender: str = db.Column(db.String(20), nullable=False, default='Unknown')
    age: int = db.Column(db.Integer, nullable=False, default=0)
    level: int = db.Column(db.Integer, nullable=False, default=1)
    experience: int = db.Column(db.Integer, nullable=False, default=0)

    # Stats (current values)
    att_life: int = db.Column(db.Integer, nullable=False, default=0)
    att_defense: int = db.Column(db.Integer, nullable=False, default=0)
    att_sanity: int = db.Column(db.Integer, nullable=False, default=0)
    att_ocultism: int = db.Column(db.Integer, nullable=False, default=0)
    att_mana: int = db.Column(db.Integer, nullable=False, default=0)

    offset_life: int = db.Column(db.Integer, nullable=False, default=0)
    offset_defense: int = db.Column(db.Integer, nullable=False, default=0)
    offset_sanity: int = db.Column(db.Integer, nullable=False, default=0)
    offset_ocultism: int = db.Column(db.Integer, nullable=False, default=0)
    offset_mana: int = db.Column(db.Integer, nullable=False, default=0)

    life: int = db.Column(db.Integer, nullable=False, default=10)
    defense: int = db.Column(db.Integer, nullable=False, default=10)
    sanity: int = db.Column(db.Integer, nullable=False, default=10)
    ocultism: int = db.Column(db.Integer, nullable=False, default=10)
    mana: int = db.Column(db.Integer, nullable=False, default=10)


    # Atributes
    attributes = db.relationship('AttributeValue', backref='character', lazy=True)

    # Char Abilities
    abilities = abilities = db.relationship(
        'ClassAbility',
        secondary=character_abilities,
        back_populates='characters',
        lazy=True
    )

    active: bool = db.Column(db.Boolean, default=True)
    is_player: bool = db.Column(db.Boolean, default=True)

    descricao_fisica: str = db.Column(db.Text, nullable=True)
    descricao_psicologica: str = db.Column(db.Text, nullable=True)
    historia: str = db.Column(db.Text, nullable=True)

    def __init__(self, own):
        self.own = own

    def toDict(self):
        return {
            'id': self.id,
            'own': self.own,
            'name': self.name,
            'charClass': self.charClass,
            'subclass': self.subclass,
            'second_class': self.second_class,
            'race': self.race,
            'gender': self.gender,
            'age': self.age,
            'level': self.level,
            'att_life': self.att_life,
            'att_defense': self.att_defense,
            'att_sanity': self.att_sanity,
            'att_ocultism': self.att_ocultism,
            'att_mana': self.att_mana,
            'offset_life': self.offset_life,
            'offset_defense': self.offset_defense,
            'offset_sanity': self.offset_sanity,
            'offset_ocultism': self.offset_ocultism,
            'offset_mana': self.offset_mana,
            'life': self.life,
            'defense': self.defense,
            'sanity': self.sanity,
            'ocultism': self.ocultism,
            'mana': self.mana,
            'attributes': [attribute.toDict() for attribute in self.attributes],
            'abilities': [ability.toDict() for ability in self.abilities],
            'active': self.active,
            'is_player': self.is_player,
            'descricao_fisica': self.descricao_fisica,
            'descricao_psicologica': self.descricao_psicologica,
            'historia': self.historia
        }
    