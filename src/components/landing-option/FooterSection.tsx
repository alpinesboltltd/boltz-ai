"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import WaitlistModal from "../shared/WaitlistModal";

export default function FooterSection() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <footer className="py-24 bg-[#020617] text-white border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-8 mb-12">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            Your Infinite Workforce is Ready.
          </h2>
          <p className="text-xl text-gray-400">Level 4 Autonomy is here.</p>
        </div>

        <button
          onClick={() => setIsWaitlistOpen(true)}
          className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all inline-flex items-center gap-2"
        >
          Join the Waitlist
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-24 text-sm text-gray-600 flex justify-center gap-8">
          <span className="hover:text-gray-400 cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-gray-400 cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-gray-400 cursor-pointer">Contact</span>
        </div>
        <div className="mt-8 text-gray-700 text-xs">
          &copy; {new Date().getFullYear()} Level-X. All rights reserved.
        </div>
      </div>
      <WaitlistModal
        isOpen={isWaitlistOpen}
        closeModal={() => setIsWaitlistOpen(false)}
      />
    </footer>
  );
}
