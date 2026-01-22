"use client";

import { CheckCircle2, ShieldCheck, Lock } from "lucide-react";

export default function ReliabilitySection() {
  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
          {/* Left: Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Autonomy Within Parameters.
              <span className="block text-gray-500 text-2xl font-normal mt-2">
                Stop managing tasks. Start orchestrating outcomes.
              </span>
            </h2>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-cyan-500/10 p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Guardrails</h4>
                  <p className="text-gray-400 text-sm">
                    You define the safe zones. The agent executes without
                    supervision *within* those zones.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-violet-500/10 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Tiered Evaluations</h4>
                  <p className="text-gray-400 text-sm">
                    Every agent passes a simulation exam before going live.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg">
                  <Lock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Enterprise Security</h4>
                  <p className="text-gray-400 text-sm">
                    SOC 2 compliant, encrypted, and audit-ready.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: Trust Terminal Visual */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-[#0f172a] rounded-xl border border-white/10 p-6 font-mono text-sm shadow-2xl relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs">agent-logic.log</span>
              </div>

              {/* Code Content */}
              <div className="space-y-2">
                <div className="flex text-gray-400">
                  <span className="w-6 text-gray-600">1</span>
                  <span>
                    Agent Goal:{" "}
                    <span className="text-yellow-300">"Refund User"</span>
                  </span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-6 text-gray-600">2</span>
                  <span>Checking Policy[Refund]...</span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-6 text-gray-600">3</span>
                  <span> Check: Amount &lt; $50?</span>
                </div>
                <div className="flex text-green-400">
                  <span className="w-6 text-gray-600">4</span>
                  <span> [PASS] Amount is $24.99</span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-6 text-gray-600">5</span>
                  <span> Check: User Tier?</span>
                </div>
                <div className="flex text-green-400">
                  <span className="w-6 text-gray-600">6</span>
                  <span> [PASS] User is 'Premier'</span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-6 text-gray-600">7</span>
                  <span>Executing Action...</span>
                </div>
                <div className="flex text-cyan-400 mt-2">
                  <span className="w-6 text-gray-600">8</span>
                  <span> Stripe.Refund(id="tx_123", amount=2499)</span>
                </div>
                <div className="flex text-gray-500 mt-2 animate-pulse">
                  <span className="w-6 text-gray-600">9</span>
                  <span>_</span>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#0f172a] via-transparent to-transparent opacity-20 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
