"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { BrainCircuit, Eye, Radio, Share2, Layers } from "lucide-react";

export default function FeatureGridSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Snake Border Animation
      // Create a generic function to animate borders
      gsap.utils.toArray<HTMLElement>(".snake-card").forEach((card) => {
        // This is a simplified "snake" effect using a moving gradient or psuedo-element
        // For a true snake running around the border, we need 4 divers or clip-path animation.
        // Let's use a moving gradient background on the border wrapper.
        gsap.to(card, {
          backgroundPosition: "200% center",
          duration: 4,
          repeat: -1,
          ease: "linear",
        });
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to The Forge.
          </h2>
          <p className="text-[#0ea5e9] text-xl italic font-light">
            Build the infinite workforce.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Card 1: The Brain (Large, Spans 2 rows, 2 cols) */}
          <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 p-1">
            {/* Snake Border Container */}
            <div
              className="absolute inset-0 snake-card bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_100%]"
              style={{ zIndex: 0, padding: "1px" }}
            />

            <div className="relative z-10 h-full w-full bg-[#0d0d0d] rounded-[22px] p-8 flex flex-col justify-between overflow-hidden">
              <div className="relative z-20">
                <div className="bg-[#0ea5e9]/20 p-3 rounded-xl w-fit mb-4">
                  <BrainCircuit className="w-8 h-8 text-[#0ea5e9]" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Decision Engines</h3>
                <h4 className="text-xl text-gray-400 mb-4">
                  Decisions, Not Just Scripts.
                </h4>
                <p className="text-gray-500 max-w-md">
                  Move beyond simple 'If-This-Then-That'. LX Agents reason
                  through exceptions to achieve the outcome. They understand
                  context, adapt to ambiguity, and learn from outcomes.
                </p>
              </div>

              {/* Visual: Brain Image */}
              <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[80%] opacity-80 mix-blend-screen pointer-events-none">
                <Image
                  src="/assets/landing/brain.png"
                  alt="AI Brain"
                  fill
                  className="object-contain"
                />
                {/* Pulse effect overlay */}
                <div className="absolute inset-0 bg-[#0ea5e9]/10 animate-pulse rounded-full filter blur-3xl"></div>
              </div>
            </div>
          </div>

          {/* Card 2: The Senses */}
          <div className="relative group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 p-1">
            <div className="absolute inset-0 snake-card bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_100%]" />
            <div className="relative z-10 h-full w-full bg-[#0d0d0d] rounded-[22px] p-6">
              <div className="bg-purple-500/20 p-3 rounded-xl w-fit mb-4">
                <Eye className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-1">Text. Voice. Vision.</h3>
              <p className="text-gray-500 text-sm">
                From analyzing PDFs to handling phone calls. An entity that sees
                and hears your business.
              </p>
            </div>
          </div>

          {/* Card 3: Integration */}
          <div className="relative group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 p-1">
            <div className="absolute inset-0 snake-card bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_100%]" />
            <div className="relative z-10 h-full w-full bg-[#0d0d0d] rounded-[22px] p-6">
              <div className="bg-green-500/20 p-3 rounded-xl w-fit mb-4">
                <Share2 className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-1">Deep Integration</h3>
              <p className="text-gray-500 text-sm">
                Direct execution on Stripe, Salesforce, and your internal DB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
