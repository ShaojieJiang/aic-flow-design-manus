from flask import Blueprint, jsonify, request
from src.models.all_models import db
import importlib
import json
import traceback
import datetime

# Import all route blueprints
from src.routes.auth import auth_bp
from src.routes.workflow import workflow_bp
from src.routes.node import node_bp
from src.routes.execution import execution_bp
from src.routes.credential import credential_bp, variable_bp
from src.routes.ai import ai_bp, template_bp
from src.routes.trigger import trigger_bp

# Create a blueprint for the workflow engine
engine_bp = Blueprint('engine', __name__)

class WorkflowEngine:
    """
    Core workflow execution engine that processes workflow definitions and executes nodes.
    """
    
    def __init__(self, workflow_version, execution_id):
        """Initialize the workflow engine with a workflow version and execution ID."""
        from src.models.all_models import WorkflowVersion, Execution, ExecutionLog
        
        self.workflow_version = workflow_version
        self.execution_id = execution_id
        self.execution = Execution.query.get(execution_id)
        self.definition = workflow_version.get_definition()
        self.nodes = {}
        self.edges = {}
        self.node_results = {}
        self.current_node = None
        
        # Parse workflow definition
        self._parse_definition()
    
    def _parse_definition(self):
        """Parse the workflow definition into nodes and edges."""
        if 'nodes' in self.definition:
            for node in self.definition['nodes']:
                self.nodes[node['id']] = node
        
        if 'edges' in self.definition:
            for edge in self.definition['edges']:
                if edge['source'] not in self.edges:
                    self.edges[edge['source']] = []
                self.edges[edge['source']].append(edge['target'])
    
    def _find_start_nodes(self):
        """Find all start nodes (nodes with no incoming edges)."""
        all_nodes = set(self.nodes.keys())
        target_nodes = set()
        
        for source, targets in self.edges.items():
            for target in targets:
                target_nodes.add(target)
        
        # Start nodes are those that are not targets of any edge
        return list(all_nodes - target_nodes)
    
    def _get_next_nodes(self, node_id):
        """Get the next nodes to execute after the current node."""
        if node_id in self.edges:
            return self.edges[node_id]
        return []
    
    def _execute_node(self, node_id):
        """Execute a single node in the workflow."""
        from src.models.all_models import ExecutionLog
        
        node = self.nodes[node_id]
        node_type = node.get('type', '')
        node_data = node.get('data', {})
        
        # Create execution log entry
        log_entry = ExecutionLog(
            execution_id=self.execution_id,
            node_id=node_id,
            status='running'
        )
        
        # Set input data if available
        input_data = {}
        for input_node_id, result in self.node_results.items():
            if input_node_id in self.edges and node_id in self.edges[input_node_id]:
                input_data[input_node_id] = result
        
        if input_data:
            log_entry.set_input_data(input_data)
        
        db.session.add(log_entry)
        db.session.commit()
        
        try:
            # Execute node based on type
            result = self._process_node(node_type, node_data, input_data)
            
            # Update execution log
            log_entry.status = 'completed'
            log_entry.finished_at = datetime.datetime.utcnow()
            log_entry.set_output_data(result)
            
            # Store result for downstream nodes
            self.node_results[node_id] = result
            
            db.session.commit()
            return True
            
        except Exception as e:
            # Update execution log with error
            log_entry.status = 'failed'
            log_entry.finished_at = datetime.datetime.utcnow()
            log_entry.error_message = str(e) + '\n' + traceback.format_exc()
            
            db.session.commit()
            return False
    
    def _process_node(self, node_type, node_data, input_data):
        """Process a node based on its type and return the result."""
        # In a real implementation, this would dynamically load and execute node handlers
        # For now, we'll implement a simple version with basic node types
        
        if node_type == 'trigger':
            # Trigger nodes just pass through their configuration
            return node_data
            
        elif node_type == 'function':
            # Function nodes would execute some code
            # For now, just return a mock result
            return {
                "processed": True,
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "result": f"Processed data from {node_data.get('name', 'unknown')}"
            }
            
        elif node_type == 'condition':
            # Condition nodes would evaluate a condition
            # For now, always return true
            return {"condition_result": True}
            
        elif node_type == 'action':
            # Action nodes would perform some action
            # For now, just return success
            return {"action": "completed", "success": True}
            
        elif node_type == 'llm':
            # LLM nodes would call an AI model
            # For now, return mock response
            return {
                "generated_text": f"This is a mock response from an LLM for prompt: {node_data.get('prompt', 'No prompt provided')}"
            }
            
        elif node_type == 'agent':
            # Agent nodes would execute an autonomous agent
            # For now, return mock response
            return {
                "agent_result": "Task completed successfully",
                "steps_taken": ["analyzed input", "made decision", "took action"]
            }
            
        else:
            # Unknown node type
            return {"error": f"Unknown node type: {node_type}"}
    
    def execute(self):
        """Execute the entire workflow."""
        # Update execution status
        self.execution.status = 'running'
        db.session.commit()
        
        try:
            # Find start nodes
            start_nodes = self._find_start_nodes()
            
            # Execute start nodes
            for node_id in start_nodes:
                success = self._execute_node(node_id)
                if not success:
                    raise Exception(f"Failed to execute start node: {node_id}")
            
            # Process remaining nodes in topological order
            processed_nodes = set(start_nodes)
            all_nodes = set(self.nodes.keys())
            
            while processed_nodes != all_nodes:
                # Find nodes whose dependencies have all been processed
                next_nodes = []
                for node_id in all_nodes - processed_nodes:
                    # Check if all incoming edges are from processed nodes
                    has_unprocessed_dependency = False
                    for source, targets in self.edges.items():
                        if node_id in targets and source not in processed_nodes:
                            has_unprocessed_dependency = True
                            break
                    
                    if not has_unprocessed_dependency:
                        next_nodes.append(node_id)
                
                if not next_nodes:
                    # No more nodes can be processed, but we haven't processed all nodes
                    # This indicates a cycle in the workflow
                    raise Exception("Workflow contains a cycle")
                
                # Execute the next batch of nodes
                for node_id in next_nodes:
                    success = self._execute_node(node_id)
                    if not success:
                        raise Exception(f"Failed to execute node: {node_id}")
                    processed_nodes.add(node_id)
            
            # Update execution status
            self.execution.status = 'completed'
            self.execution.finished_at = datetime.datetime.utcnow()
            db.session.commit()
            
            return True
            
        except Exception as e:
            # Update execution status
            self.execution.status = 'failed'
            self.execution.error_message = str(e)
            self.execution.finished_at = datetime.datetime.utcnow()
            db.session.commit()
            
            return False

