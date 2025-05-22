import React, { useState } from 'react';
import { aiAPI } from '@/api';

const AINodeTester: React.FC = () => {
  const [nodeType, setNodeType] = useState('llm');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  
  // LLM node fields
  const [llmModel, setLlmModel] = useState('gpt-4');
  const [llmPrompt, setLlmPrompt] = useState('');
  const [llmMaxTokens, setLlmMaxTokens] = useState(1000);
  
  // Agent node fields
  const [agentType, setAgentType] = useState('general');
  const [agentGoal, setAgentGoal] = useState('');
  const [agentMaxSteps, setAgentMaxSteps] = useState(5);
  
  // Content generation fields
  const [contentType, setContentType] = useState('text');
  const [contentPrompt, setContentPrompt] = useState('');

  const handleTestNode = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      let response;
      
      if (nodeType === 'llm') {
        if (!llmPrompt.trim()) {
          setError('Please enter a prompt for the LLM node.');
          setIsLoading(false);
          return;
        }
        
        response = await aiAPI.processLLM({
          model: llmModel,
          provider: 'openai',
          prompt: llmPrompt,
          max_tokens: parseInt(llmMaxTokens.toString())
        });
      } else if (nodeType === 'agent') {
        if (!agentGoal.trim()) {
          setError('Please enter a goal for the Agent node.');
          setIsLoading(false);
          return;
        }
        
        response = await aiAPI.processAgent({
          agent_type: agentType,
          goal: agentGoal,
          model: 'gpt-4',
          provider: 'openai',
          max_steps: parseInt(agentMaxSteps.toString())
        });
      } else if (nodeType === 'content') {
        if (!contentPrompt.trim()) {
          setError('Please enter a prompt for content generation.');
          setIsLoading(false);
          return;
        }
        
        response = await aiAPI.generateContent({
          content_type: contentType,
          prompt: contentPrompt,
          model: 'gpt-4',
          provider: 'openai'
        });
      }
      
      setResult(response?.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to test AI node');
    } finally {
      setIsLoading(false);
    }
  };

  const renderNodeForm = () => {
    switch (nodeType) {
      case 'llm':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
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
                value={llmPrompt}
                onChange={(e) => setLlmPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={5}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                value={llmMaxTokens}
                onChange={(e) => setLlmMaxTokens(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        );
        
      case 'agent':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
              <select
                value={agentType}
                onChange={(e) => setAgentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">General</option>
                <option value="research">Research</option>
                <option value="data-analysis">Data Analysis</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <textarea
                value={agentGoal}
                onChange={(e) => setAgentGoal(e.target.value)}
                placeholder="Describe the agent's goal..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Steps</label>
              <input
                type="number"
                value={agentMaxSteps}
                onChange={(e) => setAgentMaxSteps(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        );
        
      case 'content':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="code">Code</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea
                value={contentPrompt}
                onChange={(e) => setContentPrompt(e.target.value)}
                placeholder="Describe the content you want to generate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Node Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Test AI Node</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Node Type</label>
            <select
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="llm">LLM Node</option>
              <option value="agent">Agent Node</option>
              <option value="content">Content Generation</option>
            </select>
          </div>
          
          {renderNodeForm()}
          
          <button
            onClick={handleTestNode}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Processing...' : 'Test Node'}
          </button>
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Result</h2>
          
          {result ? (
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {isLoading ? 'Processing...' : 'No result yet. Test a node to see results.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AINodeTester;
