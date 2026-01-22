"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap"; // Ensure gsap is installed and available
import { ArrowRightIcon } from "lucide-react"; // Or @heroicons/react
import WaitlistModal from "../shared/WaitlistModal";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image Reveal
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" }
      );

      // Text Staggered Reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-text-reveal",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, delay: 0.5 }
      );

      // Button Breathing Effect
      gsap.to(".hero-btn-glow", {
        boxShadow: "0 0 20px 5px rgba(14, 165, 233, 0.5)",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505] text-white flex items-center justify-center"
    >
      {/* Background Constellation */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <Image
          src="/assets/landing/constellation.png"
          alt="Constellation Network"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Gradient Overlay for Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div ref={textRef} className="space-y-8 max-w-5xl mx-auto">
          {/* Headline */}
          {/* <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            <span className="block overflow-hidden">
              <span className="hero-text-reveal block">
                The Limitation to Growth
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-text-reveal block">
                is No Longer Capital.
              </span>
            </span>
            <span className="block overflow-hidden mt-4">
              <span className="hero-text-reveal block text-gradient">
                It is Capacity.
              </span>
            </span>
          </h1> */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <span className="block">A Workforce That Gets It</span>
            <span className="text-primary-400 block">— and Gets It Done.</span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-text-reveal text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {/* Your ambition is infinite, but the human engine has limits. We have
            entered the era of autonomy. Deploy a workforce that doesn't just
            follow a script, but understands the goal. */}
            Hire a digital workforce that understands your business context and
            delivers outcomes
          </p>

          {/* CTA Buttons */}
          <div className="hero-text-reveal flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="hero-btn-glow group relative px-8 py-4 bg-[#0ea5e9] text-white rounded-full font-semibold text-lg hover:bg-[#0284c7] transition-all duration-300 flex items-center gap-2"
            >
              Join the Waitlist
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="px-8 py-4 text-gray-300 hover:text-white font-medium text-lg flex items-center gap-2 hover:bg-white/5 rounded-full transition-all">
              <span className="size-8 rounded-full border border-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch the Vision
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
