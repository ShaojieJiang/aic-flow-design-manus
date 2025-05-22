import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';
import { NodeType } from '@/types/workflow';

const TriggerNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <BaseNode
      type={NodeType.TRIGGER}
      label={data.label}
      selected={selected}
    />
  );
};

export default TriggerNode; 