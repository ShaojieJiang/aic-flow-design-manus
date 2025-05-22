from flask import Blueprint, jsonify, request
from src.models.all_models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)

# Helper function to generate JWT token
def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        os.environ.get('SECRET_KEY', 'default-secret-key'),
        algorithm='HS256'
    )

# Token verification decorator
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(
                token, 
                os.environ.get('SECRET_KEY', 'default-secret-key'),
                algorithms=['HS256']
            )
            current_user = User.query.filter_by(id=data['sub']).first()
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        role='admin' if User.query.count() == 0 else 'user'  # First user is admin
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully',
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    # Update last login time
    user.last_login = datetime.datetime.utcnow()
    db.session.commit()
    
    token = generate_token(user.id)
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['PUT'])
@token_required
def update_user(current_user):
    data = request.get_json()
    
    if 'first_name' in data:
        current_user.first_name = data['first_name']
    
    if 'last_name' in data:
        current_user.last_name = data['last_name']
    
    if 'email' in data:
        if User.query.filter_by(email=data['email']).first() and data['email'] != current_user.email:
            return jsonify({'message': 'Email already exists'}), 409
        current_user.email = data['email']
    
    if 'password' in data:
        current_user.password_hash = generate_password_hash(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': current_user.to_dict()
    }), 200
