import React, { useState, useEffect } from 'react';
import { workflowsAPI, executionsAPI, aiAPI } from '@/api';

const Dashboard: React.FC = () => {
  const [recentWorkflows, setRecentWorkflows] = useState<any[]>([]);
  const [recentExecutions, setRecentExecutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent workflows
        const workflowsResponse = await workflowsAPI.getAll({ limit: 5, sort: 'updated_at:desc' });
        setRecentWorkflows(workflowsResponse.data.workflows || []);
        
        // Fetch recent executions
        const executionsResponse = await executionsAPI.getAll({ limit: 5, sort: 'started_at:desc' });
        setRecentExecutions(executionsResponse.data.executions || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a 
              href="/workflows/new" 
              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-blue-700">New Workflow</span>
            </a>
            <a 
              href="/ai/suggestions" 
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
            >
              <svg className="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium text-purple-700">AI Suggestions</span>
            </a>
            <a 
              href="/ai/tester" 
              className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100"
            >
              <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <span className="text-sm font-medium text-green-700">Test AI Nodes</span>
            </a>
            <a 
              href="/workflows" 
              className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100"
            >
              <svg className="w-8 h-8 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium text-yellow-700">All Workflows</span>
            </a>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Platform Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">AI Services</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Workflow Engine</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Workflows */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Workflows</h2>
          
          {recentWorkflows.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No workflows found. Create your first workflow to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorkflows.map((workflow) => (
                <a 
                  key={workflow.id}
                  href={`/workflows/${workflow.id}`}
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-blue-600">{workflow.name}</h3>
                      <p className="text-sm text-gray-500">{workflow.description || 'No description'}</p>
                    </div>
                    {workflow.is_active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                </a>
              ))}
              
              <div className="text-center pt-2">
                <a href="/workflows" className="text-sm text-blue-600 hover:text-blue-800">
                  View all workflows →
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Recent Executions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Executions</h2>
          
          {recentExecutions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No executions found. Run a workflow to see executions here.
            </div>
          ) : (
            <div className="space-y-3">
              {recentExecutions.map((execution) => (
                <a 
                  key={execution.id}
                  href={`/executions/${execution.id}`}
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Execution #{execution.id}</h3>
                      <p className="text-sm text-gray-500">
                        Workflow ID: {execution.workflow_id}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                      {execution.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(execution.started_at).toLocaleString()}
                  </div>
                </a>
              ))}
              
              <div className="text-center pt-2">
                <a href="/executions" className="text-sm text-blue-600 hover:text-blue-800">
                  View all executions →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
