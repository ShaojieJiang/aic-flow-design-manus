import React, { useState, useCallback, useRef, DragEvent } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  ReactFlowProvider,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TriggerNode, FunctionNode, AINode, ActionNode } from './NodeTypes';
import NodeLibrary from './NodeLibrary';
import NodeConfigPanel from './NodeConfigPanel';

// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  function: FunctionNode,
  ai: AINode,
  action: ActionNode,
};

const WorkflowBuilderContainer: React.FC = () => {
  // Initial empty state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  // Handle drag over event
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow/data'));

      // Check if the drop is valid
      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      // Get the position of the drop
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create a new node
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      // Add the new node to the flow
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handle drag start event in the node library
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string, data: any) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Update node data when configuration changes
  const onNodeConfigChange = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  return (
    <div className="flex h-full">
      {/* Node Library Sidebar */}
      <div className="w-64 h-full">
        <NodeLibrary onDragStart={onDragStart} />
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Node Configuration Panel */}
      {selectedNode && (
        <div className="w-80 h-full border-l border-gray-200">
          <NodeConfigPanel 
            node={selectedNode} 
            onChange={(newData) => onNodeConfigChange(selectedNode.id, newData)} 
          />
        </div>
      )}
    </div>
  );
};

// Wrap with ReactFlowProvider
const WorkflowBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContainer />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
