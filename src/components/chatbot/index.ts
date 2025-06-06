// Export all chatbot components for easier imports
export { BotPreview } from './BotPreview';
export { BotCustomizer } from './BotCustomizer';
export { BotPlayground } from './BotPlayground';

// Mock components that would be implemented in a real application
export const ChatInterface = () => null;
export const ModifiedCalendarWidget = ({ availableTimes, onTimeSelected, onClose }: any) => null;
export const WebsiteCrawler = ({ onSubmit }: any) => null;
export const TextTrainer = ({ onSubmit }: any) => null;
export const WhatsAppTrainer = ({ onSubmit }: any) => null;
export const SystemPromptEditor = ({ defaultPrompt, onSave }: any) => null;
export const IntegrationSettings = ({ onSave }: any) => null;