from flask import Blueprint, jsonify, request
from src.models.all_models import Workflow, WorkflowVersion, db
from src.routes.auth import token_required
import datetime
import json

workflow_bp = Blueprint('workflow', __name__)

@workflow_bp.route('/', methods=['GET'])
@token_required
def get_workflows(current_user):
    # Get query parameters for filtering
    is_active = request.args.get('is_active')
    is_public = request.args.get('is_public')
    tag = request.args.get('tag')
    
    # Start with base query
    query = Workflow.query
    
    # Apply filters
    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        query = query.filter(Workflow.is_active == is_active_bool)
    
    if is_public is not None:
        is_public_bool = is_public.lower() == 'true'
        query = query.filter(Workflow.is_public == is_public_bool)
    
    # Filter by user unless explicitly requesting public workflows
    if is_public != 'true':
        query = query.filter(Workflow.created_by == current_user.id)
    
    # Filter by tag if provided
    if tag:
        # This is a simplistic approach - in production you'd use a proper tag table or JSON search
        workflows = []
        for workflow in query.all():
            tags = workflow.get_tags() if hasattr(workflow, 'get_tags') else []
            if tag in tags:
                workflows.append(workflow)
    else:
        workflows = query.all()
    
    return jsonify({
        'workflows': [workflow.to_dict() for workflow in workflows]
    }), 200

@workflow_bp.route('/<int:workflow_id>', methods=['GET'])
@token_required
def get_workflow(current_user, workflow_id):
    workflow = Workflow.query.get(workflow_id)
    
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    # Check permissions
    if workflow.created_by != current_user.id and not workflow.is_public:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify({
        'workflow': workflow.to_dict()
    }), 200

@workflow_bp.route('/', methods=['POST'])
@token_required
def create_workflow(current_user):
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new workflow
    new_workflow = Workflow(
        name=data['name'],
        description=data.get('description', ''),
        created_by=current_user.id,
        is_active=data.get('is_active', True),
        is_public=data.get('is_public', False)
    )
    
    # Handle tags if provided
    if 'tags' in data and hasattr(new_workflow, 'set_tags'):
        new_workflow.set_tags(data['tags'])
    
    db.session.add(new_workflow)
    db.session.commit()
    
    # Create initial workflow version if definition is provided
    if 'definition' in data:
        new_version = WorkflowVersion(
            workflow_id=new_workflow.id,
            version=1,
            created_by=current_user.id,
            notes='Initial version'
        )
        
        if hasattr(new_version, 'set_definition'):
            new_version.set_definition(data['definition'])
        
        db.session.add(new_version)
        db.session.commit()
    
    return jsonify({
        'message': 'Workflow created successfully',
        'workflow': new_workflow.to_dict()
    }), 201

@workflow_bp.route('/<int:workflow_id>', methods=['PUT'])
@token_required
def update_workflow(current_user, workflow_id):
    workflow = Workflow.query.get(workflow_id)
    
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    # Check permissions
    if workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'name' in data:
        workflow.name = data['name']
    
    if 'description' in data:
        workflow.description = data['description']
    
    if 'is_active' in data:
        workflow.is_active = data['is_active']
    
    if 'is_public' in data:
        workflow.is_public = data['is_public']
    
    # Handle tags if provided
    if 'tags' in data and hasattr(workflow, 'set_tags'):
        workflow.set_tags(data['tags'])
    
    # Create new version if definition is provided
    if 'definition' in data:
        # Increment version number
        workflow.version += 1
        
        new_version = WorkflowVersion(
            workflow_id=workflow.id,
            version=workflow.version,
            created_by=current_user.id,
            notes=data.get('version_notes', f'Version {workflow.version}')
        )
        
        if hasattr(new_version, 'set_definition'):
            new_version.set_definition(data['definition'])
        
        db.session.add(new_version)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Workflow updated successfully',
        'workflow': workflow.to_dict()
    }), 200

@workflow_bp.route('/<int:workflow_id>', methods=['DELETE'])
@token_required
def delete_workflow(current_user, workflow_id):
    workflow = Workflow.query.get(workflow_id)
    
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    # Check permissions
    if workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    db.session.delete(workflow)
    db.session.commit()
    
    return jsonify({
        'message': 'Workflow deleted successfully'
    }), 200

@workflow_bp.route('/<int:workflow_id>/versions', methods=['GET'])
@token_required
def get_workflow_versions(current_user, workflow_id):
    workflow = Workflow.query.get(workflow_id)
    
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    # Check permissions
    if workflow.created_by != current_user.id and not workflow.is_public:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    versions = WorkflowVersion.query.filter_by(workflow_id=workflow_id).all()
    
    return jsonify({
        'versions': [version.to_dict() for version in versions]
    }), 200

@workflow_bp.route('/<int:workflow_id>/versions/<int:version>', methods=['GET'])
@token_required
def get_workflow_version(current_user, workflow_id, version):
    workflow = Workflow.query.get(workflow_id)
    
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    # Check permissions
    if workflow.created_by != current_user.id and not workflow.is_public:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    workflow_version = WorkflowVersion.query.filter_by(workflow_id=workflow_id, version=version).first()
    
    if not workflow_version:
        return jsonify({'message': 'Workflow version not found'}), 404
    
    return jsonify({
        'version': workflow_version.to_dict()
    }), 200
