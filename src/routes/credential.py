from flask import Blueprint, jsonify, request
from src.models.all_models import Credential, Variable, db
from src.routes.auth import token_required
import datetime

credential_bp = Blueprint('credential', __name__)

@credential_bp.route('/', methods=['GET'])
@token_required
def get_credentials(current_user):
    # Get query parameters for filtering
    credential_type = request.args.get('type')
    
    # Start with base query - only show credentials the user owns
    query = Credential.query.filter_by(created_by=current_user.id)
    
    # Apply filters
    if credential_type:
        query = query.filter(Credential.type == credential_type)
    
    credentials = query.all()
    
    return jsonify({
        'credentials': [credential.to_dict() for credential in credentials]
    }), 200

@credential_bp.route('/<int:credential_id>', methods=['GET'])
@token_required
def get_credential(current_user, credential_id):
    credential = Credential.query.get(credential_id)
    
    if not credential:
        return jsonify({'message': 'Credential not found'}), 404
    
    # Check permissions
    if credential.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify({
        'credential': credential.to_dict()
    }), 200

@credential_bp.route('/', methods=['POST'])
@token_required
def create_credential(current_user):
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('type') or not data.get('data'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new credential
    new_credential = Credential(
        name=data['name'],
        type=data['type'],
        created_by=current_user.id
    )
    
    # Set encrypted data
    if hasattr(new_credential, 'set_data'):
        new_credential.set_data(data['data'])
    
    db.session.add(new_credential)
    db.session.commit()
    
    return jsonify({
        'message': 'Credential created successfully',
        'credential': new_credential.to_dict()
    }), 201

@credential_bp.route('/<int:credential_id>', methods=['PUT'])
@token_required
def update_credential(current_user, credential_id):
    credential = Credential.query.get(credential_id)
    
    if not credential:
        return jsonify({'message': 'Credential not found'}), 404
    
    # Check permissions
    if credential.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'name' in data:
        credential.name = data['name']
    
    if 'type' in data:
        credential.type = data['type']
    
    if 'data' in data and hasattr(credential, 'set_data'):
        credential.set_data(data['data'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Credential updated successfully',
        'credential': credential.to_dict()
    }), 200

@credential_bp.route('/<int:credential_id>', methods=['DELETE'])
@token_required
def delete_credential(current_user, credential_id):
    credential = Credential.query.get(credential_id)
    
    if not credential:
        return jsonify({'message': 'Credential not found'}), 404
    
    # Check permissions
    if credential.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    db.session.delete(credential)
    db.session.commit()
    
    return jsonify({
        'message': 'Credential deleted successfully'
    }), 200

# Variable routes
variable_bp = Blueprint('variable', __name__)

@variable_bp.route('/', methods=['GET'])
@token_required
def get_variables(current_user):
    # Get query parameters for filtering
    scope = request.args.get('scope')
    workflow_id = request.args.get('workflow_id', type=int)
    
    # Start with base query - only show variables the user owns
    query = Variable.query.filter_by(created_by=current_user.id)
    
    # Apply filters
    if scope:
        query = query.filter(Variable.scope == scope)
    
    if workflow_id:
        query = query.filter(Variable.workflow_id == workflow_id)
    
    variables = query.all()
    
    return jsonify({
        'variables': [variable.to_dict() for variable in variables]
    }), 200

@variable_bp.route('/<int:variable_id>', methods=['GET'])
@token_required
def get_variable(current_user, variable_id):
    variable = Variable.query.get(variable_id)
    
    if not variable:
        return jsonify({'message': 'Variable not found'}), 404
    
    # Check permissions
    if variable.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    return jsonify({
        'variable': variable.to_dict()
    }), 200

@variable_bp.route('/', methods=['POST'])
@token_required
def create_variable(current_user):
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('type') or not data.get('scope'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Validate scope and workflow_id combination
    if data['scope'] == 'workflow' and not data.get('workflow_id'):
        return jsonify({'message': 'workflow_id is required for workflow scope'}), 400
    
    # Create new variable
    new_variable = Variable(
        name=data['name'],
        type=data['type'],
        scope=data['scope'],
        workflow_id=data.get('workflow_id'),
        created_by=current_user.id
    )
    
    # Set value
    if 'value' in data and hasattr(new_variable, 'set_value'):
        new_variable.set_value(data['value'])
    
    db.session.add(new_variable)
    db.session.commit()
    
    return jsonify({
        'message': 'Variable created successfully',
        'variable': new_variable.to_dict()
    }), 201

@variable_bp.route('/<int:variable_id>', methods=['PUT'])
@token_required
def update_variable(current_user, variable_id):
    variable = Variable.query.get(variable_id)
    
    if not variable:
        return jsonify({'message': 'Variable not found'}), 404
    
    # Check permissions
    if variable.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    if 'name' in data:
        variable.name = data['name']
    
    if 'type' in data:
        variable.type = data['type']
    
    if 'scope' in data:
        variable.scope = data['scope']
        
        # Validate scope and workflow_id combination
        if data['scope'] == 'workflow' and not (variable.workflow_id or data.get('workflow_id')):
            return jsonify({'message': 'workflow_id is required for workflow scope'}), 400
    
    if 'workflow_id' in data:
        variable.workflow_id = data['workflow_id']
    
    if 'value' in data and hasattr(variable, 'set_value'):
        variable.set_value(data['value'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Variable updated successfully',
        'variable': variable.to_dict()
    }), 200

@variable_bp.route('/<int:variable_id>', methods=['DELETE'])
@token_required
def delete_variable(current_user, variable_id):
    variable = Variable.query.get(variable_id)
    
    if not variable:
        return jsonify({'message': 'Variable not found'}), 404
    
    # Check permissions
    if variable.created_by != current_user.id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    db.session.delete(variable)
    db.session.commit()
    
    return jsonify({
        'message': 'Variable deleted successfully'
    }), 200
