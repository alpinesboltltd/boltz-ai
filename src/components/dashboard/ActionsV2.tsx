import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { agentsAPI } from "@/lib/api";
import { AgentActions, CoreAction, SystemAction, CustomAction, WorkflowNode, WorkflowConnection } from "@/types/actions";
import { Plus, Settings, Play, Pause, Edit, Trash2, Zap, MessageSquare, Calendar, ShoppingCart, Bell, Workflow, Code, Users } from "lucide-react";
import { ApiFunctionBuilder } from "./ApiFunctionBuilder";
import { SequentialWorkflowBuilder } from "./SequentialWorkflowBuilder";
import { ActionForm } from "./ActionForm";
import { ApiFunctionFormData, SequentialWorkflowFormData } from "@/schemas/actionSchemas";

interface ActionsV2Props {
  onCreateCustomAction?: () => void;
}

export function ActionsV2({ onCreateCustomAction }: ActionsV2Props) {
  const agentId = useParams().id as string;
  const [actionsData, setActionsData] = useState<AgentActions | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("core");
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [showApiFunctionBuilder, setShowApiFunctionBuilder] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const { data } = await agentsAPI.getActions(agentId);
        setActionsData(data);
      } catch (error) {
        console.error('Failed to fetch actions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [agentId]);

  const getActionIcon = (type: string) => {
    const icons = {
      conversation: MessageSquare,
      followup: Bell,
      task: Settings,
      knowledge: Code,
      booking: Calendar,
      order: ShoppingCart,
      alert: Bell,
      workflow: Workflow,
      api: Code,
      messaging: MessageSquare,
      business: Users,
      learning: Zap
    };
    return icons[type as keyof typeof icons] || Settings;
  };

  const ActionCard = ({ action, onEdit, onToggle, onDelete }: {
    action: CoreAction | SystemAction | CustomAction;
    onEdit: (id: string) => void;
    onToggle: (id: string) => void;
    onDelete?: (id: string) => void;
  }) => {
    const Icon = getActionIcon(action.type);
    
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${action.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{action.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  action.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {action.status}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {action.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggle(action.id)}
              className={`p-2 rounded-lg ${action.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {action.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEdit(action.id)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Edit className="w-4 h-4" />
            </button>
            {!action.isBuiltIn && onDelete && (
              <button
                onClick={() => onDelete(action.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleEdit = (id: string) => {
    console.log('Edit action:', id);
  };

  const handleToggle = async (id: string) => {
    try {
      await agentsAPI.toggleActionStatus(agentId, id);
      // Refresh actions data
      const { data } = await agentsAPI.getActions(agentId);
      setActionsData(data);
    } catch (error) {
      console.error('Failed to toggle action:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await agentsAPI.deleteCustomAction(agentId, id);
      // Refresh actions data
      const { data } = await agentsAPI.getActions(agentId);
      setActionsData(data);
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  const handleCreateApiFunction = () => {
    setShowApiFunctionBuilder(true);
  };

  const handleCreateWorkflow = () => {
    setShowWorkflowBuilder(true);
  };

  const handleSaveApiFunction = async (apiFunction: ApiFunctionFormData) => {
    try {
      await agentsAPI.createApiFunction(agentId, apiFunction);
      setShowApiFunctionBuilder(false);
      // Refresh actions data
      const { data } = await agentsAPI.getActions(agentId);
      setActionsData(data);
    } catch (error) {
      console.error('Failed to create API function:', error);
    }
  };

  const handleCancelApiFunction = () => {
    setShowApiFunctionBuilder(false);
  };

  const handleSaveWorkflow = async (workflow: SequentialWorkflowFormData) => {
    try {
      await agentsAPI.createSequentialWorkflow(agentId, workflow);
      setShowWorkflowBuilder(false);
      // Refresh actions data
      const { data } = await agentsAPI.getActions(agentId);
      setActionsData(data);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleCancelWorkflow = () => {
    setShowWorkflowBuilder(false);
  };

  const handleSaveAction = async (action: Partial<CustomAction>) => {
    try {
      await agentsAPI.createCustomAction(agentId, action);
      setShowActionForm(false);
      // Refresh actions data
      const { data } = await agentsAPI.getActions(agentId);
      setActionsData(data);
    } catch (error) {
      console.error('Failed to create action:', error);
    }
  };

  const handleCancelAction = () => {
    setShowActionForm(false);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading actions...</div>;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("core")}
            className={`${
              activeTab === "core"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-2 text-sm`}
          >
            <Zap className="w-4 h-4" />
            Core Actions
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`${
              activeTab === "system"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 flex gap-x-2 items-center font-medium text-sm`}
          >
            <Settings className="w-4 h-4" />
            System Actions
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`${
              activeTab === "custom"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 flex items-center gap-x-2 font-medium text-sm`}
          >
            <Workflow className="w-4 h-4" />
            Custom Actions
          </button>
        </nav>
      </div>

      {/* Core Actions Tab */}
      {activeTab === "core" && (
        <div className="mt-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Core Inbuilt Actions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Essential actions that are part of the system's general intelligence for customer support.
            </p>
          </div>
          <div className="space-y-4">
            {actionsData?.coreActions?.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* System Actions Tab */}
      {activeTab === "system" && (
        <div className="mt-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">System-Defined Actions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Pre-built actions that show what your agent can do. Configure integrations to enable these actions.
            </p>
          </div>
          <div className="space-y-6">
            {actionsData?.systemActions?.map((action) => (
              <div key={action.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${action.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {(() => {
                        const Icon = getActionIcon(action.type);
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          action.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {action.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {action.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled
                  >
                    View Only
                  </button>
                </div>
                
                {action.supportedProviders && action.supportedProviders.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Supported Integrations</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {action.supportedProviders.map((provider) => (
                        <div key={provider.id} className="flex items-center gap-2 p-2 border rounded-lg">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-xs font-medium">{provider.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-gray-700">{provider.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Actions Tab */}
      {activeTab === "custom" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Custom Actions</h2>
              <p className="text-sm text-gray-600 mt-1">
                Create custom workflows and actions specific to your business needs.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowActionForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Quick Action
              </button>
              <button
                onClick={handleCreateApiFunction}
                className="flex items-center gap-2 px-3 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 text-sm"
              >
                <Code className="w-4 h-4" />
                API Function
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Workflow className="w-4 h-4" />
                Sequential Workflow
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {actionsData?.customActions?.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No custom actions yet</h3>
                <p className="text-gray-600 mb-4">Create your first custom action to automate specific workflows.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowActionForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    Quick Action
                  </button>
                  <button
                    onClick={handleCreateApiFunction}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                  >
                    <Code className="w-4 h-4" />
                    API Function
                  </button>
                  <button
                    onClick={handleCreateWorkflow}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Workflow className="w-4 h-4" />
                    Sequential Workflow
                  </button>
                </div>
              </div>
            ) : (
              actionsData?.customActions?.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      )}
      
      {showApiFunctionBuilder && (
        <ApiFunctionBuilder
          onSave={handleSaveApiFunction}
          onCancel={handleCancelApiFunction}
        />
      )}
      
      {showWorkflowBuilder && (
        <SequentialWorkflowBuilder
          onSave={handleSaveWorkflow}
          onCancel={handleCancelWorkflow}
          availableApiFunctions={actionsData?.apiFunctions || []}
        />
      )}
      
      {showActionForm && (
        <ActionForm
          onSave={handleSaveAction}
          onCancel={handleCancelAction}
        />
      )}
    </div>
  );
}