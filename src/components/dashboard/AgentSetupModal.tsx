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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      className="w-[90%] md:w-[85%] lg:w-[70%] max-w-none p-0"
    >
      <DialogContent className="w-full max-h-[80vh] flex flex-col p-0 gap-0 sm:rounded-2xl overflow-scroll scrollbar-hide">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {step === "intro" ? "Agent Setup" : "Training Sources"}
            </DialogTitle>
            <p className="text-sm text-gray-500">
              {step === "intro"
                ? `Get ${agentName} ready for action`
                : "Add a knowledge base to train your agent"}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <span
              className={`text-xs font-medium ${step === "intro" ? "text-primary-700" : "text-gray-500"}`}
            >
              Intro
            </span>
            <div className="flex items-center gap-1">
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${step === "intro" ? "bg-primary-600" : "bg-gray-300"}`}
              />
              <div className="w-4 h-0.5 bg-gray-200" />
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${step === "sources" ? "bg-primary-600" : "bg-gray-300"}`}
              />
            </div>
            <span
              className={`text-xs font-medium ${step === "sources" ? "text-primary-700" : "text-gray-500"}`}
            >
              Sources
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/30">
          {step === "intro" ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Agent Created Successfully!
              </h2>

              <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
                Your agent{" "}
                <span className="font-semibold text-gray-900">{agentName}</span>{" "}
                is ready to be trained. Upload documents, add website links, or
                provide custom instructions to build its knowledge base.
              </p>

              <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                  onClick={() => setStep("sources")}
                  className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all font-medium"
                >
                  Start Training
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={onFinish}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <Sources agentId={agentId} />
            </div>
          )}
        </div>

        {/* Footer actions for Source step */}
        {step === "sources" && (
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
            <button
              onClick={() => setStep("intro")}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-2"
            >
              Back
            </button>
            <button
              onClick={onFinish}
              className="btn btn-primary px-6 py-2.5 shadow-md shadow-primary-500/10"
            >
              Finish Setup
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
