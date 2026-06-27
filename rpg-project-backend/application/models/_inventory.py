from application import db
import enum

class InventoryType(enum.Enum):
    EQUIPED = "Equipped"
    TRANSPORT = "Carrying"

class Inventory(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    type: InventoryType = db.Column(db.Enum(InventoryType), nullable=False)
    capacity: float = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, name, description, type, capacity=0):
        self.name = name
        self.description = description
        self.type = type
        self.capacity = capacity

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type.value,
            'weight': self.weight,
            'value': self.value
        }
    
class Weapon(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    Inventory_id: int = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)

    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    damage: str = db.Column(db.String(100), nullable=False)
    pericia: str = db.Column(db.String(100), nullable=False)
    critical: str = db.Column(db.String(100), nullable=False)
    quantity: int = db.Column(db.Integer, nullable=False, default=1)
    range: str = db.Column(db.String(100), nullable=False)
    weight: float = db.Column(db.Float, nullable=False, default=0)

    def __init__(self, name, description, damage, pericia, critical, range, quantity=1, weight=0):
        self.name = name
        self.description = description
        self.damage = damage
        self.pericia = pericia
        self.critical = critical
        self.quantity = quantity
        self.range = range
        self.weight = weight

class Utility(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    Inventory_id: int = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)

    name: str = db.Column(db.String(80), nullable=False)
    description: str = db.Column(db.Text, nullable=False)
    quantity: int = db.Column(db.Integer, nullable=False, default=1)
    weight: float = db.Column(db.Float, nullable=False, default=0)

    def __init__(self, name, description, quantity=1, weight=0):
        self.name = name
        self.description = description
        self.quantity = quantity
        self.weight = weight


