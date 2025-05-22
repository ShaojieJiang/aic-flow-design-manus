from flask import Blueprint

def register_blueprints(app):
    """Register all blueprints with the Flask app"""
    from src.routes.auth import auth_bp
    from src.routes.workflow import workflow_bp
    from src.routes.node import node_bp
    from src.routes.execution import execution_bp
    from src.routes.credential import credential_bp, variable_bp
    from src.routes.ai import ai_bp, template_bp
    from src.routes.trigger import trigger_bp
    from src.routes.engine import engine_bp
    from src.routes.user import user_bp
    
    # Register all blueprints with API prefix
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
    app.register_blueprint(user_bp, url_prefix='/api/users')
