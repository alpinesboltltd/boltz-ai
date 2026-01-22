import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, X } from "lucide-react";

import { SequentialWorkflowFormData } from "@/schemas/actionSchemas";

interface SequentialWorkflowBuilderProps {
  onSave: (workflow: SequentialWorkflowFormData) => void;
  onCancel: () => void;
  initialWorkflow?: Partial<SequentialWorkflowFormData>;
  availableApiFunctions?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export function SequentialWorkflowBuilder({
  onSave,
  onCancel,
  initialWorkflow,
  // availableApiFunctions = [],
}: SequentialWorkflowBuilderProps) {
  const [nodes, setNodes] = useState(
    initialWorkflow?.steps?.map((step, index) => ({
      id: step.id || `node_${index}`,
      type: step.type,
      name: step.name,
      position: { x: 100 + index * 200, y: 100 },
      data: step,
    })) || []
  );

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialWorkflow?.name || "",
      description: initialWorkflow?.description || "",
      trigger: initialWorkflow?.trigger || { type: "keyword", value: "" },
    },
  });

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
    setShowConfigPanel(!!node);
  };

  const handleNodeUpdate = (updatedNode: any) => {
    setNodes(
      nodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
  };

  const onSubmit = (formData: any) => {
    const workflowData = {
      ...formData,
      steps: nodes.map((node) => ({
        ...node.data,
        id: node.id,
        name: node.name,
        type: node.type,
      })),
    };
    onSave(workflowData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Sequential Workflow Builder</h2>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              form="workflow-form"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Save className="w-4 h-4" />
              Save Workflow
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Form */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name *
                </label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Customer Support Escalation"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Automatically escalate complex issues to human agents"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger *
              </label>
              <div className="flex gap-3">
                <select
                  {...register("trigger.type")}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="keyword">Keyword</option>
                  <option value="intent">Intent</option>
                  <option value="sentiment">Sentiment</option>
                  <option value="condition">Condition</option>
                  <option value="manual">Manual</option>
                  <option value="schedule">Schedule</option>
                </select>
                <input
                  {...register("trigger.value")}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter trigger value (e.g., 'escalate', 'human agent')"
                />
              </div>
              {errors.trigger?.value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.trigger.value.message}
                </p>
              )}
            </div>
          </div>

          {/* Visual Workflow Canvas */}
          <div className="flex-1 flex">
            {/* Node Palette */}
            <div className="w-64 bg-gray-50 border-r p-4">
              <h3 className="font-medium text-gray-900 mb-4">Workflow Nodes</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const newNode = {
                      id: `message_${Date.now()}`,
                      type: "message" as const,
                      name: "Send Message",
                      position: { x: 50 + nodes.length * 200, y: 50 },
                      data: {
                        id: `message_${Date.now()}`,
                        type: "message" as const,
                        name: "Send Message",
                        messageText: "",
                      },
                    };
                    setNodes([...nodes, newNode]);
                  }}
                  className="w-full p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2"
                >
                  💬 Message
                </button>
                <button
                  onClick={() => {
                    const newNode = {
                      id: `api_${Date.now()}`,
                      type: "api_call" as const,
                      name: "API Call",
                      position: { x: 50 + nodes.length * 200, y: 50 },
                      data: {
                        id: `api_${Date.now()}`,
                        type: "api_call" as const,
                        name: "API Call",
                        method: "GET" as const,
                        url: "",
                      },
                    };
                    setNodes([...nodes, newNode]);
                  }}
                  className="w-full p-3 bg-purple-100 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2"
                >
                  🔗 API Call
                </button>
                <button
                  onClick={() => {
                    const newNode = {
                      id: `condition_${Date.now()}`,
                      type: "condition" as const,
                      name: "Condition",
                      position: { x: 50 + nodes.length * 200, y: 50 },
                      data: {
                        id: `condition_${Date.now()}`,
                        type: "condition" as const,
                        name: "Condition",
                        conditionField: "",
                        conditionOperator: "equals" as const,
                        conditionValue: "",
                      },
                    };
                    setNodes([...nodes, newNode]);
                  }}
                  className="w-full p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center gap-2"
                >
                  🔀 Condition
                </button>
                <button
                  onClick={() => {
                    const newNode = {
                      id: `delay_${Date.now()}`,
                      type: "delay" as const,
                      name: "Delay",
                      position: { x: 50 + nodes.length * 200, y: 50 },
                      data: {
                        id: `delay_${Date.now()}`,
                        type: "delay" as const,
                        name: "Delay",
                        delaySeconds: 30,
                      },
                    };
                    setNodes([...nodes, newNode]);
                  }}
                  className="w-full p-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  ⏱️ Delay
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div
              className="flex-1 relative bg-gray-25 overflow-auto"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                const nodeColors = {
                  trigger: "bg-green-100 border-green-300 text-green-700",
                  message: "bg-blue-100 border-blue-300 text-blue-700",
                  api_call: "bg-purple-100 border-purple-300 text-purple-700",
                  condition: "bg-yellow-100 border-yellow-300 text-yellow-700",
                  delay: "bg-gray-100 border-gray-300 text-gray-700",
                };

                return (
                  <div
                    key={node.id}
                    className={`absolute w-40 h-20 rounded-lg border-2 cursor-pointer select-none p-3 ${
                      nodeColors[node.type as keyof typeof nodeColors]
                    } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                    }}
                    onClick={() => handleNodeSelect(node)}
                    onMouseDown={(e) => {
                      //NOTE: monitor dragging state
                      // let isDragging = false;
                      const startX = e.clientX - node.position.x;
                      const startY = e.clientY - node.position.y;

                      const handleMouseMove = (e: MouseEvent) => {
                        // isDragging = true;
                        const newX = Math.max(0, e.clientX - startX);
                        const newY = Math.max(0, e.clientY - startY);

                        setNodes(
                          nodes.map((n) =>
                            n.id === node.id
                              ? { ...n, position: { x: newX, y: newY } }
                              : n
                          )
                        );
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener(
                          "mousemove",
                          handleMouseMove
                        );
                        document.removeEventListener("mouseup", handleMouseUp);
                      };

                      document.addEventListener("mousemove", handleMouseMove);
                      document.addEventListener("mouseup", handleMouseUp);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {node.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNodes(nodes.filter((n) => n.id !== node.id));
                          if (selectedNode?.id === node.id) {
                            setSelectedNode(null);
                            setShowConfigPanel(false);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{node.type}</div>

                    {/* Connection line to next node */}
                    {index < nodes.length - 1 && (
                      <div
                        className="absolute w-0.5 bg-gray-400"
                        style={{
                          left: "50%",
                          top: "100%",
                          height: Math.max(
                            20,
                            nodes[index + 1].position.y - node.position.y - 80
                          ),
                          transform: "translateX(-50%)",
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Build Your Workflow
                    </h3>
                    <p className="text-gray-500">
                      Add nodes from the left panel to get started
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Config Panel */}
            {showConfigPanel && selectedNode && (
              <div className="w-80 bg-white border-l p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Configure {selectedNode.name}</h3>
                  <button
                    onClick={() => setShowConfigPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Node Name
                    </label>
                    <input
                      value={selectedNode.name}
                      onChange={(e) => {
                        const updatedNode = {
                          ...selectedNode,
                          name: e.target.value,
                        };
                        setSelectedNode(updatedNode);
                        handleNodeUpdate(updatedNode);
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  {selectedNode.type === "trigger" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Trigger Type
                        </label>
                        <select
                          value={selectedNode.data.triggerType || "keyword"}
                          onChange={(e) => {
                            const updatedNode = {
                              ...selectedNode,
                              data: {
                                ...selectedNode.data,
                                triggerType: e.target.value,
                              },
                            };
                            setSelectedNode(updatedNode);
                            handleNodeUpdate(updatedNode);
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="keyword">Keyword</option>
                          <option value="intent">Intent</option>
                          <option value="sentiment">Sentiment</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Trigger Value
                        </label>
                        <input
                          value={selectedNode.data.triggerValue || ""}
                          onChange={(e) => {
                            const updatedNode = {
                              ...selectedNode,
                              data: {
                                ...selectedNode.data,
                                triggerValue: e.target.value,
                              },
                            };
                            setSelectedNode(updatedNode);
                            handleNodeUpdate(updatedNode);
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="e.g., 'help', 'support'"
                        />
                      </div>
                    </>
                  )}

                  {selectedNode.type === "message" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message Text
                      </label>
                      <textarea
                        value={selectedNode.data.messageText || ""}
                        onChange={(e) => {
                          const updatedNode = {
                            ...selectedNode,
                            data: {
                              ...selectedNode.data,
                              messageText: e.target.value,
                            },
                          };
                          setSelectedNode(updatedNode);
                          handleNodeUpdate(updatedNode);
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={4}
                        placeholder="Enter message to send"
                      />
                    </div>
                  )}

                  {selectedNode.type === "api_call" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Method
                          </label>
                          <select
                            value={selectedNode.data.method || "GET"}
                            onChange={(e) => {
                              const updatedNode = {
                                ...selectedNode,
                                data: {
                                  ...selectedNode.data,
                                  method: e.target.value,
                                },
                              };
                              setSelectedNode(updatedNode);
                              handleNodeUpdate(updatedNode);
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            URL
                          </label>
                          <input
                            value={selectedNode.data.url || ""}
                            onChange={(e) => {
                              const updatedNode = {
                                ...selectedNode,
                                data: {
                                  ...selectedNode.data,
                                  url: e.target.value,
                                },
                              };
                              setSelectedNode(updatedNode);
                              handleNodeUpdate(updatedNode);
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="API URL"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "condition" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Field
                        </label>
                        <input
                          value={selectedNode.data.field || ""}
                          onChange={(e) => {
                            const updatedNode = {
                              ...selectedNode,
                              data: {
                                ...selectedNode.data,
                                field: e.target.value,
                              },
                            };
                            setSelectedNode(updatedNode);
                            handleNodeUpdate(updatedNode);
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Field to check"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Operator
                          </label>
                          <select
                            value={selectedNode.data.operator || "equals"}
                            onChange={(e) => {
                              const updatedNode = {
                                ...selectedNode,
                                data: {
                                  ...selectedNode.data,
                                  operator: e.target.value,
                                },
                              };
                              setSelectedNode(updatedNode);
                              handleNodeUpdate(updatedNode);
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="equals">Equals</option>
                            <option value="not_equals">Not Equals</option>
                            <option value="contains">Contains</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Value
                          </label>
                          <input
                            value={selectedNode.data.value || ""}
                            onChange={(e) => {
                              const updatedNode = {
                                ...selectedNode,
                                data: {
                                  ...selectedNode.data,
                                  value: e.target.value,
                                },
                              };
                              setSelectedNode(updatedNode);
                              handleNodeUpdate(updatedNode);
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Value to compare"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "delay" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Delay (seconds)
                      </label>
                      <input
                        type="number"
                        value={selectedNode.data.seconds || 30}
                        onChange={(e) => {
                          const updatedNode = {
                            ...selectedNode,
                            data: {
                              ...selectedNode.data,
                              seconds: parseInt(e.target.value),
                            },
                          };
                          setSelectedNode(updatedNode);
                          handleNodeUpdate(updatedNode);
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                        max="3600"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <form
            id="workflow-form"
            onSubmit={handleSubmit(onSubmit)}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
