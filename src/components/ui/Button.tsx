"use client";

import { cn } from "@/lib/utils";
import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const BASE_STYLES =
  "rounded-md transition duration-150 ease-in-out shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-indigo-500",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost:
    "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  outline:
    "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[10]",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  let finalStyles = BASE_STYLES;

  finalStyles = cn(finalStyles, VARIANT_STYLES[variant], SIZE_STYLES[size]);

  finalStyles = cn(finalStyles, className);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalStyles}
      {...props}
    >
      {children}
    </button>
  );
};
