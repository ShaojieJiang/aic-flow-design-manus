from src.models import db
from datetime import datetime
import json

class Execution(db.Model):
    __tablename__ = 'executions'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workflow_id = db.Column(db.Integer, db.ForeignKey('workflows.id'), nullable=False)
    workflow_version_id = db.Column(db.Integer, db.ForeignKey('workflow_versions.id'), nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.Enum('pending', 'running', 'completed', 'failed', 'cancelled'), default='pending')
    triggered_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    trigger_type = db.Column(db.Enum('manual', 'scheduled', 'webhook', 'event'))
    error_message = db.Column(db.Text)
    
    # Relationships
    logs = db.relationship('ExecutionLog', backref='execution', lazy=True)
    
    def __repr__(self):
        return f'<Execution {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'workflow_id': self.workflow_id,
            'workflow_version_id': self.workflow_version_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'finished_at': self.finished_at.isoformat() if self.finished_at else None,
            'status': self.status,
            'triggered_by': self.triggered_by,
            'trigger_type': self.trigger_type,
            'error_message': self.error_message
        }


class ExecutionLog(db.Model):
    __tablename__ = 'execution_logs'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    execution_id = db.Column(db.Integer, db.ForeignKey('executions.id'), nullable=False)
    node_id = db.Column(db.String(255), nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.Enum('pending', 'running', 'completed', 'failed', 'skipped'), default='pending')
    input_data = db.Column(db.Text)  # JSON
    output_data = db.Column(db.Text)  # JSON
    error_message = db.Column(db.Text)
    
    def __repr__(self):
        return f'<ExecutionLog {self.execution_id}-{self.node_id}>'
    
    def get_input_data(self):
        if self.input_data:
            return json.loads(self.input_data)
        return {}
    
    def set_input_data(self, input_dict):
        self.input_data = json.dumps(input_dict)
    
    def get_output_data(self):
        if self.output_data:
            return json.loads(self.output_data)
        return {}
    
    def set_output_data(self, output_dict):
        self.output_data = json.dumps(output_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'execution_id': self.execution_id,
            'node_id': self.node_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'finished_at': self.finished_at.isoformat() if self.finished_at else None,
            'status': self.status,
            'input_data': self.get_input_data(),
            'output_data': self.get_output_data(),
            'error_message': self.error_message
        }
