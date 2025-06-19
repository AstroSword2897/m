import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  type Node, 
  type Edge, 
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';

import 'reactflow/dist/style.css';

// Initial nodes and edges for a basic example
const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'My Concept' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Related Idea' } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', label: 'connects to' }];

const ConceptMapCreator: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeLabel, setNewNodeLabel] = useState('');

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds: Edge[]) => addEdge(connection, eds));
  }, [setEdges]);

  const addNode = () => {
    if (newNodeLabel.trim() === '') return;
    const newNode: Node = {
      id: String(nodes.length + 1),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: newNodeLabel },
    };
    setNodes((nds: Node[]) => nds.concat(newNode));
    setNewNodeLabel('');
  };

  return (
    <div className="concept-map-creator" style={{ width: '100%', height: '500px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={newNodeLabel}
          onChange={(e) => setNewNodeLabel(e.target.value)}
          placeholder="New node label"
        />
        <button onClick={addNode}>Add Node</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ConceptMapCreator; 