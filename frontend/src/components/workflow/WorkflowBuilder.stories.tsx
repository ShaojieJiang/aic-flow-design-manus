import type { Meta, StoryObj } from '@storybook/react';
import WorkflowBuilder from './WorkflowBuilder';

const meta: Meta<typeof WorkflowBuilder> = {
  title: 'Workflow/WorkflowBuilder',
  component: WorkflowBuilder,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WorkflowBuilder>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default workflow builder with an empty canvas and node library.'
      }
    }
  }
};

export const WithNodes: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Workflow builder with pre-populated nodes.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    // Simulate adding nodes programmatically
    const triggerNode = {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: { label: 'HTTP Trigger' }
    };
    
    const functionNode = {
      id: 'function-1',
      type: 'function',
      position: { x: 300, y: 100 },
      data: { label: 'Process Data' }
    };
    
    const aiNode = {
      id: 'ai-1',
      type: 'ai',
      position: { x: 500, y: 100 },
      data: { label: 'AI Analysis' }
    };
    
    const actionNode = {
      id: 'action-1',
      type: 'action',
      position: { x: 700, y: 100 },
      data: { label: 'Save Results' }
    };
    
    // Add nodes to the flow
    const reactFlowInstance = canvasElement.querySelector('.react-flow');
    if (reactFlowInstance) {
      // @ts-ignore
      reactFlowInstance.setNodes([triggerNode, functionNode, aiNode, actionNode]);
    }
  }
}; 