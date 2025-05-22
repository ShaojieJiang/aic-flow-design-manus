export enum NodeType {
  TRIGGER = 'trigger',
  FUNCTION = 'function',
  AI = 'ai',
  ACTION = 'action'
}

export interface Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

export interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  readOnly?: boolean;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick: (node: Node) => void;
  onEdgeClick: (edge: Edge) => void;
  onCanvasClick: () => void;
} 