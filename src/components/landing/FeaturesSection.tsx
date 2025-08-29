import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PhotoIcon,
  CpuChipIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";

const agentTypes = [
  {
    name: "Multimodal AI Agents",
    description: "Handle text, images, documents, and voice in one intelligent agent. Perfect for complex customer support scenarios.",
    icon: PhotoIcon,
    features: ["Image recognition", "Document processing", "Voice integration", "Multi-format responses"]
  },
  {
    name: "Text AI Agents", 
    description: "Lightning-fast text-based agents for chat, email, and messaging platforms. Optimized for quick, accurate responses.",
    icon: ChatBubbleLeftRightIcon,
    features: ["Instant responses", "Context awareness", "Multi-language", "Smart routing"]
  },
  {
    name: "Voice AI Agents",
    description: "Natural voice conversations with advanced speech recognition and synthesis. Handle phone calls like a human.",
    icon: MicrophoneIcon,
    features: ["Natural speech", "Real-time processing", "Emotion detection", "Call handling"]
  }
];

const coreFeatures = [
  {
    name: "Advanced AI Models",
    description: "Powered by GPT-4, Claude, Gemini, and other leading AI models for superior performance.",
    icon: CpuChipIcon,
  },
  {
    name: "Real-time Analytics",
    description: "Track performance, user satisfaction, and conversion metrics with detailed dashboards.",
    icon: ChartBarIcon,
  },
  {
    name: "Enterprise Security",
    description: "Bank-level security with encryption, compliance, and data protection built-in.",
    icon: ShieldCheckIcon,
  }
];

export function FeaturesSection() {
  return (
    <section className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <Topic text="Agent Types" Icon={PhotoIcon} className="bg-blue-50 mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Build Any Type of AI Agent Your Business Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From handling complex documents to natural voice conversations - create the perfect AI agent for every customer touchpoint.
          </p>
        </div>

        {/* Agent Types */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {agentTypes.map((agent) => (
            <div key={agent.name} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                <agent.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{agent.name}</h3>
              <p className="text-gray-600 mb-6">{agent.description}</p>
              <ul className="space-y-2">
                {agent.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Core Features */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Powerful Core Features</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {coreFeatures.map((feature) => (
            <div key={feature.name} className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
