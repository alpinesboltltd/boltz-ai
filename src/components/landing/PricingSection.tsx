import { CheckIcon } from "@heroicons/react/20/solid";

// FIXME: fetch from the database
const tiers = [
  {
    name: "Free",
    id: "tier-free",
    price: "$0",
    description: "Perfect for small projects and personal websites.",
    features: [
      "1,000 messages per month",
      "Basic chatagent customization",
      "Website integration",
      "Google Gemini AI model",
      "Email support",
    ],
    cta: "Start for free",
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    price: "$29",
    description: "Ideal for growing businesses and e-commerce sites.",
    features: [
      "10,000 messages per month",
      "Advanced chatagent customization",
      "Website & WhatsApp integration",
      "All AI models (Gemini, GPT-4, Claude)",
      "Knowledge base integration",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Get started",
    mostPopular: true,
  },
  {
    name: "Business",
    id: "tier-business",
    price: "$99",
    description: "For businesses with advanced needs and multiple channels.",
    features: [
      "50,000 messages per month",
      "Full chatagent customization",
      "All platform integrations",
      "All AI models with fine-tuning",
      "Advanced analytics",
      "Team collaboration",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    mostPopular: false,
  },
];

export function PricingSection() {
  return (
    <section className="min-h-screen bg-white py-24 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                tier.mostPopular
                  ? "ring-2 ring-primary-600 shadow-2xl scale-105"
                  : "ring-1 ring-gray-200"
              }`}
            >
              {tier.mostPopular ? (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className="text-lg font-semibold leading-8 text-gray-900"
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {tier.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  /month
                </span>
              </p>
              <a
                href={
                  tier.mostPopular
                    ? "/register"
                    : tier.name === "Business"
                      ? "/enterprise"
                      : "/register"
                }
                aria-describedby={tier.id}
                className={`${
                  tier.mostPopular
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                } mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}
              >
                {tier.cta}
              </a>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-primary-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600">
            Need a custom plan?{" "}
            <a
              href="/enterprise"
              className="font-semibold text-primary-600 hover:text-primary-500"
            >
              Contact us
            </a>{" "}
            for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
