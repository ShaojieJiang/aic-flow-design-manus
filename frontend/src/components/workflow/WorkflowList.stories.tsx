import type { Meta, StoryObj } from '@storybook/react';
import WorkflowList from './WorkflowList';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof WorkflowList> = {
  title: 'Workflow/WorkflowList',
  component: WorkflowList,
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
        url: '/api/workflows',
        method: 'GET',
        status: 200,
        response: {
          workflows: [
            {
              id: 1,
              name: 'Data Processing Pipeline',
              description: 'Process and analyze data from multiple sources',
              created_at: '2024-03-15T10:00:00Z',
              updated_at: '2024-03-16T15:30:00Z',
              is_active: true,
              is_public: false,
              tags: ['data', 'processing']
            },
            {
              id: 2,
              name: 'ML Model Training',
              description: 'Train and evaluate machine learning models',
              created_at: '2024-03-14T09:00:00Z',
              updated_at: '2024-03-15T11:20:00Z',
              is_active: true,
              is_public: true,
              tags: ['ml', 'training']
            },
            {
              id: 3,
              name: 'API Integration',
              description: 'Connect and sync data with external APIs',
              created_at: '2024-03-13T14:00:00Z',
              updated_at: '2024-03-14T16:45:00Z',
              is_active: false,
              is_public: false,
              tags: ['api', 'integration']
            }
          ]
        }
      }
    ]
  }
};

export default meta;
type Story = StoryObj<typeof WorkflowList>;

export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/workflows',
        method: 'GET',
        status: 200,
        response: {
          workflows: []
        }
      }
    ]
  }
};

export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/workflows',
        method: 'GET',
        status: 200,
        delay: 2000,
        response: {
          workflows: []
        }
      }
    ]
  }
};

export const Error: Story = {
  parameters: {
    mockData: [
      {
        url: '/api/workflows',
        method: 'GET',
        status: 500,
        response: {
          message: 'Failed to fetch workflows'
        }
      }
    ]
  }
}; 