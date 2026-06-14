from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# CORS configuration for frontend requests
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Username"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Register blueprints
from application.controlers.auth import auth_bp
from application.controlers.character import character_bp
from application.controlers.lore import lore_bp
app.register_blueprint(auth_bp)
app.register_blueprint(character_bp)
app.register_blueprint(lore_bp)

@app.route('/health')
def health_check():
    return jsonify({'status': 'ok'}), 200


@app.route("/tables/<table_name>", methods=["DELETE"])
def delete_table(table_name):
    """Endpoint to delete all records from a specified table (for testing purposes)"""
    if table_name not in db.metadata.tables:
        return jsonify({'message': 'Table not found'}), 404
    if table_name not in db.metadata.tables:
        return jsonify({'message': 'Table not found'}), 404
    table = db.metadata.tables[table_name]
    table.drop(db.engine)

    return jsonify({'message': f'Table {table_name} deleted successfully'}), 200

@app.route("/tables", methods=["GET"])
def get_tables():
    """Endpoint to get all table names (for testing purposes)"""
    return jsonify({'tables': list(db.metadata.tables.keys())}), 200