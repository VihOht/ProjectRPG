from aplication import db
from aplication.models.docs import Section, Document, imgs, subDocument


class LoreService:
    @staticmethod
    def _serialize_subdocument(item):
        return {
            'id': item.id,
            'title': item.title,
            'content': item.content,
            'document_id': item.document_id,
            'order': item.order,
        }

    @staticmethod
    def _serialize_document(item):
        subdocuments = subDocument.query.filter_by(document_id=item.id).order_by(subDocument.order.asc(), subDocument.id.asc()).all()

        return {
            'id': item.id,
            'title': item.title,
            'content': item.content,
            'session_id': item.section_id,
            'order': item.order,
            'subdocuments': [LoreService._serialize_subdocument(sub_item) for sub_item in subdocuments],
        }

    @staticmethod
    def _serialize_image(item):
        return {
            'id': item.id,
            'url': item.url,
            'session_id': item.section_id,
            'order': item.order,
        }

    @staticmethod
    def _serialize_session(item):
        documents = Document.query.filter_by(section_id=item.id).order_by(Document.order.asc(), Document.id.asc()).all()
        images = imgs.query.filter_by(section_id=item.id).order_by(imgs.order.asc(), imgs.id.asc()).all()

        return {
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'documents': [LoreService._serialize_document(document) for document in documents],
            'images': [LoreService._serialize_image(image) for image in images],
        }

    @staticmethod
    def get_all_sessions():
        sessions = Section.query.order_by(Section.id.asc()).all()
        return [LoreService._serialize_session(session) for session in sessions]

    @staticmethod
    def get_session_by_id(session_id):
        session = Section.query.get(session_id)
        if not session:
            return None
        return LoreService._serialize_session(session)

    @staticmethod
    def create_session(name, description):
        session = Section(name=name, description=description)
        db.session.add(session)
        db.session.commit()
        return session

    @staticmethod
    def delete_session(session_id):
        session = Section.query.get(session_id)
        if not session:
            return False, 'Lore session not found'

        document_ids = [document.id for document in Document.query.filter_by(section_id=session_id).all()]
        if document_ids:
            subDocument.query.filter(subDocument.document_id.in_(document_ids)).delete(synchronize_session=False)
            Document.query.filter(Document.id.in_(document_ids)).delete(synchronize_session=False)

        imgs.query.filter_by(section_id=session_id).delete(synchronize_session=False)
        db.session.delete(session)
        db.session.commit()
        return True, None

    @staticmethod
    def create_document(session_id, title, content):
        session = Section.query.get(session_id)
        if not session:
            return None, 'Lore session not found'

        next_order = (db.session.query(db.func.max(Document.order)).filter(Document.section_id == session_id).scalar() or 0) + 1
        document = Document(title=title, content=content, section_id=session_id)
        document.order = next_order
        db.session.add(document)
        db.session.commit()
        return document, None

    @staticmethod
    def delete_document(document_id):
        document = Document.query.get(document_id)
        if not document:
            return False, 'Document not found'

        subDocument.query.filter_by(document_id=document_id).delete(synchronize_session=False)
        db.session.delete(document)
        db.session.commit()
        return True, None

    @staticmethod
    def create_image(session_id, url):
        session = Section.query.get(session_id)
        if not session:
            return None, 'Lore session not found'

        next_order = (db.session.query(db.func.max(imgs.order)).filter(imgs.section_id == session_id).scalar() or 0) + 1
        image = imgs(url=url, section_id=session_id)
        image.order = next_order
        db.session.add(image)
        db.session.commit()
        return image, None

    @staticmethod
    def delete_image(image_id):
        image = imgs.query.get(image_id)
        if not image:
            return False, 'Image not found'

        db.session.delete(image)
        db.session.commit()
        return True, None

    @staticmethod
    def create_subdocument(document_id, title, content):
        document = Document.query.get(document_id)
        if not document:
            return None, 'Document not found'

        next_order = (db.session.query(db.func.max(subDocument.order)).filter(subDocument.document_id == document_id).scalar() or 0) + 1
        item = subDocument(title=title, content=content, document_id=document_id, order=next_order)
        db.session.add(item)
        db.session.commit()
        return item, None

    @staticmethod
    def delete_subdocument(subdocument_id):
        item = subDocument.query.get(subdocument_id)
        if not item:
            return False, 'Subdocument not found'

        db.session.delete(item)
        db.session.commit()
        return True, None
