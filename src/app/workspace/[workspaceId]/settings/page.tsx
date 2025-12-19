"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/common/Spinner";
import { Settings, Save } from "lucide-react";
import { toast } from "@/store/toastStore";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("My Workspace");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Success", "Workspace settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Error", "Failed to save workspace settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-600" />
          Workspace Settings
        </h1>
        <p className="mt-2 text-gray-500">
          Manage your workspace configuration.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="workspaceName"
              className="block text-sm font-medium text-gray-700"
            >
              Workspace Name
            </label>
            <input
              type="text"
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="input w-full"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
