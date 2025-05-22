import type { Meta, StoryObj } from '@storybook/react';
import Canvas from './Canvas';
import { NodeType } from '@/types/workflow';
import 'reactflow/dist/style.css';

const meta: Meta<typeof Canvas> = {
  title: 'Workflow/Canvas',
  component: Canvas,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Canvas>;

const sampleNodes = [
  {
    id: '1',
    type: NodeType.TRIGGER,
    position: { x: 100, y: 100 },
    data: { label: 'Webhook Trigger' }
  },
  {
    id: '2',
    type: NodeType.FUNCTION,
    position: { x: 300, y: 100 },
    data: { label: 'Process Data' }
  },
  {
    id: '3',
    type: NodeType.AI,
    position: { x: 500, y: 100 },
    data: { label: 'AI Analysis' }
  },
  {
    id: '4',
    type: NodeType.ACTION,
    position: { x: 700, y: 100 },
    data: { label: 'Send Email' }
  }
];

const sampleEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' }
];

export const Empty: Story = {
  args: {
    nodes: [],
    edges: [],
    onNodesChange: () => {},
    onEdgesChange: () => {},
    onConnect: () => {},
    onNodeClick: () => {},
    onEdgeClick: () => {},
    onCanvasClick: () => {},
  }
};

export const WithNodes: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    onNodesChange: () => {},
    onEdgesChange: () => {},
    onConnect: () => {},
    onNodeClick: () => {},
    onEdgeClick: () => {},
    onCanvasClick: () => {},
  }
};

export const ReadOnly: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    readOnly: true,
    onNodesChange: () => {},
    onEdgesChange: () => {},
    onConnect: () => {},
    onNodeClick: () => {},
    onEdgeClick: () => {},
    onCanvasClick: () => {},
  }
}; 