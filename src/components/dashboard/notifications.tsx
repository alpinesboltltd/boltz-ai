/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  CogIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface Action {
  id: string;
  name: string;
  description: string;
  type: "webhook" | "email" | "api_call" | "database" | "integration";
  trigger: string;
  config: Record<string, any>;
  enabled: boolean;
  created_at: string;
}

export function ActionsB() {
  const [actions, setActions] = useState<Action[]>([
    {
      id: "1",
      name: "Send Welcome Email",
      description: "Send a welcome email when a new user starts a conversation",
      type: "email",
      trigger: "conversation_start",
      config: {
        template: "welcome_template",
        recipient: "user_email",
      },
      enabled: true,
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Create Support Ticket",
      description: "Create a support ticket when conversation is escalated",
      type: "api_call",
      trigger: "escalation",
      config: {
        endpoint: "https://api.support.com/tickets",
        method: "POST",
      },
      enabled: true,
      created_at: "2024-01-14T09:15:00Z",
    },
    {
      id: "3",
      name: "Update CRM Contact",
      description: "Update contact information in CRM system",
      type: "integration",
      trigger: "user_info_collected",
      config: {
        crm_system: "salesforce",
        fields: ["name", "email", "phone"],
      },
      enabled: false,
      created_at: "2024-01-13T14:20:00Z",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAction, setNewAction] = useState({
    name: "",
    description: "",
    type: "webhook" as const,
    trigger: "conversation_start",
    config: {},
  });

  const handleAddAction = () => {
    const action: Action = {
      id: Date.now().toString(),
      name: newAction.name,
      description: newAction.description,
      type: newAction.type,
      trigger: newAction.trigger,
      config: newAction.config,
      enabled: true,
      created_at: new Date().toISOString(),
    };

    setActions([...actions, action]);
    setNewAction({
      name: "",
      description: "",
      type: "webhook",
      trigger: "conversation_start",
      config: {},
    });
    setShowAddForm(false);
  };

  const handleToggleAction = (id: string) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, enabled: !action.enabled } : action
      )
    );
  };

  const handleDeleteAction = (id: string) => {
    setActions(actions.filter((action) => action.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-800";
      case "webhook":
        return "bg-green-100 text-green-800";
      case "api_call":
        return "bg-purple-100 text-purple-800";
      case "database":
        return "bg-yellow-100 text-yellow-800";
      case "integration":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Agent Actions</h2>
          <p className="text-sm text-gray-600">
            Configure automated actions your agent can perform
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Action
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Add New Action</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Name
              </label>
              <input
                type="text"
                value={newAction.name}
                onChange={(e) =>
                  setNewAction({ ...newAction, name: e.target.value })
                }
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Send notification email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={newAction.description}
                onChange={(e) =>
                  setNewAction({ ...newAction, description: e.target.value })
                }
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe what this action does"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <select
                  value={newAction.type}
                  onChange={(e) =>
                    setNewAction({ ...newAction, type: e.target.value as any })
                  }
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="webhook">Webhook</option>
                  <option value="email">Email</option>
                  <option value="api_call">API Call</option>
                  <option value="database">Database</option>
                  <option value="integration">Integration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger
                </label>
                <select
                  value={newAction.trigger}
                  onChange={(e) =>
                    setNewAction({ ...newAction, trigger: e.target.value })
                  }
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="conversation_start">Conversation Start</option>
                  <option value="conversation_end">Conversation End</option>
                  <option value="escalation">Escalation</option>
                  <option value="user_info_collected">
                    User Info Collected
                  </option>
                  <option value="keyword_detected">Keyword Detected</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Add Action
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Configured Actions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {actions.map((action) => (
            <div key={action.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {action.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(action.type)}`}
                      >
                        {action.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Trigger: {action.trigger}</span>
                      <span>
                        Created:{" "}
                        {new Date(action.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleAction(action.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      action.enabled ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        action.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <button
                    className="text-primary-600 hover:text-primary-800"
                    title="Test Action"
                  >
                    <PlayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAction(action.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Action"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
