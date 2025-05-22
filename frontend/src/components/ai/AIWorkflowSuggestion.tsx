import React, { useState } from 'react';
import { aiAPI } from '@/api';

const AIWorkflowSuggestion: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleGenerateSuggestion = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description of the workflow you want to create.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const response = await aiAPI.suggestWorkflow(prompt);
      setSuggestion(response.data.workflow);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate workflow suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Workflow Suggestions</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Describe the workflow you want to create</h2>
        
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a workflow that monitors Twitter for mentions of my company, analyzes sentiment, and sends me a daily report."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        
        <button
          onClick={handleGenerateSuggestion}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? 'Generating...' : 'Generate Workflow Suggestion'}
        </button>
        
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
      
      {suggestion && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Suggested Workflow</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Nodes</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                {suggestion.nodes.map((node: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-1">
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{node.data.name}</p>
                      <p className="text-sm text-gray-500">Type: {node.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Connections</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                {suggestion.edges.map((edge: any, index: number) => (
                  <li key={index}>
                    <p className="text-sm">
                      <span className="font-medium">{edge.source}</span> → <span className="font-medium">{edge.target}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Use This Workflow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWorkflowSuggestion;
