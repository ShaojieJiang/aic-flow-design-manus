from flask import Blueprint, jsonify, request
from src.models.all_models import AIModel, WorkflowTemplate, AIWorkflowSuggestion, db
from src.routes.auth import token_required
from src.ai.service import AIService
import datetime

ai_api_bp = Blueprint('ai_api', __name__)

@ai_api_bp.route('/models', methods=['GET'])
@token_required
def get_ai_models(current_user):
    """Get a list of available AI models."""
    model_type = request.args.get('type')
    models = AIService.get_available_models(model_type)
    
    return jsonify({
        'models': models
    }), 200

@ai_api_bp.route('/llm/process', methods=['POST'])
@token_required
def process_llm(current_user):
    """Process text using an LLM model."""
    data = request.get_json()
    
    if not data or not data.get('model') or not data.get('prompt'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        result = AIService.process_llm_node(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ai_api_bp.route('/agent/process', methods=['POST'])
@token_required
def process_agent(current_user):
    """Process a task using an autonomous agent."""
    data = request.get_json()
    
    if not data or not data.get('agent_type') or not data.get('goal'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        result = AIService.process_agent_node(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ai_api_bp.route('/content/generate', methods=['POST'])
@token_required
def generate_content(current_user):
    """Generate content using AI."""
    data = request.get_json()
    
    if not data or not data.get('content_type') or not data.get('prompt'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        result = AIService.process_content_generation_node(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@ai_api_bp.route('/workflow/suggest', methods=['POST'])
@token_required
def suggest_workflow(current_user):
    """Generate a workflow suggestion based on a natural language prompt."""
    data = request.get_json()
    
    if not data or not data.get('prompt'):
        return jsonify({'message': 'Missing prompt'}), 400
    
    try:
        workflow = AIService.generate_workflow_suggestion(data['prompt'], current_user.id)
        
        # Get the suggestion from the database
        suggestion = AIWorkflowSuggestion.query.filter_by(
            user_id=current_user.id
        ).order_by(AIWorkflowSuggestion.created_at.desc()).first()
        
        return jsonify({
            'message': 'Workflow suggestion generated',
            'workflow': workflow,
            'suggestion': suggestion.to_dict() if suggestion else None
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
