import React, { useState } from 'react';
import { TriggerNode, FunctionNode, AINode, ActionNode } from './NodeTypes';
import { useReactFlow, ReactFlowProvider, Node } from 'reactflow';

// Define the node types mapping
const nodeTypes = {
  trigger: TriggerNode,
  function: FunctionNode,
  ai: AINode,
  action: ActionNode,
};

interface NodeLibraryProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeData: any) => void;
}

const NodeLibrary: React.FC<NodeLibraryProps> = ({ onDragStart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Node categories
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'triggers', name: 'Triggers' },
    { id: 'functions', name: 'Functions' },
    { id: 'ai', name: 'AI' },
    { id: 'actions', name: 'Actions' },
  ];
  
  // Node definitions
  const nodes = [
    {
      id: 'manual-trigger',
      type: 'trigger',
      category: 'triggers',
      name: 'Manual Trigger',
      description: 'Start workflow manually',
      data: { name: 'Manual Trigger', type: 'manual' }
    },
    {
      id: 'schedule-trigger',
      type: 'trigger',
      category: 'triggers',
      name: 'Schedule',
      description: 'Run on a schedule',
      data: { name: 'Schedule', type: 'schedule' }
    },
    {
      id: 'webhook-trigger',
      type: 'trigger',
      category: 'triggers',
      name: 'Webhook',
      description: 'Trigger via HTTP request',
      data: { name: 'Webhook', type: 'webhook' }
    },
    {
      id: 'filter-function',
      type: 'function',
      category: 'functions',
      name: 'Filter',
      description: 'Filter data based on conditions',
      data: { name: 'Filter', type: 'filter' }
    },
    {
      id: 'transform-function',
      type: 'function',
      category: 'functions',
      name: 'Transform',
      description: 'Transform data format',
      data: { name: 'Transform', type: 'transform' }
    },
    {
      id: 'condition-function',
      type: 'function',
      category: 'functions',
      name: 'Condition',
      description: 'Branch based on conditions',
      data: { name: 'Condition', type: 'condition' }
    },
    {
      id: 'llm-node',
      type: 'ai',
      category: 'ai',
      name: 'LLM',
      description: 'Process text with language model',
      data: { name: 'LLM', type: 'llm', model: 'GPT-4' }
    },
    {
      id: 'agent-node',
      type: 'ai',
      category: 'ai',
      name: 'Agent',
      description: 'Execute autonomous tasks',
      data: { name: 'Agent', type: 'agent' }
    },
    {
      id: 'content-gen-node',
      type: 'ai',
      category: 'ai',
      name: 'Content Generator',
      description: 'Generate content with AI',
      data: { name: 'Content Generator', type: 'content-gen' }
    },
    {
      id: 'email-action',
      type: 'action',
      category: 'actions',
      name: 'Send Email',
      description: 'Send an email notification',
      data: { name: 'Send Email', type: 'email' }
    },
    {
      id: 'notification-action',
      type: 'action',
      category: 'actions',
      name: 'Notification',
      description: 'Send a notification',
      data: { name: 'Notification', type: 'notification' }
    },
    {
      id: 'http-action',
      type: 'action',
      category: 'actions',
      name: 'HTTP Request',
      description: 'Make an HTTP request',
      data: { name: 'HTTP Request', type: 'http' }
    },
  ];
  
  // Filter nodes by active category
  const filteredNodes = activeCategory === 'all' 
    ? nodes 
    : nodes.filter(node => node.category === activeCategory);
  
  return (
    <div className="bg-white border-r border-gray-200 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Library</h2>
      
      {/* Category tabs */}
      <div className="flex flex-wrap mb-4 gap-1">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1 text-sm rounded-md ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search nodes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {/* Node list */}
      <div className="space-y-2">
        {filteredNodes.map(node => {
          // Determine node color based on type
          let borderColor = 'border-gray-300';
          if (node.type === 'trigger') borderColor = 'border-blue-500';
          if (node.type === 'function') borderColor = 'border-green-500';
          if (node.type === 'ai') borderColor = 'border-purple-500';
          if (node.type === 'action') borderColor = 'border-red-500';
          
          return (
            <div
              key={node.id}
              className={`p-2 border-l-4 ${borderColor} bg-white rounded shadow-sm cursor-grab hover:shadow`}
              draggable
              onDragStart={(event) => onDragStart(event, node.type, node.data)}
            >
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-gray-500">{node.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeLibrary;
