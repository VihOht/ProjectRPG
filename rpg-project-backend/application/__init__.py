from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)
if os.getenv('DEBUG', 'false').lower() == 'true':
    app.config['DEBUG'] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///rpg.db'
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URL', 'sqlite:///rpg.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# CORS configuration for frontend requests
CORS(
    app,
    resources={r"/*": {"origins": ["*"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Username"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
from application.controlers.auth import auth_bp
from application.controlers.character import character_bp
from application.controlers.lore import lore_bp
from application.controlers.users import users_bp

app.register_blueprint(auth_bp)
app.register_blueprint(character_bp)
app.register_blueprint(lore_bp)
app.register_blueprint(users_bp)

@app.route('/health')
def health_check():
    return jsonify({'status': 'ok',}), 200
