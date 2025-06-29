"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import VideoPlayer from "../media/VideoPlayer";
import { HowItWorksV } from "../ui/HowItWorksV";
import { useState } from "react";
import clsx from "clsx";
import { Card } from "../ui/Card";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="mt-3 sm:px-6 lg:px-8">
      <Topic text="How it works" Icon={SparklesIcon} className="bg-blue-50" />
      <div className="grid md:grid-cols-2 place-items-end mt-3">
        <h1 className="font-semibold text-4xl">
          An end-to-end solution for conversational AI
        </h1>
        <p className="font-normal text-sm">
          With Chatbase, your customers can effortlessly find answers, resolve
          issues, and take meaningful actions through seamless and engaging
          AI-driven conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 bg-foundation-primary-400 gap-1 mt-10 items-center ">
        <div className="flex flex-col gap-1 hidden sm:block">
          {HowItWorksV.map((item, i) => (
            <div
              key={i}
              className={clsx(
                "p-5 rounded-2xl cursor-pointer transition-all duration-500 mb-5 flex",
                activeTab === i
                  ? "scale-y-125 bg-foundation-accent-900 border-2 border-blue-500"
                  : "scale-y-100"
              )}
              onClick={() => setActiveTab(i)}
            >
              <p
                className={clsx(
                  "hidden sm:block mr-2",
                  activeTab === i ? "text-blue-500" : "text-gray-700"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </p>

              <div className="hidden sm:block">
                <p
                  className={clsx(
                    activeTab === i
                      ? "font-semibold text-xl text-blue-500"
                      : "text-xl"
                  )}
                >
                  {item.title}
                </p>
                {activeTab === i && (
                  <p className="text-foundation-primary-50 text-sm">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block md:block">
          <Card className="p-3">
            <VideoPlayer
              src={HowItWorksV[activeTab].src}
              className="rounded-2xl"
            />
          </Card>
        </div>

        <div className="block sm:hidden">
          {HowItWorksV.map((item, i) => (
            <Card key={i} className="mb-4 p-3">
              <VideoPlayer src={item.src} className="rounded-2xl" />
              <p className="text-sm text-blue-500 mt-2">
                {String(i + 1).padStart(2, "0")} - {item.title}
              </p>
              <p className="text-xs text-foundation-primary-50">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
