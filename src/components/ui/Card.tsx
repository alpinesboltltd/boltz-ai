import React from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`p-6 bg-white rounded-2xl shadow-lg space-y-2 ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img src={src} alt="icon" className="w-12 h-12 object-contain" />
  </div>
);

export const CardTitle = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => (
  <h2 className={`text-lg font-bold text-gray-800 ${className}`}>{text}</h2>
);

export const CardDescription = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => <p className={`text-sm text-gray-600 ${className}`}>{text}</p>;
