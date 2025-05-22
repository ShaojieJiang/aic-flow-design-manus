import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { NodeType } from '@/types/workflow';

const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <BaseNode
      type={NodeType.ACTION}
      label={data.label}
      selected={selected}
    />
  );
};

export default ActionNode; 