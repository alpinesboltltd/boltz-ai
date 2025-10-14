import Image from "next/image";
import React from "react";

export const CompWork = ({
  src,
  text,
  work,
  className = "",
}: {
  src: string;
  text: string;
  work?: string;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors ${className}`}
  >
    <Image
      src={src}
      alt={`${text} integration`}
      height={32}
      width={32}
      className="w-8 h-8 rounded-lg object-contain"
    />
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-900">{text}</p>
      {work && <p className="text-xs text-gray-500">{work}</p>}
    </div>
  </div>
);
