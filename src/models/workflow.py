from src.models import db
from datetime import datetime
import json

class Workflow(db.Model):
    __tablename__ = 'workflows'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    is_public = db.Column(db.Boolean, default=False)
    version = db.Column(db.Integer, default=1)
    tags = db.Column(db.Text)  # JSON array of tags
    
    # Relationships
    versions = db.relationship('WorkflowVersion', backref='workflow', lazy=True)
    executions = db.relationship('Execution', backref='workflow', lazy=True)
    webhooks = db.relationship('Webhook', backref='workflow', lazy=True)
    schedules = db.relationship('Schedule', backref='workflow', lazy=True)
    
    def __repr__(self):
        return f'<Workflow {self.name}>'
    
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
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active,
            'is_public': self.is_public,
            'version': self.version,
            'tags': self.get_tags()
        }


class WorkflowVersion(db.Model):
    __tablename__ = 'workflow_versions'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workflow_id = db.Column(db.Integer, db.ForeignKey('workflows.id'), nullable=False)
    version = db.Column(db.Integer, nullable=False)
    definition = db.Column(db.Text)  # JSON representation of workflow
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notes = db.Column(db.Text)
    
    def __repr__(self):
        return f'<WorkflowVersion {self.workflow_id}-{self.version}>'
    
    def get_definition(self):
        if self.definition:
            return json.loads(self.definition)
        return {}
    
    def set_definition(self, definition_dict):
        self.definition = json.dumps(definition_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'workflow_id': self.workflow_id,
            'version': self.version,
            'definition': self.get_definition(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'created_by': self.created_by,
            'notes': self.notes
        }
