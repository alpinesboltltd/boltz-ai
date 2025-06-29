"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import VideoPlayer from "../media/VideoPlayer";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { ExploreV } from "../ui/ExploreV";

export function Explore() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveIcon = ExploreV[activeTab].icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % ExploreV.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8 bg-black rounded-2xl mt-3">
      <Topic text="Features" Icon={SparklesIcon} className="bg-blue-50" />
      <h1 className="font-semibold text-white text-4xl mt-3">
        Discover the Chatbase platform
      </h1>
      <div className="hidden sm:flex flex-row justify-around gap-1">
        {ExploreV.map((item, i) => (
          <div
            key={i}
            className={clsx(
              "p-5 cursor-pointer transition-all duration-500 mb-5 flex text-white",
              activeTab === i
                ? "scale-y-125 bg-foundation-accent-900 border-blue-500 border-b-4"
                : "scale-y-100"
            )}
            onClick={() => setActiveTab(i)}
          >
            <p
              className={clsx(
                activeTab === i
                  ? "font-semibold text-xl text-blue-500 flex items-center"
                  : "text-xl flex items-center"
              )}
            >
              <ActiveIcon className="w-4 h-4 text-blue-600" />
              {item.title}
            </p>
          </div>
        ))}
      </div>
      <div className="hidden sm:block md:block">
        <Card className="p-3">
          <img src={ExploreV[activeTab].src} className="rounded-2xl" />
        </Card>
      </div>
      <div className="block sm:hidden">
        <Card className="p-5 text-white bg-foundation-accent-900 mb-4">
          <div className="flex flex-col items-center gap-4">
            <img
              src={ExploreV[activeTab].src}
              alt={ExploreV[activeTab].title}
              className="w-full max-w-xs"
            />
            <p className="text-sm font-semibold text-black flex items-center gap-2">
              <ActiveIcon className="w-4 h-4 text-blue-600" />
              {ExploreV[activeTab].title}
            </p>
          </div>
        </Card>
        <div className="flex flex-row justify-around gap-1">
          {ExploreV.map((item, i) => (
            <div
              key={i}
              className={clsx(
                "p-3 rounded-md cursor-pointer transition-all duration-300 text-white",
                activeTab === i
                  ? "bg-foundation-accent-800 border-blue-500 border-b-4"
                  : "bg-foundation-accent-600"
              )}
              onClick={() => setActiveTab(i)}
            >
              <p className="text-sm text-center">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
