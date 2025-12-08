"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { MOCK_AGENTS } from "@/constants";
import { Star, Zap, Shield, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export const AgentShowcase = ({ onHire }: { onHire: (id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_AGENTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    const elements = cardRef.current.querySelectorAll(".animate-item");
    tl.fromTo(
      elements,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, [currentIndex]);

  const agent = MOCK_AGENTS[currentIndex];

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
          Discover Premium AI Agents
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Explore our curated collection of specialized AI agents designed to elevate your workflow.
        </p>
      </div>

      <div ref={cardRef} className="relative w-full max-w-4xl">
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side: Visuals */}
            <div className="relative p-8 bg-linear-to-br from-primary-50 to-indigo-50 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6 animate-item">
                <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full transform scale-150" />
                <div className="relative h-40 w-40 rounded-full p-1 bg-white shadow-xl ring-1 ring-black/5">
                  <Image
                    src={agent.imageUrl}
                    alt={agent.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-full shadow-lg border border-gray-100">
                  <div className="bg-yellow-50 p-1.5 rounded-full">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-item">{agent.name}</h3>
              <p className="text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full text-sm animate-item">
                {agent.ai_model}
              </p>
            </div>

            {/* Right Side: Details */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-6 animate-item">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed text-lg">{agent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 animate-item">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
                    <Award className="w-4 h-4" />
                    <span>Rating</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{agent.average_rating}/5.0</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Credits</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{agent.credits_per_1k}/1k</div>
                </div>
              </div>

              <div className="mb-8 animate-item">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.strengths?.map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium shadow-sm"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onHire(agent.id)}
                className="w-full btn btn-primary py-3 text-base shadow-lg shadow-primary-500/25 animate-item group"
              >
                <span className="flex items-center justify-center gap-2">
                  Hire {agent.name}
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {MOCK_AGENTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-8 bg-primary-600" : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
