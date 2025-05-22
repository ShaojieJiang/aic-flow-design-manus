import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowsAPI } from '@/api';

interface Workflow {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_public: boolean;
  tags?: string[];
}

const WorkflowList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await workflowsAPI.getAll();
        setWorkflows(response.data.workflows || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch workflows');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const handleCreateWorkflow = async () => {
    try {
      const response = await workflowsAPI.create({
        name: 'New Workflow',
        description: 'A new workflow',
        is_active: true,
        is_public: false,
        tags: ['new']
      });
      
      navigate(`/workflows/${response.data.workflow.id}/edit`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create workflow');
    }
  };

  const handleDeleteWorkflow = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) {
      return;
    }
    
    try {
      await workflowsAPI.delete(id);
      setWorkflows(workflows.filter(workflow => workflow.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete workflow');
    }
  };

  const handleExecuteWorkflow = async (id: number) => {
    try {
      const response = await workflowsAPI.execute(id);
      navigate(`/executions/${response.data.execution.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute workflow');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
        <button
          onClick={handleCreateWorkflow}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Workflow
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {workflows.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">No workflows found</h3>
          <p className="mt-2 text-gray-500">Create your first workflow to get started.</p>
          <button
            onClick={handleCreateWorkflow}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Workflow
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {workflows.map((workflow) => (
              <li key={workflow.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-lg font-medium text-blue-600 truncate">{workflow.name}</p>
                        <p className="text-sm text-gray-500">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/workflows/${workflow.id}`)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/workflows/${workflow.id}/edit`)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleExecuteWorkflow(workflow.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Run
                      </button>
                      <button
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {workflow.is_active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        {workflow.tags && workflow.tags.map((tag) => (
                          <span key={tag} className="mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Updated {new Date(workflow.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
