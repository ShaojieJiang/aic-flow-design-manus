from flask import Blueprint, jsonify, request
from src.models.all_models import Node, NodeCategory, db
from src.routes.auth import token_required

node_bp = Blueprint('node', __name__)

@node_bp.route('/', methods=['GET'])
@token_required
def get_nodes(current_user):
    # Get query parameters for filtering
    category = request.args.get('category')
    is_ai = request.args.get('is_ai')
    
    # Start with base query
    query = Node.query
    
    # Apply filters
    if category:
        query = query.filter(Node.category == category)
    
    if is_ai is not None:
        is_ai_bool = is_ai.lower() == 'true'
        query = query.filter(Node.is_ai == is_ai_bool)
    
    nodes = query.all()
    
    return jsonify({
        'nodes': [node.to_dict() for node in nodes]
    }), 200

@node_bp.route('/<int:node_id>', methods=['GET'])
@token_required
def get_node(current_user, node_id):
    node = Node.query.get(node_id)
    
    if not node:
        return jsonify({'message': 'Node not found'}), 404
    
    return jsonify({
        'node': node.to_dict()
    }), 200

@node_bp.route('/custom', methods=['POST'])
@token_required
def create_custom_node(current_user):
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('type'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Create new custom node
    new_node = Node(
        name=data['name'],
        type=data['type'],
        description=data.get('description', ''),
        category=data.get('category'),
        icon=data.get('icon'),
        is_core=False,
        is_ai=data.get('is_ai', False)
    )
    
    # Set schema if provided
    if 'schema' in data and hasattr(new_node, 'set_schema'):
        new_node.set_schema(data['schema'])
    
    db.session.add(new_node)
    db.session.commit()
    
    return jsonify({
        'message': 'Custom node created successfully',
        'node': new_node.to_dict()
    }), 201

@node_bp.route('/categories', methods=['GET'])
@token_required
def get_node_categories(current_user):
    categories = NodeCategory.query.order_by(NodeCategory.display_order).all()
    
    return jsonify({
        'categories': [category.to_dict() for category in categories]
    }), 200

@node_bp.route('/categories/<int:category_id>', methods=['GET'])
@token_required
def get_node_category(current_user, category_id):
    category = NodeCategory.query.get(category_id)
    
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    return jsonify({
        'category': category.to_dict()
    }), 200
