from aplication import db
from sqlalchemy import text, inspect


class Section (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def __init__(self, name, description):
        self.name = name
        self.description = description

class Document (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __init__(self, title, content, section_id):
        self.title = title
        self.content = content
        self.section_id = section_id

class imgs (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    order = db.Column(db.Integer, nullable=False)


    def __init__(self, url, section_id):
        self.url = url
        self.section_id = section_id

class subDocument (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def __init__(self, title, content, document_id, order):
        self.title = title
        self.content = content
        self.document_id = document_id
        self.order = order