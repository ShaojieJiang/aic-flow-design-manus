from src.models import db
from datetime import datetime
import json
import base64
import os
import hashlib

# Simple encryption class that doesn't rely on cryptography package
class SimpleEncryption:
    def __init__(self, key):
        # Use SHA-256 to derive a consistent key from the input key
        self.key = hashlib.sha256(key).digest()
    
    def encrypt(self, data):
        # Simple XOR encryption with key cycling
        if isinstance(data, str):
            data = data.encode()
        
        encrypted = bytearray()
        for i, char in enumerate(data):
            key_char = self.key[i % len(self.key)]
            encrypted.append(char ^ key_char)
        
        # Return base64 encoded string for storage
        return base64.b64encode(encrypted).decode()
    
    def decrypt(self, encrypted_data):
        # Decode base64 and apply XOR decryption
        if isinstance(encrypted_data, str):
            encrypted_data = encrypted_data.encode()
        
        data = base64.b64decode(encrypted_data)
        decrypted = bytearray()
        
        for i, char in enumerate(data):
            key_char = self.key[i % len(self.key)]
            decrypted.append(char ^ key_char)
        
        return bytes(decrypted)

# Create a key for encryption or load existing one
def get_encryption_key():
    key_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'encryption.key')
    if os.path.exists(key_file):
        with open(key_file, 'rb') as f:
            return f.read()
    else:
        # Generate a random key (32 bytes)
        key = os.urandom(32)
        with open(key_file, 'wb') as f:
            f.write(key)
        return key

# Initialize encryption
encryption_key = get_encryption_key()
cipher_suite = SimpleEncryption(encryption_key)

class Credential(db.Model):
    __tablename__ = 'credentials'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    data = db.Column(db.Text)  # Encrypted JSON
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Credential {self.name}>'
    
    def get_data(self):
        if self.data:
            decrypted_data = cipher_suite.decrypt(self.data)
            return json.loads(decrypted_data.decode())
        return {}
    
    def set_data(self, data_dict):
        json_data = json.dumps(data_dict)
        encrypted_data = cipher_suite.encrypt(json_data.encode())
        self.data = encrypted_data
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Variable(db.Model):
    __tablename__ = 'variables'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    value = db.Column(db.Text)
    type = db.Column(db.Enum('string', 'number', 'boolean', 'json'))
    scope = db.Column(db.Enum('global', 'workflow'))
    workflow_id = db.Column(db.Integer, db.ForeignKey('workflows.id'), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Variable {self.name}>'
    
    def get_value(self):
        if self.type == 'json' and self.value:
            return json.loads(self.value)
        elif self.type == 'number' and self.value:
            return float(self.value)
        elif self.type == 'boolean' and self.value:
            return self.value.lower() == 'true'
        return self.value
    
    def set_value(self, value):
        if self.type == 'json':
            self.value = json.dumps(value)
        else:
            self.value = str(value)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'value': self.get_value(),
            'type': self.type,
            'scope': self.scope,
            'workflow_id': self.workflow_id,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
