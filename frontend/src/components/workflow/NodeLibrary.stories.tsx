import type { Meta, StoryObj } from '@storybook/react';
import NodeLibrary from './NodeLibrary';
import { ReactFlowProvider } from 'reactflow';

const meta: Meta<typeof NodeLibrary> = {
  title: 'Workflow/NodeLibrary',
  component: NodeLibrary,
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div style={{ width: '300px', height: '600px' }}>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NodeLibrary>;

export const Default: Story = {
  args: {
    onDragStart: (event, nodeType, nodeData) => {
      console.log('Drag started:', { nodeType, nodeData });
    }
  }
};

export const WithActiveCategory: Story = {
  args: {
    onDragStart: (event, nodeType, nodeData) => {
      console.log('Drag started:', { nodeType, nodeData });
    }
  },
  play: async ({ canvasElement }) => {
    // Simulate clicking on a category
    const triggersButton = canvasElement.querySelector('button:nth-child(2)');
    if (triggersButton) {
      triggersButton.click();
    }
  }
};

export const WithSearch: Story = {
  args: {
    onDragStart: (event, nodeType, nodeData) => {
      console.log('Drag started:', { nodeType, nodeData });
    }
  },
  play: async ({ canvasElement }) => {
    // Simulate typing in search
    const searchInput = canvasElement.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.value = 'HTTP';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}; 