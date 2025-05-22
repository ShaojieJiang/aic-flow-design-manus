from src.models import db
from datetime import datetime
import json

class AIModel(db.Model):
    __tablename__ = 'ai_models'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    provider = db.Column(db.String(255), nullable=False)
    model_id = db.Column(db.String(255), nullable=False)
    type = db.Column(db.Enum('llm', 'embedding', 'image', 'audio', 'agent'))
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    configuration = db.Column(db.Text)  # JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<AIModel {self.name}>'
    
    def get_configuration(self):
        if self.configuration:
            return json.loads(self.configuration)
        return {}
    
    def set_configuration(self, config_dict):
        self.configuration = json.dumps(config_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'provider': self.provider,
            'model_id': self.model_id,
            'type': self.type,
            'description': self.description,
            'is_active': self.is_active,
            'configuration': self.get_configuration(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class WorkflowTemplate(db.Model):
    __tablename__ = 'workflow_templates'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(255))
    definition = db.Column(db.Text)  # JSON representation of workflow
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_featured = db.Column(db.Boolean, default=False)
    tags = db.Column(db.Text)  # JSON array of tags
    
    def __repr__(self):
        return f'<WorkflowTemplate {self.name}>'
    
    def get_definition(self):
        if self.definition:
            return json.loads(self.definition)
        return {}
    
    def set_definition(self, definition_dict):
        self.definition = json.dumps(definition_dict)
    
    def get_tags(self):
        if self.tags:
            return json.loads(self.tags)
        return []
    
    def set_tags(self, tags_list):
        self.tags = json.dumps(tags_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'definition': self.get_definition(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_featured': self.is_featured,
            'tags': self.get_tags()
        }


class AIWorkflowSuggestion(db.Model):
    __tablename__ = 'ai_workflow_suggestions'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prompt = db.Column(db.Text)
    suggestion = db.Column(db.Text)  # JSON representation of suggested workflow
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_applied = db.Column(db.Boolean, default=False)
    applied_at = db.Column(db.DateTime, nullable=True)
    feedback = db.Column(db.Enum('positive', 'negative', 'neutral'), nullable=True)
    
    def __repr__(self):
        return f'<AIWorkflowSuggestion {self.id}>'
    
    def get_suggestion(self):
        if self.suggestion:
            return json.loads(self.suggestion)
        return {}
    
    def set_suggestion(self, suggestion_dict):
        self.suggestion = json.dumps(suggestion_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'prompt': self.prompt,
            'suggestion': self.get_suggestion(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_applied': self.is_applied,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'feedback': self.feedback
        }
