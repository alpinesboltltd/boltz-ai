import {
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PaintBrushIcon,
  UserGroupIcon,
  CodeBracketIcon,
  LanguageIcon,
  ArrowsRightLeftIcon,
  PhoneArrowUpRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Custom AI Model Selection",
    description:
      "Choose from multiple AI models including Google Gemini, GPT-4, Claude, and Mistral to power your chatbot.",
    icon: CpuChipIcon,
  },
  {
    name: "No-Code Chatbot Builder",
    description:
      "Build and customize your chatbot without writing a single line of code using our intuitive drag-and-drop interface.",
    icon: CubeTransparentIcon,
  },
  {
    name: "Knowledge Base Integration",
    description:
      "Train your chatbot with your documents, FAQs, and website data to provide accurate and relevant responses.",
    icon: DocumentTextIcon,
  },
  {
    name: "Real-time Training",
    description:
      "Update and improve your chatbot's responses in real-time as you receive user feedback.",
    icon: ArrowPathIcon,
  },
  {
    name: "Multi-channel Deployment",
    description:
      "Deploy your chatbot on your website, WhatsApp, Slack, and social media platforms with a single click.",
    icon: GlobeAltIcon,
  },
  {
    name: "Advanced Analytics",
    description:
      "Track user interactions, conversation quality, and conversion metrics with detailed analytics dashboards.",
    icon: ChartBarIcon,
  },
  {
    name: "Multilingual Support",
    description:
      "Communicate with your customers in over 80 languages with automatic language detection and translation.",
    icon: LanguageIcon,
  },
  {
    name: "Enterprise-grade Security",
    description:
      "Keep your data safe with end-to-end encryption, GDPR compliance, and advanced security features.",
    icon: ShieldCheckIcon,
  },
  {
    name: "White Labeling",
    description:
      "Customize the chatbot with your brand colors, logo, and domain for a seamless brand experience.",
    icon: PaintBrushIcon,
  },
  {
    name: "Live Human Handoff",
    description:
      "Seamlessly transfer conversations to human agents when AI assistance isn't sufficient.",
    icon: PhoneArrowUpRightIcon,
  },
  {
    name: "Team Collaboration",
    description:
      "Work together with your team to build, train, and improve your chatbots with role-based permissions.",
    icon: UserGroupIcon,
  },
  {
    name: "API Access",
    description:
      "Integrate your chatbot with your existing systems using our comprehensive API.",
    icon: CodeBracketIcon,
  },
];

export function FeaturesSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Powerful Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build advanced AI chatbots
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines the latest AI technology with an intuitive
            interface to help you create intelligent, conversational chatbots
            that engage your customers and drive results.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16 transition-all duration-300 hover:translate-y-[-5px]">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-md">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
