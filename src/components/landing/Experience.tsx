import { CreditCardIcon } from "@heroicons/react/24/outline";

export function Experience() {
  return (
    <section className="mt-4 sm:px-6 lg:px-8 w-1/2 mx-auto">
      <div className="items-center justify-center flex flex-col">
        <h1 className="font-semibold text-5xl text-center">
          Make customer experience your competitive edge
        </h1>
        <p className="font-normal text-lg text-center mt-2">
          Use Chatbase to deliver exceptional support experiences that set you
          apart from the competition.
        </p>
        <button className="bg-slate-500 rounded p-2 m-2 hover:bg-gray-400 font-bold text-lg text-white">
          Build your agent
        </button>
        <p className="text-sm flex flex-row items-center gap-1">
          <CreditCardIcon className="h-4 w-4" />
          credit card required
        </p>
      </div>
    </section>
  );
}
