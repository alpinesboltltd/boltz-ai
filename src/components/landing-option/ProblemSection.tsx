"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Card Interaction
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          toggleActions: "play reverse play reverse",
        },
      });

      // Dim Left Card
      tl.to(leftCardRef.current, {
        opacity: 0.3,
        scale: 0.95,
        filter: "grayscale(100%)",
        duration: 0.5,
      });

      // Light up Right Card
      tl.to(
        rightCardRef.current,
        {
          scale: 1.05,
          boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
          borderColor: "rgba(139, 92, 246, 0.5)",
          duration: 0.5,
        },
        "<"
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-slate-950 text-white relative"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-500 uppercase mb-4">
            The Era of Autonomy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left Card: The Old Way */}
          <div
            ref={leftCardRef}
            className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-md transition-all"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-300">
              The Human Engine.
            </h3>
            <p className="text-gray-500 mb-8">
              We sleep. We burn out. Even the best teams have limits. Capacity
              is finite.
            </p>
            {/* Visual: Static Waveform */}
            <div className="h-24 flex items-center justify-center space-x-1 opacity-40">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gray-500"
                  style={{ height: `${Math.random() * 20 + 10}px` }}
                />
              ))}
            </div>
          </div>

          {/* Right Card: The LX Way */}
          <div
            ref={rightCardRef}
            className="bg-slate-900 border border-white/10 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden group"
          >
            {/* Snake Border Effect (Simplified CSS for this specific card interaction) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              The Infinite Workforce.
            </h3>
            <p className="text-gray-300 mb-8">
              They don't need sleep or training seminars; they only need an
              objective. Decisions executed within parameters you define.
            </p>

            {/* Visual: Animated Waveform */}
            <div className="h-24 flex items-center justify-center space-x-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-500 animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
