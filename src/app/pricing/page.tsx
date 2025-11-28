import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { pricingPlans as plans } from "@/lib/static/landing";



export default function PricingPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-primary-600">
            Pricing
          </h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that&#39;s right for you. All plans include a 14-day
            free trial.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${plan.highlighted ? "bg-primary-50 ring-primary-600" : "bg-white"
                }`}
            >
              <h2
                className={`text-lg font-semibold leading-8 ${plan.highlighted ? "text-primary-600" : "text-gray-900"
                  }`}
              >
                {plan.name}
              </h2>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /month
                  </span>
                )}
              </p>
              <p className="mt-6 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={`h-6 w-5 flex-none ${plan.highlighted
                        ? "text-primary-600"
                        : "text-primary-500"
                        }`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${plan.highlighted
                  ? "bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600"
                  : "bg-white text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300"
                  }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="text-left">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Can I switch plans later?
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                What happens if I exceed my message limit?
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                If you exceed your monthly message limit, you&#39;ll be charged
                a small fee per additional message. You can also upgrade to a
                higher plan.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Do you offer discounts for annual billing?
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Yes, you can save 20% by choosing annual billing instead of
                monthly billing.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                How does the 14-day free trial work?
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                You can try any plan for 14 days without being charged. No
                credit card required for the Free plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
