import { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Save, Plus } from 'lucide-react';

interface WorkflowBuilderV2Props {
  onSave: (workflow: { nodes: Node[]; edges: Edge[] }) => void;
  onCancel: () => void;
}

const nodeTypes = {
  trigger: { label: 'Trigger', color: '#10b981' },
  action: { label: 'Action', color: '#3b82f6' },
  condition: { label: 'Condition', color: '#f59e0b' },
  api: { label: 'API Call', color: '#8b5cf6' },
  webhook: { label: 'Webhook', color: '#ef4444' },
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Start Trigger' },
    style: { backgroundColor: '#10b981', color: 'white' },
  },
];

export function WorkflowBuilderV2({ onSave, onCancel }: WorkflowBuilderV2Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeType, setSelectedNodeType] = useState<string>('action');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: `${nodeTypes[selectedNodeType as keyof typeof nodeTypes]?.label || 'Node'}` },
      style: {
        backgroundColor: nodeTypes[selectedNodeType as keyof typeof nodeTypes]?.color || '#6b7280',
        color: 'white',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '10px'
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes.length, selectedNodeType, setNodes]);

  const handleSave = () => {
    onSave({ nodes, edges });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Visual Workflow Builder</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Save className="w-4 h-4" />
              Save Workflow
            </button>
            <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Add Nodes</h3>

            <div className="mb-4">
              <select
                value={selectedNodeType}
                onChange={(e) => setSelectedNodeType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {Object.entries(nodeTypes).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={addNode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Node Types</h4>
              <div className="space-y-2">
                {Object.entries(nodeTypes).map(([key, { label, color }]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              className="bg-gray-100"
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}