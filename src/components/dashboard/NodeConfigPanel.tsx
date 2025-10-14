/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Settings, X } from "lucide-react";

interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: any;
}

interface NodeConfigPanelProps {
  node: WorkflowNode | null;
  onNodeUpdate: (node: WorkflowNode) => void;
  onClose: () => void;
}

export function NodeConfigPanel({
  node,
  onNodeUpdate,
  onClose,
}: NodeConfigPanelProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: node?.data || {},
  });

  if (!node) return null;

  const onSubmit = (data: any) => {
    onNodeUpdate({
      ...node,
      name: data.name || node.name,
      data,
    });
  };

  const renderNodeConfig = () => {
    switch (node.type) {
      case "trigger":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Type
              </label>
              <select
                {...register("triggerType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="keyword">Keyword</option>
                <option value="intent">Intent</option>
                <option value="sentiment">Sentiment</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Value
              </label>
              <input
                {...register("triggerValue")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 'help', 'booking', 'frustrated'"
              />
            </div>
          </div>
        );

      case "message":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Text
              </label>
              <textarea
                {...register("messageText")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Enter the message to send to the user"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <select
                {...register("messageType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="text">Text</option>
                <option value="template">Template</option>
                <option value="quick_reply">Quick Reply</option>
              </select>
            </div>
          </div>
        );

      case "api_call":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method
                </label>
                <select
                  {...register("method")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  {...register("url")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://api.example.com/endpoint"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headers (JSON)
              </label>
              <textarea
                {...register("headers")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder='{"Authorization": "Bearer {{token}}"}'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body (JSON)
              </label>
              <textarea
                {...register("requestBody")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder='{"data": "{{user_input}}"}'
              />
            </div>
          </div>
        );

      case "condition":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field
                </label>
                <input
                  {...register("conditionField")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="user_type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operator
                </label>
                <select
                  {...register("conditionOperator")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  {...register("conditionValue")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="premium"
                />
              </div>
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Duration (seconds)
              </label>
              <input
                {...register("delaySeconds", { valueAsNumber: true })}
                type="number"
                min="1"
                max="3600"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="30"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Email
              </label>
              <input
                {...register("emailTo")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="support@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                {...register("emailSubject")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Customer Support Request"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Body
              </label>
              <textarea
                {...register("emailBody")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Email content..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500">
            No configuration available for this node type.
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Configure Node</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node Name
          </label>
          <input
            {...register("name")}
            defaultValue={node.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Node name"
          />
        </div>

        {renderNodeConfig()}

        <div className="pt-4 border-t">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Update Node
          </button>
        </div>
      </form>
    </div>
  );
}
