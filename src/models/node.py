from src.models import db
from datetime import datetime

class Node(db.Model):
    __tablename__ = 'nodes'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(255))
    icon = db.Column(db.String(255))
    is_core = db.Column(db.Boolean, default=False)
    is_ai = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    schema = db.Column(db.Text)  # JSON schema for node configuration
    
    def __repr__(self):
        return f'<Node {self.name}>'
    
    def get_schema(self):
        if self.schema:
            return json.loads(self.schema)
        return {}
    
    def set_schema(self, schema_dict):
        self.schema = json.dumps(schema_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'category': self.category,
            'icon': self.icon,
            'is_core': self.is_core,
            'is_ai': self.is_ai,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'schema': self.get_schema()
        }


class NodeCategory(db.Model):
    __tablename__ = 'node_categories'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    icon = db.Column(db.String(255))
    color = db.Column(db.String(7))
    display_order = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<NodeCategory {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'color': self.color,
            'display_order': self.display_order
        }