# Engine API endpoints
@engine_bp.route('/execute/<int:execution_id>', methods=['POST'])
def execute_workflow_engine(execution_id):
    """Execute a workflow using the workflow engine."""
    from src.models.all_models import Execution, WorkflowVersion
    
    execution = Execution.query.get(execution_id)
    
    if not execution:
        return jsonify({'message': 'Execution not found'}), 404
    
    if execution.status != 'pending':
        return jsonify({'message': f'Execution is already in {execution.status} state'}), 400
    
    workflow_version = WorkflowVersion.query.get(execution.workflow_version_id)
    
    if not workflow_version:
        return jsonify({'message': 'Workflow version not found'}), 404
    
    # Create and run the workflow engine
    engine = WorkflowEngine(workflow_version, execution_id)
    success = engine.execute()
    
    if success:
        return jsonify({
            'message': 'Workflow executed successfully',
            'execution': execution.to_dict()
        }), 200
    else:
        return jsonify({
            'message': 'Workflow execution failed',
            'execution': execution.to_dict()
        }), 500

def register_blueprints(app):
    """Register all blueprints with the Flask app."""
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workflow_bp, url_prefix='/api/workflows')
    app.register_blueprint(node_bp, url_prefix='/api/nodes')
    app.register_blueprint(execution_bp, url_prefix='/api/executions')
    app.register_blueprint(credential_bp, url_prefix='/api/credentials')
    app.register_blueprint(variable_bp, url_prefix='/api/variables')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(template_bp, url_prefix='/api/templates')
    app.register_blueprint(trigger_bp, url_prefix='/api/triggers')
    app.register_blueprint(engine_bp, url_prefix='/api/engine')
