"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check, ArrowRight } from "lucide-react";

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
  if (!agentId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] sm:w-[500px] max-w-none flex flex-col p-0 gap-0 sm:rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Agent Setup
            </DialogTitle>
            <p className="text-sm text-gray-500">
              Get {agentName} ready for action
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/30">
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-green-50/50">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Agent Created Successfully!
            </h2>

            <p className="text-gray-500 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Your agent{" "}
              <span className="font-semibold text-gray-900">{agentName}</span>{" "}
              is ready. You can now configure its appearance, behavior, and
              more.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={onFinish}
                className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all font-medium"
              >
                Go to Agent
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
