import type { Meta, StoryObj } from '@storybook/react';
import NodeConfigPanel from './NodeConfigPanel';
import { Node } from 'reactflow';

const meta: Meta<typeof NodeConfigPanel> = {
  title: 'Workflow/NodeConfigPanel',
  component: NodeConfigPanel,
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '600px', border: '1px solid #ccc' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NodeConfigPanel>;

const createNode = (type: string, data: any): Node => ({
  id: '1',
  type,
  position: { x: 0, y: 0 },
  data,
});

export const TriggerNode: Story = {
  args: {
    node: createNode('trigger', {
      type: 'webhook',
      path: '/webhook/my-trigger'
    }),
    onChange: (newData) => console.log('Trigger config changed:', newData)
  }
};

export const FunctionNode: Story = {
  args: {
    node: createNode('function', {
      type: 'filter',
      condition: 'item.value > 10'
    }),
    onChange: (newData) => console.log('Function config changed:', newData)
  }
};

export const AINode: Story = {
  args: {
    node: createNode('ai', {
      type: 'llm',
      model: 'gpt-4',
      prompt: 'Analyze the following data:',
      maxTokens: 1000
    }),
    onChange: (newData) => console.log('AI config changed:', newData)
  }
};

export const ActionNode: Story = {
  args: {
    node: createNode('action', {
      type: 'email',
      to: 'user@example.com',
      subject: 'Workflow Notification',
      body: 'Your workflow has completed successfully.'
    }),
    onChange: (newData) => console.log('Action config changed:', newData)
  }
}; 