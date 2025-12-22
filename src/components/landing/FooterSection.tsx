"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import WaitlistModal from "../shared/WaitlistModal";

export default function FooterSection() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <footer className="py-24 bg-[#050505] text-white border-t border-white/10">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-8 mb-12">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Your Infinite Workforce is Ready.
          </h2>
          <p className="text-xl text-gray-400">Level 4 Autonomy is here.</p>
        </div>

        <button
          onClick={() => setIsWaitlistOpen(true)}
          className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-2"
        >
          Join the Waitlist
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-24 text-sm text-gray-600 flex justify-between items-center border-t border-white/5 pt-8">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Level-X. All rights reserved.
          </div>
        </div>
      </div>
      <WaitlistModal
        isOpen={isWaitlistOpen}
        closeModal={() => setIsWaitlistOpen(false)}
      />
    </footer>
  );
}
