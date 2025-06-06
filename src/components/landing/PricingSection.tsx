import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    price: '$0',
    description: 'Perfect for small projects and personal websites.',
    features: [
      '1,000 messages per month',
      'Basic chatbot customization',
      'Website integration',
      'Google Gemini AI model',
      'Email support',
    ],
    cta: 'Start for free',
    mostPopular: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    price: '$29',
    description: 'Ideal for growing businesses and e-commerce sites.',
    features: [
      '10,000 messages per month',
      'Advanced chatbot customization',
      'Website & WhatsApp integration',
      'All AI models (Gemini, GPT-4, Claude)',
      'Knowledge base integration',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Get started',
    mostPopular: true,
  },
  {
    name: 'Business',
    id: 'tier-business',
    price: '$99',
    description: 'For businesses with advanced needs and multiple channels.',
    features: [
      '50,000 messages per month',
      'Full chatbot customization',
      'All platform integrations',
      'All AI models with fine-tuning',
      'Advanced analytics',
      'Team collaboration',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    mostPopular: false,
  },
];

export function PricingSection() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`${
                tier.mostPopular
                  ? 'relative bg-white shadow-2xl ring-2 ring-primary-600 sm:mx-8 sm:rounded-lg lg:mx-0'
                  : 'bg-white sm:rounded-lg lg:mx-0'
              } ${
                tierIdx === 0 ? 'rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none' : ''
              } ${
                tierIdx === tiers.length - 1 ? 'rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none' : ''
              } p-8 ring-1 ring-gray-200 xl:p-10`}
            >
              {tier.mostPopular ? (
                <div className="absolute -top-5 right-0 left-0 mx-auto w-32 rounded-full bg-primary-600 px-3 py-2 text-center text-xs font-semibold text-white">
                  Most popular
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-x-4">
                <h3 id={tier.id} className="text-lg font-semibold leading-8 text-gray-900">
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
              </p>
              <a
                href={tier.mostPopular ? '/auth/register' : tier.name === 'Business' ? '/enterprise' : '/auth/register'}
                aria-describedby={tier.id}
                className={`${
                  tier.mostPopular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                } mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}
              >
                {tier.cta}
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            Need a custom plan? <a href="/enterprise" className="font-semibold text-primary-600 hover:text-primary-500">Contact us</a> for enterprise pricing.
          </p>
        </div>
      </div>
    </div>
  );
}