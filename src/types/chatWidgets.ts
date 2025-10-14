// Reusable chat widget related types for the chat interface / interactive widgets

export interface CalendarWidgetData {
  availableTimes: string[];
}

export interface Card {
  id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface PaymentWidgetData {
  savedCards: Card[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface ProductWidgetData {
  products: Product[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface SubscriptionWidgetData {
  currentPlan: string;
  availablePlans: Plan[];
}

// Placeholder for future bank transfer metadata
// Represents a widget with no associated data currently
export type BankTransferWidgetData = Record<string, never>;

export type ChatWidget =
  | { type: "calendar"; data: CalendarWidgetData }
  | { type: "payment"; data: PaymentWidgetData }
  | { type: "products"; data: ProductWidgetData }
  | { type: "subscription"; data: SubscriptionWidgetData }
  | { type: "bankTransfer"; data: BankTransferWidgetData };

// Local chat interface message type (distinct from backend Message in types/index.ts)
export interface ChatInterfaceMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  audioUrl?: string;
  hasVoice?: boolean;
  widget?: ChatWidget;
}
