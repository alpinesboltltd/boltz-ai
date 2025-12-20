import Link from "next/link";
import VideoPlayer from "../media/VideoPlayer";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-white flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="block">AI Support That Gets It</span>
              <span className="text-primary-600 block">
                — and Gets It Done.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Build multimodal, text, and voice AI agents that understand your
              business and deliver exceptional customer experiences.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Building Free
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
          {/* Video Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <VideoPlayer
                src="/videos/heroAi.mp4"
                type="video/mp4"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
