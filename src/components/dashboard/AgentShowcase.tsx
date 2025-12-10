"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Star, Zap, Shield, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { systemAPI } from "@/lib/api";

interface ShowcaseAgent {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ai_model: string;
  average_rating: number;
  credits_per_1k: number;
  strengths: string[];
}

export const AgentShowcase = ({ onHire }: { onHire: (id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [agents, setAgents] = useState<ShowcaseAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await systemAPI.listTemplates();
        const templates = res.data || [];

        // Map templates to showcase format with some default/randomized visual data
        const mappedAgents: ShowcaseAgent[] = templates.map((t: any, idx: number) => ({
          id: t.id,
          name: t.title,
          description: t.content.length > 150 ? t.content.substring(0, 150) + "..." : t.content,
          imageUrl: `/images/agents/agent-${(idx % 5) + 1}.webp`, // Assuming you have some agent images
          ai_model: "GPT-4", // Default or could be part of template metadata if extended
          average_rating: 4.8 + (idx % 3) * 0.1,
          credits_per_1k: 10 + (idx % 5),
          strengths: ["Versatile", "Professional", "Efficient"],
        }));

        if (mappedAgents.length > 0) {
          setAgents(mappedAgents);
        } else {
          // Fallback if no templates found (optional, or show empty state)
          setAgents([]);
        }
      } catch (error) {
        console.error("Failed to fetch templates for showcase", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (agents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % agents.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [agents.length]);

  useEffect(() => {
    if (!cardRef.current || agents.length === 0) return;

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
  }, [currentIndex, agents.length]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">No templates available</h3>
        <p className="text-gray-500">Check back later for new agents.</p>
      </div>
    );
  }

  const agent = agents[currentIndex];

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
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                    🤖
                  </div>
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
                  <div className="text-xl font-bold text-gray-900">{agent.average_rating.toFixed(1)}/5.0</div>
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
          {agents.map((_, idx) => (
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
