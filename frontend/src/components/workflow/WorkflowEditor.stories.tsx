import type { Meta, StoryObj } from '@storybook/react';
import WorkflowEditor from './WorkflowEditor';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof WorkflowEditor> = {
  title: 'Workflow/WorkflowEditor',
  component: WorkflowEditor,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    mockData: [
      {
        url: '/api/workflows/1',
        method: 'GET',
        status: 200,
        response: {
          workflow: {
            id: 1,
            name: 'Data Processing Pipeline',
            description: 'Process and analyze data from multiple sources',
            created_at: '2024-03-15T10:00:00Z',
            updated_at: '2024-03-16T15:30:00Z',
            is_active: true,
            is_public: false,
            tags: ['data', 'processing']
          }
        }
      }
    ]
  }
};

export default meta;
type Story = StoryObj<typeof WorkflowEditor>;

export const New: Story = {
  args: {
    isNew: true
  }
};

export const Edit: Story = {
  args: {
    isNew: false
  }
};

export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/workflows/1',
        method: 'GET',
        status: 200,
        delay: 2000,
        response: {
          workflow: {
            id: 1,
            name: 'Data Processing Pipeline',
            description: 'Process and analyze data from multiple sources',
            created_at: '2024-03-15T10:00:00Z',
            updated_at: '2024-03-16T15:30:00Z',
            is_active: true,
            is_public: false,
            tags: ['data', 'processing']
          }
        }
      }
    ]
  }
};

export const Error: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/workflows/1',
        method: 'GET',
        status: 500,
        response: {
          message: 'Failed to fetch workflow'
        }
      }
    ]
  }
}; 