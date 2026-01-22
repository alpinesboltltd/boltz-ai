"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const useCases = [
  {
    id: "sales",
    label: "Sales",
    headline: "Q3 Revenue Targets Hit.",
    description:
      "Agent qualifies leads, books meetings, and follows up instantly. No lead left cold.",
    metric: "+40% Conversion",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "support",
    label: "Support",
    headline: "Zero Backlog.",
    description:
      "Agent resolves Level 1 & 2 tickets 24/7. Escalates only when human empathy is required.",
    metric: "-80% Response Time",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "ops",
    label: "Ops",
    headline: "Books Closed.",
    description:
      "Agent reconciles invoices, chases payments, and categorizes expenses automatically.",
    metric: "100% Accuracy",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "va",
    label: "VA",
    headline: "Calendar Orchestrated.",
    description:
      "Manage complex scheduling, travel bookings, and inbox triage without lifting a finger.",
    metric: "20h/Week Saved",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "marketing",
    label: "Marketing",
    headline: "Campaigns Optimized.",
    description:
      "Analyze ad performance, adjust bids, and generate reports across all channels in real-time.",
    metric: "3x ROAS",
    color: "from-purple-500 to-violet-500",
  },
];

export default function UseCaseSliderSection() {
  const [activeTab, setActiveTab] = useState(useCases[0].id);
  const activeIndex = useCases.findIndex((c) => c.id === activeTab);
  const [direction, setDirection] = useState(0);

  const changeTab = (newId: string) => {
    const newIndex = useCases.findIndex((c) => c.id === newId);
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveTab(newId);
  };

  const activeCase = useCases.find((c) => c.id === activeTab) || useCases[0];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <section className="py-32 bg-[#050505] dark:bg-[#050505] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
            Stop Managing Tasks.
            <br />
            Start Orchestrating Outcomes.
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16 overflow-x-auto scrollbar-hide">
          <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
            {useCases.map((uc) => (
              <button
                key={uc.id}
                onClick={() => changeTab(uc.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === uc.id
                    ? "bg-white text-black shadow-lg scale-105"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {uc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Slider */}
        <div className="relative max-w-5xl mx-auto min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full"
            >
              {/* Granite/Dark Card Background */}
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#1c1c1c] shadow-2xl min-h-[500px] flex flex-col md:flex-row">
                {/* Visual Side (Gradient Pulse) */}
                <div className="absolute inset-0 w-full h-full opacity-20">
                  <div
                    className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${activeCase.color} blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none`}
                  />
                </div>

                {/* Noise Texture Overlay (Optional "Granite" feel) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between w-full p-12 md:p-16">
                  <div className="space-y-8 max-w-xl">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase border border-white/5"
                    >
                      Outcome
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
                    >
                      {activeCase.headline}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed"
                    >
                      {activeCase.description}
                    </motion.p>
                  </div>

                  <div className="flex flex-col gap-6 items-start md:items-end min-w-[200px] mt-8 md:mt-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-6xl md:text-7xl font-bold text-white tracking-tighter"
                    >
                      {activeCase.metric}
                    </motion.div>
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-mono">
                      Impact Verified
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-12 px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-3 hover:bg-gray-200 transition-colors"
                    >
                      See Workflow <ArrowUpRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
