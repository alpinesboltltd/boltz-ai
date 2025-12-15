"use client";

import { useState, useEffect } from "react";
import { agentsAPI } from "@/lib/api"; // Updated import
import { AgentTemplate } from "@/types/agent"; // Imported type
import { Spinner } from "@/components/common/Spinner";
import { AgentSetupModal } from "@/components/dashboard/AgentSetupModal";
import { useRouter } from "next/navigation";
import {
  Bot,
  Users,
  Target,
  Headphones,
  Search,
  Check,
  Zap,
  Tag,
} from "lucide-react";
import Select from "react-select";

const ROLE_ICONS: Record<string, any> = {
  virtual_assistant: Bot,
  customer_support: Headphones,
  sdr: Target,
  bdr: Users,
  // Add fallback or map others
};

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "virtual_assistant", label: "Virtual Assistant" },
  { value: "customer_support", label: "Customer Support" },
  { value: "sdr", label: "Sales Development" },
  { value: "bdr", label: "Business Development" },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [setupAgent, setSetupAgent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiringId, setHiringId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await agentsAPI.listTemplates();
      setTemplates(res || []);
    } catch (error) {
      console.error("Failed to load templates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (templateId: string, templateName: string) => {
    setHiringId(templateId);
    try {
      const res: any = await agentsAPI.hire(templateId);
      if (res.agent && res.agent.id) {
        setSetupAgent({
          id: res.agent.id,
          name: templateName || res.agent.name,
        });
      }
    } catch (error) {
      console.error("Failed to hire agent", error);
    } finally {
      setHiringId(null);
    }
  };

  const handleFinishSetup = () => {
    if (setupAgent) {
      router.push(`/dashboard/agent/${setupAgent.id}`);
    }
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesRole = filterRole === "all" || t.role === filterRole;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Agent Marketplace
          </h1>
          <p className="text-gray-500 mt-1">
            Hire pre-trained specialized agents for your workspace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={ROLE_OPTIONS}
              value={ROLE_OPTIONS.find((o) => o.value === filterRole)}
              onChange={(opt) => setFilterRole(opt?.value || "all")}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = ROLE_ICONS[template.role] || Bot;
          const isHiring = hiringId === template.id;

          return (
            <div
              key={template.id}
              className="group bg-white rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
                      {template.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                  {template.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="w-3 h-3" />
                  <span>{template.ai_model_id}</span>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => handleHire(template.id, template.name)}
                  disabled={!!hiringId}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-primary-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-md"
                >
                  {isHiring ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Hire Agent
                      <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No agents found matching your criteria.
          </p>
        </div>
      )}

      {/* Setup Modal */}
      <AgentSetupModal
        isOpen={!!setupAgent}
        agentId={setupAgent?.id || null}
        agentName={setupAgent?.name}
        onClose={() => handleFinishSetup()}
        onFinish={() => handleFinishSetup()}
      />
    </div>
  );
}
