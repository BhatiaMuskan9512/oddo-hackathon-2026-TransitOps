from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from database import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(data.get('password'))

    user = User(
        name=data.get('name'),
        email=data.get('email'),
        password=hashed_password,
        role=data.get('role', 'Driver')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    if user.status != "Active":
        return jsonify({"error": f"Account is {user.status}"}), 403

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": user.to_dict()
    }), 200