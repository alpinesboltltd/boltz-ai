import { CreditCardIcon } from "@heroicons/react/24/outline";

export function Experience() {
  return (
    <section className="bg-gray-900 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Make Customer Experience Your Competitive Edge
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Use Boltz AI to deliver exceptional support experiences that set you apart from the competition and drive customer loyalty.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
            Build Your Agent Now
          </button>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
