import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowsAPI } from '@/api';
import styles from '@/components/ui/style-guide';

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
    <div className={styles.container}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={styles.heading.h1}>Workflows</h1>
        <button
          onClick={handleCreateWorkflow}
          className={styles.button.primary}
        >
          Create Workflow
        </button>
      </div>

      {error && (
        <div className={styles.alert.error}>
          {error}
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search workflows..."
          className={styles.input}
        />
        <select className={styles.select}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className={styles.select}>
          <option value="updated">Last Modified</option>
          <option value="created">Created Date</option>
          <option value="name">Name</option>
        </select>
      </div>

      {workflows.length === 0 ? (
        <div className={styles.card}>
          <h3 className={styles.heading.h3}>No workflows found</h3>
          <p className="mt-2 text-gray-500">Create your first workflow to get started.</p>
          <button
            onClick={handleCreateWorkflow}
            className={`${styles.button.primary} mt-4`}
          >
            Create Workflow
          </button>
        </div>
      ) : (
        <div className={styles.table.container}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className={styles.table.header}>Name</th>
                <th className={styles.table.header}>Status</th>
                <th className={styles.table.header}>Last Run</th>
                <th className={styles.table.header}>Created By</th>
                <th className={styles.table.header}>Tags</th>
                <th className={styles.table.header}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflows.map((workflow) => (
                <tr key={workflow.id}>
                  <td className={styles.table.row}>
                    <div className="text-sm font-medium text-blue-600">{workflow.name}</div>
                    <div className="text-sm text-gray-500">{workflow.description}</div>
                  </td>
                  <td className={styles.table.row}>
                    <span className={workflow.is_active ? styles.badge.success : styles.badge.inactive}>
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className={styles.table.row}>
                    <div className="text-sm text-gray-500">
                      {new Date(workflow.updated_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className={styles.table.row}>
                    <div className="text-sm text-gray-500">You</div>
                  </td>
                  <td className={styles.table.row}>
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags?.map((tag) => (
                        <span key={tag} className={styles.badge.success}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.table.row}>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/workflows/${workflow.id}`)}
                        className={styles.button.secondary}
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/workflows/${workflow.id}/edit`)}
                        className={styles.button.primary}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleExecuteWorkflow(workflow.id)}
                        className={styles.button.secondary}
                      >
                        Run
                      </button>
                      <button
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        className={styles.button.danger}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
