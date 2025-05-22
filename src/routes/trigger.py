from flask import Blueprint, jsonify, request
from src.models.all_models import Webhook, Schedule, db, Workflow
from src.routes.auth import token_required
import datetime

trigger_bp = Blueprint('trigger', __name__)

# Webhook routes
@trigger_bp.route('/webhooks', methods=['GET'])
@token_required
def get_webhooks(current_user):
    # Get query parameters for filtering
    workflow_id = request.args.get('workflow_id', type=int)
    
    # Start with base query - only show webhooks for workflows the user owns
    query = Webhook.query.join(Workflow).filter(Workflow.created_by == current_user.id)
    
    # Apply filters
    if workflow_id:
        query = query.filter(Webhook.workflow_id == workflow_id)
    
    webhooks = query.all()
    
    return jsonify({
        'webhooks': [webhook.to_dict() for webhook in webhooks]
    }), 200

@trigger_bp.route('/webhooks/<int:webhook_id>', methods=['GET'])
@token_required
def get_webhook(current_user, webhook_id):
    webhook = Webhook.query.get(webhook_id)
    
    if not webhook:
        return jsonify({'message': 'Webhook not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(webhook.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify({
        'webhook': webhook.to_dict()
    }), 200

@trigger_bp.route('/webhooks', methods=['POST'])
@token_required
def create_webhook(current_user):
    data = request.get_json()
    
    if not data or not data.get('workflow_id') or not data.get('path'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if workflow exists and user has access
    workflow = Workflow.query.get(data['workflow_id'])
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    if workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Create new webhook
    new_webhook = Webhook(
        workflow_id=data['workflow_id'],
        path=data['path'],
        method=data.get('method', 'POST'),
        auth_enabled=data.get('auth_enabled', False)
    )
    
    # Generate auth token if auth is enabled
    if new_webhook.auth_enabled:
        import secrets
        new_webhook.auth_token = secrets.token_urlsafe(32)
    
    db.session.add(new_webhook)
    db.session.commit()
    
    return jsonify({
        'message': 'Webhook created successfully',
        'webhook': new_webhook.to_dict()
    }), 201

@trigger_bp.route('/webhooks/<int:webhook_id>', methods=['PUT'])
@token_required
def update_webhook(current_user, webhook_id):
    webhook = Webhook.query.get(webhook_id)
    
    if not webhook:
        return jsonify({'message': 'Webhook not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(webhook.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'path' in data:
        webhook.path = data['path']
    
    if 'method' in data:
        webhook.method = data['method']
    
    if 'auth_enabled' in data:
        webhook.auth_enabled = data['auth_enabled']
        
        # Generate new auth token if auth is being enabled
        if webhook.auth_enabled and not webhook.auth_token:
            import secrets
            webhook.auth_token = secrets.token_urlsafe(32)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Webhook updated successfully',
        'webhook': webhook.to_dict()
    }), 200

@trigger_bp.route('/webhooks/<int:webhook_id>', methods=['DELETE'])
@token_required
def delete_webhook(current_user, webhook_id):
    webhook = Webhook.query.get(webhook_id)
    
    if not webhook:
        return jsonify({'message': 'Webhook not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(webhook.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    db.session.delete(webhook)
    db.session.commit()
    
    return jsonify({
        'message': 'Webhook deleted successfully'
    }), 200

# Schedule routes
@trigger_bp.route('/schedules', methods=['GET'])
@token_required
def get_schedules(current_user):
    # Get query parameters for filtering
    workflow_id = request.args.get('workflow_id', type=int)
    is_active = request.args.get('is_active')
    
    # Start with base query - only show schedules for workflows the user owns
    query = Schedule.query.join(Workflow).filter(Workflow.created_by == current_user.id)
    
    # Apply filters
    if workflow_id:
        query = query.filter(Schedule.workflow_id == workflow_id)
    
    if is_active is not None:
        is_active_bool = is_active.lower() == 'true'
        query = query.filter(Schedule.is_active == is_active_bool)
    
    schedules = query.all()
    
    return jsonify({
        'schedules': [schedule.to_dict() for schedule in schedules]
    }), 200

@trigger_bp.route('/schedules/<int:schedule_id>', methods=['GET'])
@token_required
def get_schedule(current_user, schedule_id):
    schedule = Schedule.query.get(schedule_id)
    
    if not schedule:
        return jsonify({'message': 'Schedule not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(schedule.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify({
        'schedule': schedule.to_dict()
    }), 200

@trigger_bp.route('/schedules', methods=['POST'])
@token_required
def create_schedule(current_user):
    data = request.get_json()
    
    if not data or not data.get('workflow_id') or not data.get('cron_expression'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if workflow exists and user has access
    workflow = Workflow.query.get(data['workflow_id'])
    if not workflow:
        return jsonify({'message': 'Workflow not found'}), 404
    
    if workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    # Create new schedule
    new_schedule = Schedule(
        workflow_id=data['workflow_id'],
        cron_expression=data['cron_expression'],
        timezone=data.get('timezone', 'UTC'),
        is_active=data.get('is_active', True),
        created_by=current_user.id
    )
    
    # Calculate next execution time (in a real implementation)
    # For now, just set it to a future time
    new_schedule.next_execution = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    
    db.session.add(new_schedule)
    db.session.commit()
    
    return jsonify({
        'message': 'Schedule created successfully',
        'schedule': new_schedule.to_dict()
    }), 201

@trigger_bp.route('/schedules/<int:schedule_id>', methods=['PUT'])
@token_required
def update_schedule(current_user, schedule_id):
    schedule = Schedule.query.get(schedule_id)
    
    if not schedule:
        return jsonify({'message': 'Schedule not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(schedule.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'cron_expression' in data:
        schedule.cron_expression = data['cron_expression']
        # Recalculate next execution time (in a real implementation)
    
    if 'timezone' in data:
        schedule.timezone = data['timezone']
    
    if 'is_active' in data:
        schedule.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Schedule updated successfully',
        'schedule': schedule.to_dict()
    }), 200

@trigger_bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@token_required
def delete_schedule(current_user, schedule_id):
    schedule = Schedule.query.get(schedule_id)
    
    if not schedule:
        return jsonify({'message': 'Schedule not found'}), 404
    
    # Check permissions
    workflow = Workflow.query.get(schedule.workflow_id)
    if not workflow or workflow.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    db.session.delete(schedule)
    db.session.commit()
    
    return jsonify({
        'message': 'Schedule deleted successfully'
    }), 200
