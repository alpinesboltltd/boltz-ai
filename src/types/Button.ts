export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: React.ReactNode;

  variant?: ButtonVariant;

  size?: ButtonSize;

  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  disabled?: boolean;

  className?: string;

  type?: "button" | "submit" | "reset";
}
