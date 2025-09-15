import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomAction } from "@/types/actions";
import { customActionSchema, CustomActionFormData } from "@/schemas/actionSchemas";
import { X, MessageSquare, Zap, Calendar, ShoppingCart } from "lucide-react";

interface ActionFormProps {
  onSave: (action: Partial<CustomAction>) => void;
  onCancel: () => void;
  initialAction?: Partial<CustomAction>;
}

export function ActionForm({ onSave, onCancel, initialAction }: ActionFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CustomActionFormData>({
    resolver: zodResolver(customActionSchema),
    defaultValues: {
      name: initialAction?.name || "",
      description: initialAction?.description || "",
      type: initialAction?.type || "conversation"
    }
  });

  const watchedType = watch("type");

  const onSubmit = (data: CustomActionFormData) => {
    onSave({
      ...data,
      status: "active",
      category: "custom",
      triggers: [{ type: "keyword", value: data.name.toLowerCase(), conditions: {} }],
      steps: [{ 
        id: "1", 
        type: "message", 
        config: { 
          text: `This is a ${data.type} action: ${data.description}` 
        }
      }]
    });
  };

  const actionTypes = [
    { value: "conversation", label: "Conversation", icon: MessageSquare, description: "Handle customer conversations" },
    { value: "followup", label: "Follow-up", icon: Zap, description: "Follow up on customer interactions" },
    { value: "booking", label: "Booking", icon: Calendar, description: "Handle appointment bookings" },
    { value: "order", label: "Order Management", icon: ShoppingCart, description: "Manage customer orders" },
    { value: "task", label: "Task", icon: Zap, description: "Execute specific tasks" },
    { value: "alert", label: "Alert", icon: Zap, description: "Send notifications and alerts" }
  ];

  const getActionIcon = (type: string) => {
    const actionType = actionTypes.find(at => at.value === type);
    return actionType?.icon || MessageSquare;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create Custom Action</h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Name *
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Greet Customer, Check Order Status"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what this action does and when it should be triggered"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Action Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {actionTypes.map(actionType => {
                const Icon = actionType.icon;
                return (
                  <label
                    key={actionType.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      watchedType === actionType.value ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("type")}
                      value={actionType.value}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        watchedType === actionType.value ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{actionType.label}</div>
                        <div className="text-sm text-gray-500">{actionType.description}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Quick Action Info</h4>
            <p className="text-sm text-blue-700">
              Quick actions are simple, single-purpose functions. For complex multi-step processes, 
              use the Sequential Workflow builder or create API Functions for reusable integrations.
            </p>
          </div>

          </form>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create Quick Action
          </button>
        </div>
      </div>
    </div>
  );
}