from src.ai.handlers import LLMNodeHandler, AgentNodeHandler, ContentGenerationNodeHandler, WorkflowSuggestionEngine
import os
import json

class AIService:
    """
    Service for managing AI capabilities in the workflow platform.
    """
    
    @staticmethod
    def process_llm_node(node_data, input_data=None):
        """Process an LLM node and return the result."""
        handler = LLMNodeHandler(node_data, input_data)
        return handler.process()
    
    @staticmethod
    def process_agent_node(node_data, input_data=None):
        """Process an Agent node and return the result."""
        handler = AgentNodeHandler(node_data, input_data)
        return handler.process()
    
    @staticmethod
    def process_content_generation_node(node_data, input_data=None):
        """Process a Content Generation node and return the result."""
        handler = ContentGenerationNodeHandler(node_data, input_data)
        return handler.process()
    
    @staticmethod
    def generate_workflow_suggestion(prompt, user_id):
        """Generate a workflow suggestion based on a natural language prompt."""
        engine = WorkflowSuggestionEngine(prompt, user_id)
        return engine.generate_suggestion()
    
    @staticmethod
    def get_available_models(model_type=None):
        """Get a list of available AI models."""
        # In a real implementation, this would query the database or external APIs
        # For now, we'll return a static list
        models = [
            {
                "id": "gpt-4",
                "name": "GPT-4",
                "provider": "openai",
                "type": "llm",
                "description": "Advanced language model from OpenAI"
            },
            {
                "id": "gpt-3.5-turbo",
                "name": "GPT-3.5 Turbo",
                "provider": "openai",
                "type": "llm",
                "description": "Efficient language model from OpenAI"
            },
            {
                "id": "claude-3-opus",
                "name": "Claude 3 Opus",
                "provider": "anthropic",
                "type": "llm",
                "description": "Advanced language model from Anthropic"
            },
            {
                "id": "claude-3-sonnet",
                "name": "Claude 3 Sonnet",
                "provider": "anthropic",
                "type": "llm",
                "description": "Balanced language model from Anthropic"
            },
            {
                "id": "gemini-pro",
                "name": "Gemini Pro",
                "provider": "google",
                "type": "llm",
                "description": "Advanced language model from Google"
            },
            {
                "id": "agent-basic",
                "name": "Basic Agent",
                "provider": "internal",
                "type": "agent",
                "description": "Basic autonomous agent for simple tasks"
            },
            {
                "id": "agent-advanced",
                "name": "Advanced Agent",
                "provider": "internal",
                "type": "agent",
                "description": "Advanced autonomous agent for complex tasks"
            },
            {
                "id": "dalle-3",
                "name": "DALL-E 3",
                "provider": "openai",
                "type": "image",
                "description": "Image generation model from OpenAI"
            }
        ]
        
        if model_type:
            return [model for model in models if model["type"] == model_type]
        
        return models
