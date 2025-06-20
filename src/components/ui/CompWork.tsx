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
    className={`flex items-center mx-1 gap-3 rounded-full px-3 py-1 bg-gray-300  flex-grow ${className}`}
  >
    <Image
      src={src}
      alt="icon"
      height={40}
      width={40}
      className="w-8 rounded-full aspect-square"
    />
    <p className={`text-lg font-bold text-gray-800 ${className}`}>{text}</p>
    <p className={`text-lg  text-gray-400 ${className}`}>{work}</p>
  </div>
);
