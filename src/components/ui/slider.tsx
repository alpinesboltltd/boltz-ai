import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> {
  onValueChange?: (val: number[]) => void;
  defaultValue?: number[];
  max?: number;
  step?: number;
}

// Simplified Slider using input[type=range] to avoid complex radix-ui dependency
const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    { className, onValueChange, defaultValue, max = 100, step = 1, ...props },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange([parseFloat(e.target.value)]);
      }
    };

    return (
      <input
        type="range"
        className={cn(
          "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
          className
        )}
        defaultValue={defaultValue ? defaultValue[0] : 0}
        max={max}
        step={step}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
