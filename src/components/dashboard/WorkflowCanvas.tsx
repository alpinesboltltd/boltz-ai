/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import { Plus, Play, Trash2 } from "lucide-react";

interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: any;
}

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onNodeSelect: (node: WorkflowNode | null) => void;
  selectedNode: WorkflowNode | null;
}

export function WorkflowCanvas({
  nodes,
  onNodesChange,
  onNodeSelect,
  selectedNode,
}: WorkflowCanvasProps) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const nodeTypes = [
    {
      type: "trigger",
      label: "Trigger",
      color: "bg-green-100 border-green-300 text-green-700",
    },
    {
      type: "message",
      label: "Message",
      color: "bg-blue-100 border-blue-300 text-blue-700",
    },
    {
      type: "api_call",
      label: "API Call",
      color: "bg-purple-100 border-purple-300 text-purple-700",
    },
    {
      type: "condition",
      label: "Condition",
      color: "bg-yellow-100 border-yellow-300 text-yellow-700",
    },
    {
      type: "delay",
      label: "Delay",
      color: "bg-gray-100 border-gray-300 text-gray-700",
    },
    {
      type: "email",
      label: "Email",
      color: "bg-red-100 border-red-300 text-red-700",
    },
  ];

  const getNodeColor = (type: string) => {
    return (
      nodeTypes.find((nt) => nt.type === type)?.color ||
      "bg-gray-100 border-gray-300 text-gray-700"
    );
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedNode(nodeId);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedNode) return;

      const canvas = document.getElementById("workflow-canvas");
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      onNodesChange(
        nodes.map((node) =>
          node.id === draggedNode
            ? {
                ...node,
                position: { x: Math.max(0, newX), y: Math.max(0, newY) },
              }
            : node
        )
      );
    },
    [draggedNode, dragOffset, nodes, onNodesChange]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  React.useEffect(() => {
    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  const addNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
      position: { x: 100 + nodes.length * 200, y: 100 },
      data: {},
    };
    onNodesChange([...nodes, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    onNodesChange(nodes.filter((n) => n.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      onNodeSelect(null);
    }
  };

  const renderConnections = () => {
    return nodes.map((node, index) => {
      if (index === nodes.length - 1) return null;
      const nextNode = nodes[index + 1];

      return (
        <svg
          key={`connection-${node.id}-${nextNode.id}`}
          className="absolute pointer-events-none"
          style={{
            left: node.position.x + 120,
            top: node.position.y + 30,
            width: nextNode.position.x - node.position.x - 120,
            height: Math.abs(nextNode.position.y - node.position.y) + 60,
          }}
        >
          <path
            d={`M 0 30 Q ${(nextNode.position.x - node.position.x - 120) / 2} 30 ${nextNode.position.x - node.position.x - 120} ${nextNode.position.y - node.position.y + 30}`}
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>
          </defs>
        </svg>
      );
    });
  };

  return (
    <div className="flex h-full">
      {/* Node Palette */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <h3 className="font-medium text-gray-900 mb-4">Add Nodes</h3>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => addNode(nodeType.type)}
              className={`w-full p-3 rounded-lg border-2 border-dashed ${nodeType.color} hover:opacity-80 transition-opacity flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              {nodeType.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 relative overflow-auto bg-gray-25"
        id="workflow-canvas"
      >
        <div className="absolute inset-0 min-w-full min-h-full">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #6B7280 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Connections */}
          {renderConnections()}

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-32 h-16 rounded-lg border-2 cursor-move select-none ${getNodeColor(node.type)} ${
                selectedNode?.id === node.id ? "ring-2 ring-primary-500" : ""
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={() => onNodeSelect(node)}
            >
              <div className="p-2 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">
                    {node.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-xs opacity-75">{node.type}</div>
              </div>

              {/* Connection Points */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
            </div>
          ))}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Build Your Workflow
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding a trigger node from the left panel
                </p>
                <button
                  onClick={() => addNode("trigger")}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Trigger
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
