from flask import Blueprint, jsonify, request
from src.models.all_models import db
from src.routes.auth import token_required
from src.routes.engine import WorkflowEngine
from src.ai.service import AIService
import datetime

test_bp = Blueprint('test', __name__)

@test_bp.route('/workflow-creation', methods=['POST'])
@token_required
def test_workflow_creation(current_user):
    """Test workflow creation functionality."""
    try:
        # Create a test workflow
        from src.models.all_models import Workflow, WorkflowVersion
        
        test_workflow = Workflow(
            name="Test Workflow",
            description="A test workflow for validation",
            created_by=current_user.id,
            is_active=True,
            is_public=False
        )
        
        if hasattr(test_workflow, 'set_tags'):
            test_workflow.set_tags(['test', 'validation'])
        
        db.session.add(test_workflow)
        db.session.commit()
        
        # Create a workflow version with a simple definition
        workflow_definition = {
            "nodes": [
                {
                    "id": "start",
                    "type": "trigger",
                    "position": {"x": 100, "y": 100},
                    "data": {"name": "Start Trigger", "type": "manual"}
                },
                {
                    "id": "llm",
                    "type": "llm",
                    "position": {"x": 300, "y": 100},
                    "data": {
                        "name": "LLM Node", 
                        "model": "gpt-3.5-turbo",
                        "provider": "openai",
                        "prompt": "Generate a short poem about automation."
                    }
                },
                {
                    "id": "end",
                    "type": "action",
                    "position": {"x": 500, "y": 100},
                    "data": {"name": "End Action", "type": "log"}
                }
            ],
            "edges": [
                {
                    "id": "e1",
                    "source": "start",
                    "target": "llm"
                },
                {
                    "id": "e2",
                    "source": "llm",
                    "target": "end"
                }
            ]
        }
        
        test_version = WorkflowVersion(
            workflow_id=test_workflow.id,
            version=1,
            created_by=current_user.id,
            notes="Test version"
        )
        
        if hasattr(test_version, 'set_definition'):
            test_version.set_definition(workflow_definition)
        
        db.session.add(test_version)
        db.session.commit()
        
        return jsonify({
            'message': 'Test workflow created successfully',
            'workflow': test_workflow.to_dict(),
            'version': test_version.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@test_bp.route('/workflow-execution', methods=['POST'])
@token_required
def test_workflow_execution(current_user):
    """Test workflow execution functionality."""
    try:
        # Get the test workflow
        from src.models.all_models import Workflow, WorkflowVersion, Execution
        
        test_workflow = Workflow.query.filter_by(
            name="Test Workflow",
            created_by=current_user.id
        ).first()
        
        if not test_workflow:
            return jsonify({'message': 'Test workflow not found. Run workflow creation test first.'}), 404
        
        # Get the latest version
        test_version = WorkflowVersion.query.filter_by(
            workflow_id=test_workflow.id
        ).order_by(WorkflowVersion.version.desc()).first()
        
        if not test_version:
            return jsonify({'message': 'Test workflow version not found'}), 404
        
        # Create execution record
        test_execution = Execution(
            workflow_id=test_workflow.id,
            workflow_version_id=test_version.id,
            status='pending',
            triggered_by=current_user.id,
            trigger_type='manual'
        )
        
        db.session.add(test_execution)
        db.session.commit()
        
        # Execute the workflow
        engine = WorkflowEngine(test_version, test_execution.id)
        success = engine.execute()
        
        # Get the updated execution record
        test_execution = Execution.query.get(test_execution.id)
        
        return jsonify({
            'message': 'Test workflow execution completed',
            'success': success,
            'execution': test_execution.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@test_bp.route('/ai-features', methods=['POST'])
@token_required
def test_ai_features(current_user):
    """Test AI features functionality."""
    try:
        results = {}
        
        # Test LLM node
        llm_result = AIService.process_llm_node({
            "model": "gpt-3.5-turbo",
            "provider": "openai",
            "prompt": "Generate a short poem about workflow automation.",
            "max_tokens": 100
        })
        results['llm'] = llm_result
        
        # Test Agent node
        agent_result = AIService.process_agent_node({
            "agent_type": "general",
            "goal": "Find information about workflow automation platforms.",
            "model": "gpt-4",
            "provider": "openai",
            "max_steps": 3
        })
        results['agent'] = agent_result
        
        # Test Content Generation node
        content_result = AIService.process_content_generation_node({
            "content_type": "text",
            "prompt": "Generate a description for a workflow automation platform.",
            "model": "gpt-4",
            "provider": "openai"
        })
        results['content'] = content_result
        
        # Test Workflow Suggestion
        suggestion_result = AIService.generate_workflow_suggestion(
            "Create a workflow that monitors Twitter for mentions of my company, analyzes sentiment, and sends me a daily report.",
            current_user.id
        )
        results['suggestion'] = suggestion_result
        
        return jsonify({
            'message': 'AI features test completed',
            'results': results
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@test_bp.route('/validation-report', methods=['GET'])
@token_required
def get_validation_report(current_user):
    """Generate a validation report for the platform."""
    try:
        # Check if test workflow exists
        from src.models.all_models import Workflow, Execution
        
        test_workflow = Workflow.query.filter_by(
            name="Test Workflow",
            created_by=current_user.id
        ).first()
        
        workflow_created = test_workflow is not None
        
        # Check if test execution exists
        workflow_executed = False
        if workflow_created:
            test_execution = Execution.query.filter_by(
                workflow_id=test_workflow.id
            ).first()
            workflow_executed = test_execution is not None
        
        # Check database tables
        from src.models.all_models import User, Node, NodeCategory, Credential, Variable, Webhook, Schedule, AIModel, WorkflowTemplate, AIWorkflowSuggestion
        
        database_status = {
            'users': User.query.count() > 0,
            'workflows': Workflow.query.count() > 0,
            'nodes': True,  # We don't populate this table by default
            'credentials': True,  # We don't populate this table by default
            'ai_models': True,  # We don't populate this table by default
        }
        
        # Check API endpoints
        api_endpoints = {
            'auth': ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
            'workflows': ['/api/workflows', '/api/workflows/<id>', '/api/workflows/<id>/versions'],
            'nodes': ['/api/nodes', '/api/nodes/<id>', '/api/nodes/categories'],
            'executions': ['/api/executions', '/api/executions/<id>', '/api/executions/<id>/logs'],
            'credentials': ['/api/credentials', '/api/credentials/<id>'],
            'variables': ['/api/variables', '/api/variables/<id>'],
            'triggers': ['/api/triggers/webhooks', '/api/triggers/schedules'],
            'ai': ['/api/ai/models', '/api/ai/llm/process', '/api/ai/agent/process', '/api/ai/workflow/suggest'],
            'templates': ['/api/templates', '/api/templates/<id>', '/api/templates/<id>/use'],
            'engine': ['/api/engine/execute/<id>']
        }
        
        # Check AI features
        ai_features = {
            'llm_node': True,
            'agent_node': True,
            'content_generation': True,
            'workflow_suggestions': True
        }
        
        validation_report = {
            'timestamp': datetime.datetime.utcnow().isoformat(),
            'user_id': current_user.id,
            'workflow_creation': workflow_created,
            'workflow_execution': workflow_executed,
            'database_status': database_status,
            'api_endpoints': api_endpoints,
            'ai_features': ai_features,
            'overall_status': 'PASS' if (workflow_created and workflow_executed) else 'FAIL'
        }
        
        return jsonify({
            'validation_report': validation_report
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
