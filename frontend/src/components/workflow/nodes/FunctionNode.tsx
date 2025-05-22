import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { NodeType } from '@/types/workflow';

const FunctionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <BaseNode
      type={NodeType.FUNCTION}
      label={data.label}
      selected={selected}
    />
  );
};

export default FunctionNode; 