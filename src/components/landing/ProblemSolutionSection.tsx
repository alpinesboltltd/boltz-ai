"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSolutionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftGraphRef = useRef<SVGPathElement>(null);
  const rightGraphRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Left Graph (Human Limit - Plateau)
      gsap.fromTo(
        leftGraphRef.current,
        { strokeDasharray: 300, strokeDashoffset: 300 },
        {
          strokeDashoffset: 0,
          duration: 2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate Right Graph (LX - Exponential)
      // Animate Right Graph (LX - Exponential - Infinite Flow)
      gsap.to(rightGraphRef.current, {
        strokeDashoffset: -1000,
        duration: 20, // Slow, continuous flow
        ease: "linear",
        repeat: -1,
      });

      // Fade out left / Brighten right
      gsap.fromTo(
        ".human-side",
        { opacity: 1, filter: "grayscale(0%)" },
        {
          opacity: 0.4,
          filter: "grayscale(100%)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[#050505] text-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: The Limit */}
          <div className="human-side space-y-6">
            <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm relative">
              <h3 className="text-2xl font-bold mb-2">Human Output</h3>
              <p className="text-gray-400 text-sm mb-6">
                Subject to fatigue, breaks, and cognitive load.
              </p>

              {/* Graph SVG */}
              <div className="h-64 w-full relative border-l border-b border-white/20">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Plateau Graph */}
                  <path
                    ref={leftGraphRef}
                    d="M0,90 Q30,80 50,85 T90,85"
                    className="stroke-gray-500 fill-none stroke-[3px]"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* Marker line for limit */}
                <div className="absolute top-[15%] left-0 w-full border-t border-dashed border-red-500/50 text-xs text-red-500 pt-1">
                  Capacity Ceiling
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">
                We Sleep.
                <br />
                We Burn Out.
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Traditional automation breaks when things get complex. Humans
                need rest.
              </p>
            </div>
          </div>

          {/* Right: LX Solution */}
          <div className="lx-side space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4 text-[#0ea5e9]">
                LX Does Not.
              </h2>
              <p className="text-gray-300 leading-relaxed">
                LX Agents operate within the parameters you define, without
                supervision. They don't need training seminars; they only need
                an objective.
              </p>
            </div>

            <div className="p-8 border border-[#0ea5e9]/30 rounded-2xl bg-gradient-to-br from-[#0ea5e9]/10 to-transparent relative shadow-[0_0_30px_rgba(14,165,233,0.15)]">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Autonomous Scale
              </h3>
              <p className="text-[#0ea5e9] text-sm mb-6">
                Infinite capacity. Zero downtime.
              </p>

              {/* Graph SVG */}
              <div className="h-64 w-full relative border-l border-b border-[#0ea5e9]/30">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Exponential Graph */}
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    ref={rightGraphRef}
                    d="M0,90 C40,90 40,60 100,10"
                    className="stroke-[url(#lineGradient)] fill-none stroke-[4px]"
                    filter="url(#glow)"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
