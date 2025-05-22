from flask import Blueprint, jsonify, request
from src.models.all_models import AIModel, WorkflowTemplate, AIWorkflowSuggestion, db, User
from src.routes.auth import token_required
import datetime
import json

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/models', methods=['GET'])
@token_required
def get_ai_models(current_user):
    # Get query parameters for filtering
    model_type = request.args.get('type')
    provider = request.args.get('provider')
    
    # Start with base query
    query = AIModel.query.filter_by(is_active=True)
    
    # Apply filters
    if model_type:
        query = query.filter(AIModel.type == model_type)
    
    if provider:
        query = query.filter(AIModel.provider == provider)
    
    models = query.all()
    
    return jsonify({
        'models': [model.to_dict() for model in models]
    }), 200

@ai_bp.route('/models/<int:model_id>', methods=['GET'])
@token_required
def get_ai_model(current_user, model_id):
    model = AIModel.query.get(model_id)
    
    if not model:
        return jsonify({'message': 'AI model not found'}), 404
    
    return jsonify({
        'model': model.to_dict()
    }), 200

@ai_bp.route('/suggest', methods=['POST'])
@token_required
def suggest_workflow(current_user):
    data = request.get_json()
    
    if not data or not data.get('prompt'):
        return jsonify({'message': 'Missing prompt'}), 400
    
    # In a real implementation, this would call an AI service to generate a workflow
    # For now, we'll just create a placeholder suggestion
    
    # Create a simple example workflow suggestion
    example_workflow = {
        "nodes": [
            {
                "id": "start",
                "type": "trigger",
                "position": {"x": 100, "y": 100},
                "data": {"name": "Start Trigger"}
            },
            {
                "id": "process",
                "type": "function",
                "position": {"x": 300, "y": 100},
                "data": {"name": "Process Data"}
            },
            {
                "id": "end",
                "type": "action",
                "position": {"x": 500, "y": 100},
                "data": {"name": "End Action"}
            }
        ],
        "edges": [
            {
                "id": "e1",
                "source": "start",
                "target": "process"
            },
            {
                "id": "e2",
                "source": "process",
                "target": "end"
            }
        ]
    }
    
    # Save the suggestion
    suggestion = AIWorkflowSuggestion(
        user_id=current_user.id,
        prompt=data['prompt']
    )
    
    if hasattr(suggestion, 'set_suggestion'):
        suggestion.set_suggestion(example_workflow)
    
    db.session.add(suggestion)
    db.session.commit()
    
    return jsonify({
        'message': 'Workflow suggestion generated',
        'suggestion': suggestion.to_dict()
    }), 200

@ai_bp.route('/suggestions', methods=['GET'])
@token_required
def get_suggestions(current_user):
    suggestions = AIWorkflowSuggestion.query.filter_by(user_id=current_user.id).order_by(AIWorkflowSuggestion.created_at.desc()).all()
    
    return jsonify({
        'suggestions': [suggestion.to_dict() for suggestion in suggestions]
    }), 200

@ai_bp.route('/suggestions/<int:suggestion_id>/feedback', methods=['POST'])
@token_required
def provide_suggestion_feedback(current_user, suggestion_id):
    suggestion = AIWorkflowSuggestion.query.get(suggestion_id)
    
    if not suggestion:
        return jsonify({'message': 'Suggestion not found'}), 404
    
    # Check permissions
    if suggestion.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('feedback'):
        return jsonify({'message': 'Missing feedback'}), 400
    
    # Validate feedback value
    if data['feedback'] not in ['positive', 'negative', 'neutral']:
        return jsonify({'message': 'Invalid feedback value'}), 400
    
    suggestion.feedback = data['feedback']
    db.session.commit()
    
    return jsonify({
        'message': 'Feedback recorded successfully',
        'suggestion': suggestion.to_dict()
    }), 200

# Template routes
template_bp = Blueprint('template', __name__)

@template_bp.route('/', methods=['GET'])
@token_required
def get_templates(current_user):
    # Get query parameters for filtering
    category = request.args.get('category')
    is_featured = request.args.get('is_featured')
    tag = request.args.get('tag')
    
    # Start with base query
    query = WorkflowTemplate.query
    
    # Apply filters
    if category:
        query = query.filter(WorkflowTemplate.category == category)
    
    if is_featured is not None:
        is_featured_bool = is_featured.lower() == 'true'
        query = query.filter(WorkflowTemplate.is_featured == is_featured_bool)
    
    # Filter by tag if provided
    if tag:
        # This is a simplistic approach - in production you'd use a proper tag table or JSON search
        templates = []
        for template in query.all():
            tags = template.get_tags() if hasattr(template, 'get_tags') else []
            if tag in tags:
                templates.append(template)
    else:
        templates = query.all()
    
    return jsonify({
        'templates': [template.to_dict() for template in templates]
    }), 200

@template_bp.route('/<int:template_id>', methods=['GET'])
@token_required
def get_template(current_user, template_id):
    template = WorkflowTemplate.query.get(template_id)
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    return jsonify({
        'template': template.to_dict()
    }), 200

@template_bp.route('/<int:template_id>/use', methods=['POST'])
@token_required
def use_template(current_user, template_id):
    template = WorkflowTemplate.query.get(template_id)
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    data = request.get_json() or {}
    
    # Get the template definition
    template_definition = template.get_definition() if hasattr(template, 'get_definition') else {}
    
    # Create a new workflow from the template
    new_workflow = Workflow(
        name=data.get('name', template.name),
        description=data.get('description', template.description),
        created_by=current_user.id,
        is_active=True,
        is_public=False
    )
    
    # Copy tags from template
    if hasattr(template, 'get_tags') and hasattr(new_workflow, 'set_tags'):
        new_workflow.set_tags(template.get_tags())
    
    db.session.add(new_workflow)
    db.session.commit()
    
    # Create initial workflow version with template definition
    from src.models.workflow import WorkflowVersion
    new_version = WorkflowVersion(
        workflow_id=new_workflow.id,
        version=1,
        created_by=current_user.id,
        notes=f'Created from template: {template.name}'
    )
    
    if hasattr(new_version, 'set_definition'):
        new_version.set_definition(template_definition)
    
    db.session.add(new_version)
    db.session.commit()
    
    return jsonify({
        'message': 'Workflow created from template',
        'workflow': new_workflow.to_dict()
    }), 201
