import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { executionsAPI } from '@/api';

interface Execution {
  id: number;
  workflow_id: number;
  workflow_version_id: number;
  status: string;
  started_at: string;
  finished_at?: string;
  error_message?: string;
  trigger_type: string;
  triggered_by: number;
}

interface ExecutionLog {
  id: number;
  execution_id: number;
  node_id: string;
  status: string;
  started_at: string;
  finished_at?: string;
  error_message?: string;
  input_data?: any;
  output_data?: any;
}

const ExecutionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [execution, setExecution] = useState<Execution | null>(null);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExecution = async () => {
      try {
        const executionResponse = await executionsAPI.getById(Number(id));
        setExecution(executionResponse.data.execution);
        
        const logsResponse = await executionsAPI.getLogs(Number(id));
        setLogs(logsResponse.data.logs);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch execution details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecution();
  }, [id]);

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

  if (!execution) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Execution not found'}
        </div>
        <button
          onClick={() => navigate('/executions')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back to Executions
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Execution #{execution.id}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/workflows/${execution.workflow_id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            View Workflow
          </button>
          <button
            onClick={() => navigate('/executions')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Executions
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Execution Details</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(execution.status)}`}>
                  {execution.status.toUpperCase()}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Workflow ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{execution.workflow_id}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Started At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(execution.started_at).toLocaleString()}
              </dd>
            </div>
            {execution.finished_at && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Finished At</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(execution.finished_at).toLocaleString()}
                </dd>
              </div>
            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Trigger Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{execution.trigger_type}</dd>
            </div>
            {execution.error_message && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Error Message</dt>
                <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">{execution.error_message}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Execution Logs</h2>
      
      {logs.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No logs found for this execution.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Node ID: {log.node_id}</p>
                        <p className="text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {log.status.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.started_at).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {log.output_data && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">Output:</p>
                      <pre className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(log.output_data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {log.error_message && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-500">Error:</p>
                      <pre className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-40">
                        {log.error_message}
                      </pre>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExecutionDetail;
