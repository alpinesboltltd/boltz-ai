import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-primary-600 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Build Your AI Agent?
        </h2>
        <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
          Join thousands of businesses using AI agents to transform their
          customer experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Building Free
          </Link>
          <Link
            href="/dashboard/chatagents/create"
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
          >
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
