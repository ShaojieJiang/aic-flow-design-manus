import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// Define the data structure for trigger nodes
interface TriggerNodeData {
  name: string;
  type: string;
  description?: string;
}

// Trigger node component
const TriggerNode: React.FC<NodeProps<TriggerNodeData>> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-blue-100">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-800">{data.name}</div>
          <div className="text-xs text-gray-500">{data.type}</div>
        </div>
      </div>
      
      {/* Only output handle for trigger nodes */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

// Define the data structure for function nodes
interface FunctionNodeData {
  name: string;
  type: string;
  description?: string;
}

// Function node component
const FunctionNode: React.FC<NodeProps<FunctionNodeData>> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-green-100">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-800">{data.name}</div>
          <div className="text-xs text-gray-500">{data.type}</div>
        </div>
      </div>
      
      {/* Input and output handles for function nodes */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

// Define the data structure for AI nodes
interface AINodeData {
  name: string;
  type: string;
  model?: string;
  provider?: string;
  description?: string;
}

// AI node component
const AINode: React.FC<NodeProps<AINodeData>> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-purple-100">
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-800">{data.name}</div>
          <div className="text-xs text-gray-500">{data.type}</div>
          {data.model && <div className="text-xs text-purple-500">{data.model}</div>}
        </div>
      </div>
      
      {/* Input and output handles for AI nodes */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

// Define the data structure for action nodes
interface ActionNodeData {
  name: string;
  type: string;
  description?: string;
}

// Action node component
const ActionNode: React.FC<NodeProps<ActionNodeData>> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-red-100">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-800">{data.name}</div>
          <div className="text-xs text-gray-500">{data.type}</div>
        </div>
      </div>
      
      {/* Only input handle for action nodes */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  );
};

export { TriggerNode, FunctionNode, AINode, ActionNode };
