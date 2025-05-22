import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CanvasProps, Node as WorkflowNode } from '@/types/workflow';
import { flowStyles } from '@/components/ui/style-guide';
import TriggerNode from './nodes/TriggerNode';
import FunctionNode from './nodes/FunctionNode';
import AINode from './nodes/AINode';
import ActionNode from './nodes/ActionNode';

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  function: FunctionNode,
  ai: AINode,
  action: ActionNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#3498db', strokeWidth: 2 },
};

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  readOnly = false,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onCanvasClick,
}) => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes as Node[]}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => onNodeClick(node as WorkflowNode)}
          onEdgeClick={(_, edge) => onEdgeClick(edge)}
          onPaneClick={onCanvasClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          style={{ background: '#f5f7fa' }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default Canvas; 