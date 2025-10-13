/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workflowSchema, WorkflowFormData } from "@/schemas/actionSchemas";
import {
  Plus,
  Save,
  X,
  Trash2,
  Globe,
  Mail,
  Clock,
  MessageSquare,
  GitBranch,
} from "lucide-react";

interface WorkflowBuilderProps {
  onSave: (workflow: WorkflowFormData) => void;
  onCancel: () => void;
  initialWorkflow?: Partial<WorkflowFormData>;
}

export function WorkflowBuilder({
  onSave,
  onCancel,
  initialWorkflow,
}: WorkflowBuilderProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: initialWorkflow?.name || "",
      description: initialWorkflow?.description || "",
      trigger: initialWorkflow?.trigger || {
        type: "keyword",
        value: "",
        conditions: {},
      },
      steps: initialWorkflow?.steps || [
        { id: "1", name: "Step 1", type: "api_call" },
      ],
    },
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const watchedSteps = watch("steps");

  const stepTypes = [
    { value: "api_call", label: "API Call", icon: Globe },
    { value: "webhook", label: "Webhook", icon: Globe },
    { value: "condition", label: "Condition", icon: GitBranch },
    { value: "message", label: "Send Message", icon: MessageSquare },
    { value: "email", label: "Send Email", icon: Mail },
    { value: "delay", label: "Delay", icon: Clock },
  ];

  const onSubmit = (data: WorkflowFormData) => {
    onSave(data);
  };

  const addStep = () => {
    appendStep({
      id: `step_${Date.now()}`,
      name: `Step ${stepFields.length + 1}`,
      type: "api_call",
    });
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find((st) => st.value === type);
    return stepType?.icon || Globe;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Workflow Builder</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit(onSubmit)}
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

        <form className="flex-1 overflow-hidden">
          <div className="p-6 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name
                </label>
                <input
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter workflow name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe what this workflow does"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger
              </label>
              <div className="flex gap-3">
                <select
                  {...register("trigger.type")}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="keyword">Keyword</option>
                  <option value="intent">Intent</option>
                  <option value="sentiment">Sentiment</option>
                </select>
                <input
                  {...register("trigger.value")}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter trigger value"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Workflow Steps</h3>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>

            <div className="space-y-6">
              {stepFields.map((field, index) => {
                const stepType = watchedSteps[index]?.type;
                const Icon = getStepIcon(stepType);

                return (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <Icon className="w-4 h-4" />
                        </div>
                        <input
                          {...register(`steps.${index}.name`)}
                          className="font-medium bg-transparent border-none focus:outline-none"
                          placeholder="Step name"
                        />
                      </div>
                      {stepFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Step Type
                        </label>
                        <select
                          {...register(`steps.${index}.type`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {stepTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {(stepType === "api_call" || stepType === "webhook") && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Method
                            </label>
                            <select
                              {...register(`steps.${index}.method`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                              <option value="PATCH">PATCH</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              URL
                            </label>
                            <input
                              {...register(`steps.${index}.url`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="https://api.example.com/endpoint"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Authentication
                          </label>
                          <select
                            {...register(`steps.${index}.authType`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="none">None</option>
                            <option value="bearer">Bearer Token</option>
                            <option value="basic">Basic Auth</option>
                            <option value="api_key">API Key</option>
                          </select>
                        </div>

                        {watchedSteps[index]?.authType === "bearer" && (
                          <input
                            {...register(`steps.${index}.bearerToken`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Bearer token"
                            type="password"
                          />
                        )}

                        {watchedSteps[index]?.authType === "basic" && (
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              {...register(`steps.${index}.basicUsername`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Username"
                            />
                            <input
                              {...register(`steps.${index}.basicPassword`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Password"
                              type="password"
                            />
                          </div>
                        )}

                        {watchedSteps[index]?.authType === "api_key" && (
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              {...register(`steps.${index}.apiKeyHeader`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Header name (e.g., X-API-Key)"
                            />
                            <input
                              {...register(`steps.${index}.apiKey`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="API Key"
                              type="password"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Request Body (JSON)
                          </label>
                          <textarea
                            {...register(`steps.${index}.body`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                            placeholder='{"key": "value"}'
                          />
                        </div>
                      </div>
                    )}

                    {stepType === "email" && (
                      <div className="mt-4 space-y-4">
                        <input
                          {...register(`steps.${index}.emailTo`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="To email address"
                        />
                        <input
                          {...register(`steps.${index}.emailSubject`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Email subject"
                        />
                        <textarea
                          {...register(`steps.${index}.emailBody`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                          placeholder="Email body"
                        />
                      </div>
                    )}

                    {stepType === "message" && (
                      <div className="mt-4">
                        <textarea
                          {...register(`steps.${index}.messageText`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          rows={3}
                          placeholder="Message to send"
                        />
                      </div>
                    )}

                    {stepType === "delay" && (
                      <div className="mt-4">
                        <input
                          {...register(`steps.${index}.delaySeconds`, {
                            valueAsNumber: true,
                          })}
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Delay in seconds"
                          min="1"
                          max="3600"
                        />
                      </div>
                    )}

                    {stepType === "condition" && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <input
                          {...register(`steps.${index}.conditionField`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Field to check"
                        />
                        <select
                          {...register(`steps.${index}.conditionOperator`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="contains">Contains</option>
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                        </select>
                        <input
                          {...register(`steps.${index}.conditionValue`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Value to compare"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
