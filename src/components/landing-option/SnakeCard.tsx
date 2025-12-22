import React from "react";

interface SnakeCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SnakeCard = ({ children, className = "" }: SnakeCardProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-900 p-[1px] ${className}`}
    >
      {/* The Moving Gradient Layer */}
      <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

      {/* The Content Layer (Sits on top) */}
      <div className="relative h-full w-full rounded-xl bg-slate-950 px-8 py-6 backdrop-blur-3xl">
        {children}
      </div>
    </div>
  );
};
