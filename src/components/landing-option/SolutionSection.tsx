"use client";

import { SnakeCard } from "./SnakeCard";
import { BrainCircuit, Mic, MessageSquare } from "lucide-react";

export default function SolutionSection() {
  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Build Your Digital Staff.
          </h2>
          <p className="text-gray-400 text-xl font-light">
            Multimodal agents for every touchpoint.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[500px] max-w-6xl mx-auto">
          {/* Card 1: Multimodal (Large) */}
          <div className="md:col-span-2 md:row-span-2 h-full">
            <SnakeCard className="h-full">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="bg-violet-500/20 p-3 rounded-xl w-fit mb-6">
                    <BrainCircuit className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Beyond Text.</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Handle text, images, documents, and voice. Perfect for
                    complex support scenarios where context is king.
                  </p>
                </div>
                <div className="mt-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
                    Powered by Gemini 1.5
                  </span>
                </div>
                {/* Visual Decoration */}
                <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
              </div>
            </SnakeCard>
          </div>

          {/* Card 2: Voice (Small) */}
          <div className="h-full">
            <SnakeCard className="h-full">
              <div className="flex flex-col justify-between h-full relative z-10">
                <div>
                  <div className="bg-cyan-500/20 p-3 rounded-xl w-fit mb-4">
                    <Mic className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Natural Voice.</h3>
                  <p className="text-gray-400 text-sm">
                    Handle phone calls like a human. Real-time processing with
                    emotion detection.
                  </p>
                </div>
              </div>
            </SnakeCard>
          </div>

          {/* Card 3: Text (Small) */}
          <div className="h-full">
            <SnakeCard className="h-full">
              <div className="flex flex-col justify-between h-full relative z-10">
                <div>
                  <div className="bg-emerald-500/20 p-3 rounded-xl w-fit mb-4">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lightning Fast.</h3>
                  <p className="text-gray-400 text-sm">
                    Instant responses for chat and email. Optimized for speed
                    and accuracy.
                  </p>
                </div>
              </div>
            </SnakeCard>
          </div>
        </div>
      </div>
    </section>
  );
}
