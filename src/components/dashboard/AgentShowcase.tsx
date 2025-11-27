"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MOCK_AGENTS } from "@/constants";

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
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );

    const elements = cardRef.current.querySelectorAll(".animate-item");
    tl.fromTo(
      elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 },
      "-=0.6"
    );
  }, [currentIndex]);

  const agent = MOCK_AGENTS[currentIndex];

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-item">
        Discover Our AI Agents
      </h2>
      
      <div ref={cardRef} className="relative w-full max-w-2xl">
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-3xl shadow-2xl p-8 border border-primary-200">
          {/* Agent Image */}
          <div className="flex justify-center mb-6 animate-item">
            <div className="relative">
              <img
                src={agent.imageUrl}
                alt={agent.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                <span className="text-xl">⭐</span>
              </div>
            </div>
          </div>

          {/* Agent Name & Type */}
          <div className="text-center mb-6 animate-item">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h3>
            <p className="text-lg text-gray-600">{agent.description}</p>
            <span className="inline-block mt-2 px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {agent.ai_model}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md animate-item">
              <div className="text-sm text-gray-500 mb-1">Rating</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{agent.average_rating}</span>
                <span className="text-yellow-500">★★★★★</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md animate-item">
              <div className="text-sm text-gray-500 mb-1">Credits/1K</div>
              <div className="text-2xl font-bold text-primary-600">{agent.credits_per_1k}</div>
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-6 animate-item">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {agent.strengths?.map((strength, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 animate-item">
            <p className="text-gray-700 leading-relaxed">{agent.summary}</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onHire(agent.id)}
            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-item"
          >
            Hire {agent.name} Now
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {MOCK_AGENTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-primary-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
