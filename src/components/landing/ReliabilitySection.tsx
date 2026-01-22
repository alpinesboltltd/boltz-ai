"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckCircle2, ShieldCheck, Activity } from "lucide-react";

export default function ReliabilitySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Radar Scan Animation
      const scanLine = gsap.utils.selector(containerRef)(".radar-line");

      gsap.to(scanLine, {
        top: "100%",
        duration: 3,
        repeat: -1,
        ease: "linear",
        opacity: 0,
        yoyo: false,
        onRepeat: () => {
          gsap.set(scanLine, { top: "0%", opacity: 1 });
        },
      });

      // Status Checks Animation (Staggered flip from Red to Green?)
      // For simplicity, let's just pulse the checks as the line passes.
      // But creating a complex timeline based on the line position is tricky without more DOM logic.
      // Let's just animate the checks appearing.
      gsap.from(".check-item", {
        opacity: 0,
        x: -20,
        stagger: 0.5,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[#050505] text-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl font-bold">Autonomy Within Parameters.</h2>
            <div className="space-y-6 text-gray-400">
              <p className="text-lg">
                You define the guardrails. The agent executes the work.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 check-item">
                  <ShieldCheck className="text-[#0ea5e9]" />
                  <span>
                    <strong className="text-white">Safe Zones:</strong> Strict
                    operational boundaries.
                  </span>
                </li>
                <li className="flex items-center gap-3 check-item">
                  <Activity className="text-[#0ea5e9]" />
                  <span>
                    <strong className="text-white">Audit Trails:</strong> Every
                    decision recorded.
                  </span>
                </li>
                <li className="flex items-center gap-3 check-item">
                  <CheckCircle2 className="text-[#0ea5e9]" />
                  <span>
                    <strong className="text-white">Human Intervention:</strong>{" "}
                    Take the wheel instantly.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* UI Mockup with Radar Scan */}
          <div className="lg:w-1/2 w-full relative">
            <div className="relative rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden shadow-2xl">
              {/* Mockup Header */}
              <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>

              {/* Mockup Body */}
              <div className="p-6 space-y-6 font-mono text-sm relative">
                {/* Radar Scan Line */}
                <div className="radar-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_20px_#0ea5e9] z-20 top-0 pointer-events-none opacity-80" />

                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-gray-500">Agent Status</span>
                  <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence Score</span>
                    <span className="text-[#0ea5e9]">98.5%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0ea5e9] h-full w-[98.5%]" />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Analyzing request parameters...</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Verifying safety constraints...</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Executing transaction...</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-[#0ea5e9]/5 blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
