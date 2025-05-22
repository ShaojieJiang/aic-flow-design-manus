import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workflowsAPI } from '@/api';
import WorkflowBuilder from './WorkflowBuilder';

interface WorkflowEditorProps {
  isNew?: boolean;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ isNew = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (isNew) {
        setWorkflow({
          name: 'New Workflow',
          description: '',
          is_active: true,
          is_public: false,
        });
        setWorkflowName('New Workflow');
        setWorkflowDescription('');
        setIsLoading(false);
        return;
      }

      try {
        const response = await workflowsAPI.getById(Number(id));
        setWorkflow(response.data.workflow);
        setWorkflowName(response.data.workflow.name);
        setWorkflowDescription(response.data.workflow.description);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch workflow');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [id, isNew]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isNew) {
        const response = await workflowsAPI.create({
          name: workflowName,
          description: workflowDescription,
          is_active: true,
          is_public: false,
        });
        navigate(`/workflows/${response.data.workflow.id}/edit`);
      } else {
        await workflowsAPI.update(Number(id), {
          name: workflowName,
          description: workflowDescription,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save workflow');
    } finally {
      setIsSaving(false);
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
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-xl font-bold border-none focus:outline-none focus:ring-0 w-full"
              placeholder="Workflow Name"
            />
            <input
              type="text"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="text-sm text-gray-500 border-none focus:outline-none focus:ring-0 w-full mt-1"
              placeholder="Add a description..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/workflows')}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <WorkflowBuilder />
      </div>
    </div>
  );
};

export default WorkflowEditor;
