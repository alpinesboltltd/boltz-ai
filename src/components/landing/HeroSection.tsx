import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "../media/VideoPlayer";
import { Card } from "../ui/Card";

export function HeroSection() {
  return (
    <section className="w-full py-10 md:py-20 bg-white">
      <div className="w-full xl:max-w-7xl xl:mx-auto xl:px-0 px-2 sm:px-4 md:px-8 flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16 min-h-[420px] lg:min-h-[520px]">
        {/* Text Section (left) */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left justify-center h-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            <span className="block">AI Support That Gets It</span>
            <span className="text-primary-600 block">— and Gets It Done.</span>
            <span className="block text-lg md:text-xl font-medium mt-2 text-gray-700">
              For Your Customers
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-500 max-w-xl">
            Deploy AI support that scales with your business — and sounds like
            your brand.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors shadow"
            >
              Get started for free
            </Link>
            <Link
              href="/dashboard/chatbots/create"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors shadow"
            >
              Create a chatbot
            </Link>
          </div>
        </div>
        {/* Video/Card Section (right) */}
        <div className="w-full lg:w-1/2 flex items-stretch justify-center h-full">
          <div className="relative w-full max-w-lg h-full min-h-[320px] lg:min-h-0 flex-1 rounded-2xl shadow-lg overflow-hidden bg-gray-200 flex">
            <VideoPlayer
              src="/videos/heroAi.mp4"
              type="video/mp4"
              className="w-full h-full object-cover rounded-2xl min-h-[320px] lg:min-h-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
/**          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-white text-xl font-medium"> */
