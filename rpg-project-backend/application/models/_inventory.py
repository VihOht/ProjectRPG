from application import db
import enum

class InventoryType(enum.Enum):
    EQUIPED = "Equipped"
    CARRIED = "Carried"
    TRANSPORT = "Transport"

class Inventory(db.Model):
    __tablename__ = "inventory"

    id: int = db.Column(db.Integer, primary_key=True)
    character_id: int = db.Column(db.Integer, db.ForeignKey('character.id'), nullable=False)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    inv_type: InventoryType = db.Column(db.Enum(InventoryType), nullable=False)
    capacity: float = db.Column(db.Integer, nullable=False, default=0)
    items = db.relationship('InventoryItem', backref='inventory', lazy=True, cascade='all, delete-orphan')


    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.inv_type.value,
            'capacity': self.capacity,
        }
    
class InventoryItem(db.Model):
    __tablename__ = "inventory_item"

    id: int = db.Column(db.Integer, primary_key=True)
    inventory_id: int = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    item_id: int = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity: int = db.Column(db.Integer, nullable=False, default=1)

    def toDict(self):
        return {
            'id': self.id,
            'inventory_id': self.inventory_id,
            'item_id': self.item_id,
            'quantity': self.quantity
        }

class Item(db.Model):
    __tablename__ = "item"

    id: int = db.Column(db.Integer, primary_key=True)

    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    stackable: bool = db.Column(db.Boolean, nullable=False, default=False)
    equipable: bool = db.Column(db.Boolean, nullable=False, default=False)
    item_type: str = db.Column(db.String(50), nullable=False)
    max_quantity: int = db.Column(db.Integer, nullable=True, default=1)
    temporary: bool = db.Column(db.Boolean, nullable=False, default=False)
    hidden: bool = db.Column(db.Boolean, nullable=False, default=True)

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'stackable': self.stackable,
            'equipable': self.equipable,
            'max_quantity': self.max_quantity,
            'item_type': self.item_type,
            'hidden': self.hidden,
        }

    __mapper_args__ = {
        "polymorphic_on": item_type,
        "polymorphic_identity": "item",
    }
    
class Weapon(Item):
    id: int = db.Column(db.Integer, db.ForeignKey('item.id'), primary_key=True)

    damage: str = db.Column(db.String(100), nullable=False)
    pericia: str = db.Column(db.String(100), nullable=False)
    critical: str = db.Column(db.String(100), nullable=False)
    range: str = db.Column(db.String(100), nullable=False)
    
    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'stackable': self.stackable,
            'equipable': self.equipable,
            'damage': self.damage,
            'pericia': self.pericia,
            'critical': self.critical,
            'range': self.range,
            'max_quantity': self.max_quantity,
            'item_type': self.item_type,
            'temporary': self.temporary,
            'hidden': self.hidden
        }

    __mapper_args__ = {
        "polymorphic_identity": "weapon",
    }

class Armor(Item):
    id: int = db.Column(db.Integer, db.ForeignKey('item.id'), primary_key=True)

    resistance: str = db.Column(db.String(100), nullable=False)
    reduction: str = db.Column(db.String(100), nullable=False)
    pericia: str = db.Column(db.String(100), nullable=False)
    size: str = db.Column(db.String(100), nullable=False)
    effect: str = db.Column(db.String(100), nullable=True)

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'stackable': self.stackable,
            'equipable': self.equipable,
            'resistance': self.resistance,
            'reduction': self.reduction,
            'pericia': self.pericia,
            'size': self.size,
            'max_quantity': self.max_quantity,
            'item_type': self.item_type,
            'temporary': self.temporary,
            'effect': self.effect,
            'hidden': self.hidden
        }

    __mapper_args__ = {
        "polymorphic_identity": "armor",
    }

class Artefact(Item):
    id: int = db.Column(db.Integer, db.ForeignKey('item.id'), primary_key=True)

    effect: str = db.Column(db.String(100), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "artefact",
    }

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'stackable': self.stackable,
            'equipable': self.equipable,
            'effect': self.effect,
            'max_quantity': self.max_quantity,
            'item_type': self.item_type,
            'temporary': self.temporary,
            'hidden': self.hidden
        }

class Utility(Item):
    id: int = db.Column(db.Integer, db.ForeignKey('item.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "utility",
    }

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'stackable': self.stackable,
            'equipable': self.equipable,
            'max_quantity': self.max_quantity,
            'item_type': self.item_type,
            'temporary': self.temporary,
            'hidden': self.hidden
        }

