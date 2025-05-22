import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { NodeType } from '@/types/workflow';

const AINode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <BaseNode
      type={NodeType.AI}
      label={data.label}
      selected={selected}
    />
  );
};

export default AINode; 