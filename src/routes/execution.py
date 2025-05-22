from flask import Blueprint, jsonify, request
from src.models.all_models import Execution, ExecutionLog, Workflow, WorkflowVersion, db
from src.routes.auth import token_required
import datetime

execution_bp = Blueprint('execution', __name__)

@execution_bp.route('/', methods=['GET'])
@token_required
def get_executions(current_user):
    # Get query parameters for filtering
    workflow_id = request.args.get('workflow_id', type=int)
    status = request.args.get('status')
    
    # Start with base query - only show executions for workflows the user owns
    query = Execution.query.join(Workflow).filter(Workflow.created_by == current_user.id)
    
    # Apply filters
    if workflow_id:
        query = query.filter(Execution.workflow_id == workflow_id)
    
    if status:
        query = query.filter(Execution.status == status)
    
    # Order by most recent first
    executions = query.order_by(Execution.started_at.desc()).all()
    
    return jsonify({
        'executions': [execution.to_dict() for execution in executions]
    }), 200

@execution_bp.route('/<int:execution_id>', methods=['GET'])
@token_required
def get_execution(current_user, execution_id):
    execution = Execution.query.get(execution_id)
    
    if not execution:
        return jsonify({'message': 'Execution not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(execution.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify({
        'execution': execution.to_dict()
    }), 200

@execution_bp.route('/<int:execution_id>/logs', methods=['GET'])
@token_required
def get_execution_logs(current_user, execution_id):
    execution = Execution.query.get(execution_id)
    
    if not execution:
        return jsonify({'message': 'Execution not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(execution.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    logs = ExecutionLog.query.filter_by(execution_id=execution_id).order_by(ExecutionLog.started_at).all()
    
    return jsonify({
        'logs': [log.to_dict() for log in logs]
    }), 200

@execution_bp.route('/workflows/<int:workflow_id>/execute', methods=['POST'])
@token_required
def execute_workflow(current_user, workflow_id):
    workflow = Workflow.query.get(workflow_id)
    
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    # Check permissions
    if workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Get the latest workflow version
    workflow_version = WorkflowVersion.query.filter_by(workflow_id=workflow_id).order_by(WorkflowVersion.version.desc()).first()
    
    if not workflow_version:
        return jsonify({'message': 'No workflow version found'}), 404
    
    # Create new execution record
    new_execution = Execution(
        workflow_id=workflow_id,
        workflow_version_id=workflow_version.id,
        status='pending',
        triggered_by=current_user.id,
        trigger_type='manual'
    )
    
    db.session.add(new_execution)
    db.session.commit()
    
    # In a real implementation, this would trigger the workflow engine
    # For now, we'll just return the execution ID
    
    return jsonify({
        'message': 'Workflow execution started',
        'execution': new_execution.to_dict()
    }), 202

@execution_bp.route('/<int:execution_id>/cancel', methods=['POST'])
@token_required
def cancel_execution(current_user, execution_id):
    execution = Execution.query.get(execution_id)
    
    if not execution:
        return jsonify({'message': 'Execution not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(execution.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Only allow cancellation of pending or running executions
    if execution.status not in ['pending', 'running']:
        return jsonify({'message': 'Cannot cancel execution with status: ' + execution.status}), 400
    
    execution.status = 'cancelled'
    execution.finished_at = datetime.datetime.utcnow()
    
    db.session.commit()
    
    # In a real implementation, this would signal the workflow engine to stop the execution
    
    return jsonify({
        'message': 'Execution cancelled successfully',
        'execution': execution.to_dict()
    }), 200
