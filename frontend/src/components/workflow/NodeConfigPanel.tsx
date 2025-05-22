import React, { useState } from 'react';
import { Node } from 'reactflow';

interface NodeConfigPanelProps {
  node: Node;
  onChange: (newData: any) => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onChange }) => {
  const [formData, setFormData] = useState(node.data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onChange(newData);
  };

  // Render different configuration options based on node type
  const renderConfigFields = () => {
    switch (node.type) {
      case 'trigger':
        return renderTriggerConfig();
      case 'function':
        return renderFunctionConfig();
      case 'ai':
        return renderAIConfig();
      case 'action':
        return renderActionConfig();
      default:
        return <div>No configuration available for this node type.</div>;
    }
  };

  const renderTriggerConfig = () => {
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="manual">Manual</option>
            <option value="schedule">Schedule</option>
            <option value="webhook">Webhook</option>
            <option value="email">Email</option>
          </select>
        </div>
        
        {formData.type === 'schedule' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cron Expression</label>
            <input
              type="text"
              name="cronExpression"
              value={formData.cronExpression || ''}
              onChange={handleChange}
              placeholder="* * * * *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Format: minute hour day month weekday</p>
          </div>
        )}
        
        {formData.type === 'webhook' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Path</label>
            <input
              type="text"
              name="path"
              value={formData.path || ''}
              onChange={handleChange}
              placeholder="/webhook/my-trigger"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </>
    );
  };

  const renderFunctionConfig = () => {
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Function Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="filter">Filter</option>
            <option value="transform">Transform</option>
            <option value="condition">Condition</option>
            <option value="loop">Loop</option>
          </select>
        </div>
        
        {formData.type === 'filter' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Condition</label>
            <textarea
              name="condition"
              value={formData.condition || ''}
              onChange={handleChange}
              placeholder="item.value > 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
        )}
        
        {formData.type === 'transform' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Transform Expression</label>
            <textarea
              name="expression"
              value={formData.expression || ''}
              onChange={handleChange}
              placeholder="item => ({ ...item, processed: true })"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
        )}
      </>
    );
  };

  const renderAIConfig = () => {
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">AI Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="llm">LLM</option>
            <option value="agent">Agent</option>
            <option value="content-gen">Content Generator</option>
          </select>
        </div>
        
        {formData.type === 'llm' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                name="model"
                value={formData.model || 'gpt-4'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea
                name="prompt"
                value={formData.prompt || ''}
                onChange={handleChange}
                placeholder="Enter your prompt here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={5}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                name="maxTokens"
                value={formData.maxTokens || 1000}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}
        
        {formData.type === 'agent' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <textarea
                name="goal"
                value={formData.goal || ''}
                onChange={handleChange}
                placeholder="Describe the agent's goal..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Steps</label>
              <input
                type="number"
                name="maxSteps"
                value={formData.maxSteps || 5}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}
      </>
    );
  };

  const renderActionConfig = () => {
    return (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="email">Send Email</option>
            <option value="notification">Send Notification</option>
            <option value="http">HTTP Request</option>
            <option value="log">Log</option>
          </select>
        </div>
        
        {formData.type === 'email' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                name="to"
                value={formData.to || ''}
                onChange={handleChange}
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject || ''}
                onChange={handleChange}
                placeholder="Email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea
                name="body"
                value={formData.body || ''}
                onChange={handleChange}
                placeholder="Email body..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={5}
              />
            </div>
          </>
        )}
        
        {formData.type === 'http' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                name="url"
                value={formData.url || ''}
                onChange={handleChange}
                placeholder="https://example.com/api"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                name="method"
                value={formData.method || 'GET'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {renderConfigFields()}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Node description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={2}
        />
      </div>
    </div>
  );
};

export default NodeConfigPanel;
