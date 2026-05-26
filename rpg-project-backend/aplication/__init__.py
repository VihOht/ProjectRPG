from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'

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
from aplication.controlers.auth import auth_bp
from aplication.controlers.character import character_bp
from aplication.controlers.lore import lore_bp
app.register_blueprint(auth_bp)
app.register_blueprint(character_bp)
app.register_blueprint(lore_bp)

@app.route('/health')
def health_check():
    return "It's alright!"


