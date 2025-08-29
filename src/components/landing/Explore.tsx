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
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Topic
          text="Platform Features"
          Icon={SparklesIcon}
          className="bg-blue-50 mb-6"
        />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-12">
          Discover the Helix Ai Platform
        </h2>
        <div className="hidden sm:flex justify-center gap-8 mb-12">
          {ExploreV.map((item, i) => (
            <button
              key={i}
              className={clsx(
                "px-6 py-4 rounded-lg transition-all duration-300 flex items-center gap-3",
                activeTab === i
                  ? "bg-primary-600 text-white scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
              onClick={() => setActiveTab(i)}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </div>
        <div className="hidden sm:block">
          <Card className="p-6 bg-white">
            <img
              src={ExploreV[activeTab].src}
              alt={ExploreV[activeTab].title}
              className="w-full rounded-xl"
            />
          </Card>
        </div>
        <div className="block sm:hidden">
          <Card className="p-6 bg-white mb-6">
            <img
              src={ExploreV[activeTab].src}
              alt={ExploreV[activeTab].title}
              className="w-full rounded-xl mb-4"
            />
            <div className="flex items-center gap-2 justify-center">
              <ActiveIcon className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900">
                {ExploreV[activeTab].title}
              </span>
            </div>
          </Card>
          <div className="flex justify-center gap-2">
            {ExploreV.map((item, i) => (
              <button
                key={i}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === i
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-300"
                )}
                onClick={() => setActiveTab(i)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
