import Link from 'next/link';

export function CTASection() {
  return (
    <div className="bg-primary-700">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to transform your customer experience?
          <br />
          <span className="text-primary-200">Start building your AI chatbot today.</span>
        </h2>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          <Link
            href="/auth/register"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get started for free
          </Link>
          <Link href="/dashboard/chatbots/create" className="text-sm font-semibold leading-6 text-white">
            Create a chatbot <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}