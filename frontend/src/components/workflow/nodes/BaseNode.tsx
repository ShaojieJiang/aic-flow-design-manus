import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeType } from '@/types/workflow';
import styles from '@/components/ui/style-guide';

interface BaseNodeProps {
  type: NodeType;
  label: string;
  selected?: boolean;
}

const BaseNode: React.FC<BaseNodeProps> = ({ type, label, selected }) => {
  const nodeStyle = styles.node[type];
  const containerStyle = `${styles.node.container} ${nodeStyle} ${selected ? 'ring-2 ring-blue-500' : ''}`;

  return (
    <div className={containerStyle}>
      <Handle type="target" position={Position.Left} />
      <div className="text-sm font-medium">{label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default BaseNode; 