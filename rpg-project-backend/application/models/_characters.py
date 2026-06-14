import enum

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
    
class ConversionRuleType(enum.Enum):
    PERICIA = 'pericia'
    ATTRIBUTE = 'attribute'
   

class ConversionRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    attribute_id: int = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=True)
    pericia_id: int = db.Column(db.Integer, db.ForeignKey('pericia.id'), nullable=True)
    conversion_type: str = db.Column(db.Text, nullable=False)
    stat: str = db.Column(db.String(80), nullable=False)
    rate: float = db.Column(db.Float, nullable=False, default=0)


    def __init__(self, attribute_id, stat, rate, conversion_type, pericia_id):
        self.attribute_id = attribute_id
        self.stat = stat
        self.rate = rate
        self.conversion_type = conversion_type
        self.pericia_id = pericia_id

    def toDict(self):
        return {
            'id': self.id,
            'attribute_id': self.attribute_id,
            'pericia_id': self.pericia_id,
            'conversion_type': self.conversion_type,
            'stat': self.stat,
            'rate': self.rate
        }
    
 
class LevelUpRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    level: int = db.Column(db.Integer, nullable=False)
    experience_required: int = db.Column(db.Integer, nullable=False)
    description: str = db.Column(db.Text, nullable=True)

    def __init__(self, level, experience_required, description=None):
        self.level = level
        self.experience_required = experience_required
        self.description = description

    def toDict(self):
        return {
            'id': self.id,
            'level': self.level,
            'experience_required': self.experience_required,
            'description': self.description
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
    # Ids information
    id: int = db.Column(db.Integer, primary_key=True)
    own: int = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Basic character information
    name: str = db.Column(db.String(80), nullable=False, default='Unnamed Hero')
    charClass: int = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)
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

    # Denotes if the character is active or archived (soft delete)
    active: bool = db.Column(db.Boolean, default=True)
    is_player: bool = db.Column(db.Boolean, default=True)

    # Descriptions    
    physical_description: str = db.Column(db.Text, nullable=True)
    psychological_description: str = db.Column(db.Text, nullable=True)
    backstory: str = db.Column(db.Text, nullable=True)

    def __init__(self, own, is_player=True):
        self.own = own
        self.is_player = is_player

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
            'experience': self.experience,
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
            'sanity': self.sanity,
            'ocultism': self.ocultism,
            'mana': self.mana,
            'attributes': [attribute.toDict() for attribute in self.attributes],
            'abilities': [ability.toDict() for ability in self.abilities],
            'active': self.active,
            'is_player': self.is_player,
            'physical_description': self.physical_description,
            'psychological_description': self.psychological_description,
            'backstory': self.backstory

        }
    