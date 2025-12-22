"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRightIcon } from "lucide-react";
import WaitlistModal from "../shared/WaitlistModal";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Staggered Text Reveal
      tl.from(".hero-word", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      });

      // Emphasis for Capital vs Capacity
      tl.from(
        ".hero-emphasis",
        {
          scale: 0.9,
          color: "#fff",
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Neural Mesh Pulse (Simulated with background gradient for now, can be complex canvas later)
      // For now, let's just animate the grid background
      gsap.to(".neural-grid", {
        backgroundPosition: "0% 100%",
        duration: 20,
        repeat: -1,
        ease: "linear",
        yoyo: true,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#020617] text-white"
    >
      {/* Neural Mesh Background */}
      <div className="neural-grid absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-30" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight">
            <div className="overflow-hidden">
              <span className="hero-word inline-block mr-4">The</span>
              <span className="hero-word inline-block mr-4">Limitation</span>
              <span className="hero-word inline-block mr-4">to</span>
              <span className="hero-word inline-block mr-4">Growth</span>
              <span className="hero-word inline-block mr-4">is</span>
              <span className="hero-word inline-block mr-4">No</span>
              <span className="hero-word inline-block mr-4">Longer</span>
              <span className="hero-word hero-emphasis inline-block text-gray-400">
                Capital.
              </span>
            </div>
            <div className="overflow-hidden mt-2">
              <span className="hero-word inline-block mr-4">It</span>
              <span className="hero-word inline-block mr-4">is</span>
              <span className="hero-word hero-emphasis inline-block bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Capacity.
              </span>
            </div>
          </h1>

          <p className="hero-word text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your ambition is infinite, but your workforce is not. Move beyond
            simple automation and hire Level 4 autonomous agents that understand
            the goal—not just the script.
          </p>

          <div className="hero-word flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] flex items-center gap-2"
            >
              Join the Waitlist
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 text-white font-medium hover:bg-white/10 rounded-full transition-all border border-white/10">
              View Demo
            </button>
          </div>
        </div>
      </div>
      <WaitlistModal
        isOpen={isWaitlistOpen}
        closeModal={() => setIsWaitlistOpen(false)}
      />
    </section>
  );
}
