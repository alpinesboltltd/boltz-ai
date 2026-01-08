import { useState, useMemo } from "react";
import Image from "next/image";
import { Check, Search, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIModelResponse } from "@/types/aiModels";

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  models: AIModelResponse["ai_model"][];
  loading?: boolean;
  className?: string;
}

const getProviderLogo = (provider: string) => {
  const p = provider.toLowerCase();
  // Map provider names to image files
  if (p.includes("openai")) return "/images/openai.svg";
  if (p.includes("anthropic")) return "/images/anthropic.svg";
  if (p.includes("google") || p.includes("gemini")) return "/images/gemini.svg";
  if (p.includes("meta") || p.includes("llama")) return "/images/meta.svg";
  if (p.includes("mistral")) return "/images/mistral.svg";
  if (p.includes("groq")) return "/images/groq.svg";
  if (p.includes("deepseek")) return "/images/deepseek.svg";
  if (p.includes("grok")) return "/images/grok.svg";
  if (p.includes("gemma")) return "/images/gemma.svg";

  // Default fallback if no match
  return null;
};

export function ModelSelector({
  value,
  onChange,
  models,
  loading,
  className,
}: ModelSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredModels = useMemo(() => {
    if (!search) return models;
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase())
    );
  }, [models, search]);

  const selectedModel = models.find((m) => m.id === value);

  if (loading) {
    return (
      <div className="h-12 w-full bg-gray-50 animate-pulse rounded-xl border border-gray-200" />
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-xl border bg-white transition-all text-left",
          isOpen
            ? "border-primary-500 ring-2 ring-primary-100"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {selectedModel ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 p-1">
              {getProviderLogo(selectedModel.provider) ? (
                <Image
                  src={getProviderLogo(selectedModel.provider)!}
                  alt={selectedModel.provider}
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Cpu className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 leading-none mb-1">
                {selectedModel.name}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span className="capitalize">{selectedModel.provider}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center">
                  <Zap className="w-3 h-3 text-yellow-500 mr-0.5" />
                  {selectedModel.credits_per_1k} credits/1k
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Select an AI model...</span>
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredModels.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No models found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredModels.map((model) => {
                  const logo = getProviderLogo(model.provider);
                  const isSelected = model.id === value;

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        onChange(model.id);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left group",
                        isSelected
                          ? "bg-primary-50 text-primary-900"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 p-1 group-hover:border-gray-200 transition-colors">
                          {logo ? (
                            <Image
                              src={logo}
                              alt={model.provider}
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Cpu className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {model.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <span className="capitalize">{model.provider}</span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center">
                              <Zap className="w-3 h-3 text-yellow-500 mr-0.5" />
                              {model.credits_per_1k}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
