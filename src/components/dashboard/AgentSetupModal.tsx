"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sources } from "@/components/dashboard/Sources";
import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AgentSetupModalProps {
  agentId: string | null;
  agentName?: string;
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
}

export function AgentSetupModal({
  agentId,
  agentName,
  isOpen,
  onClose,
  onFinish,
}: AgentSetupModalProps) {
  const [step, setStep] = useState<"intro" | "sources">("intro");

  if (!agentId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Override max-width for wider content */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogContent className="max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col p-0">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Setup Agent: {agentName || "New Agent"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${step === "intro" ? "bg-primary-600" : "bg-gray-300"}`}
              />
              <div
                className={`h-2 w-2 rounded-full ${step === "sources" ? "bg-primary-600" : "bg-gray-300"}`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {step === "intro" ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-2xl mx-auto">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <Check className="h-10 w-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Agent Created Successfully!
                </h2>
                <p className="text-gray-500 text-lg">
                  Your agent is ready to be trained. You can upload documents,
                  connect websites, or add custom text now to give it knowledge
                  immediately.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setStep("sources")}
                    className="btn btn-primary btn-lg flex items-center gap-2"
                  >
                    Start Training
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={onFinish}
                      className="text-sm text-gray-500 hover:text-gray-900 underline"
                    >
                      Skip for now, I'll do this later
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Knowledge Base</h3>
                    <p className="text-sm text-gray-500">
                      Teach your agent by adding data sources.
                    </p>
                  </div>
                </div>

                <Sources agentId={agentId} />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            {step === "sources" && (
              <>
                <button
                  onClick={() => setStep("intro")}
                  className="btn btn-ghost"
                >
                  Back
                </button>
                <button
                  onClick={onFinish}
                  className="btn btn-primary min-w-[120px]"
                >
                  Finish Setup
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
