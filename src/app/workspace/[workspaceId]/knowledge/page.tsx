"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useAgentStore } from "@/store/agentStore";
import { Spinner } from "@/components/common/Spinner";
import { agentsAPI } from "@/lib/api";
import { useAuthStore, useCurrentUser } from "@/store/authStore";
import {
  BookOpen,
  Search,
  ArrowRight,
  Database,
  FileText,
  Bot,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function KnowledgeCenterPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const user = useCurrentUser();
  const { token } = useAuthStore();
  const { agents, setAgents } = useAgentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAgents = useCallback(async () => {
    if (!user || !token) return;

    setLoading(true);
    setError(null);
    try {
      const { agents } = await agentsAPI.getAll(user.id || "", token);
      setAgents(agents);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      setError("Failed to load agents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, token, setAgents]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Knowledge Center
          </h1>
        </div>
        <p className="text-gray-500 max-w-2xl">
          Manage the knowledge base for your AI agents. Select an agent to view
          and edit its training data, documents, and FAQs.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full bg-white shadow-sm"
          />
        </div>
      </div>

      {loading && agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading agents...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-red-900">
            Failed to load agents
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => fetchAgents()} className="btn btn-secondary">
            Try Again
          </button>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "Try adjusting your search terms."
              : "Create your first agent to start adding knowledge."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push(`/workspace/${workspaceId}/create`)}
              className="btn btn-primary"
            >
              Create Agent
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() =>
                router.push(
                  `/workspace/${workspaceId}/agent/${agent.id}?tab=sources`
                )
              }
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-primary-500" />
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 capitalize">
                    {agent.agent_type}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6 line-clamp-2 h-10">
                {agent.description || "No description provided."}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Database className="w-3.5 h-3.5" />
                  <span>Knowledge Base</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Manage Sources</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
