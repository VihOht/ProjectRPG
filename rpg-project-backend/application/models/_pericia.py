from application import db

class Pericia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)
    pericia_values = db.relationship(
        'PericiaValue',
        back_populates='pericia',
        lazy=True,
        cascade='all, delete-orphan'
    )

    def __init__(self, name, description, attribute_id):
        self.name = name
        self.description = description
        self.attribute_id = attribute_id

    def toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'attribute_id': self.attribute_id
        }



class PericiaValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pericia_id = db.Column(db.Integer, db.ForeignKey('pericia.id'), nullable=False)
    value = db.Column(db.Integer, nullable=False, default=0)
    pericia = db.relationship('Pericia', back_populates='pericia_values', lazy=True)
    attribute_value_id = db.Column(db.Integer, db.ForeignKey('attribute_value.id'), nullable=True)

    def __init__(self, pericia_id, attribute_value_id, value=0):
        self.pericia_id = pericia_id
        self.attribute_value_id = attribute_value_id
        self.value = value

    def toDict(self):
        return {
            'id': self.id,
            'pericia_id': self.pericia_id,
            'value': self.value,
            'attribute_value_id': self.attribute_value_id
        }


