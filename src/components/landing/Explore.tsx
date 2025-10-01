"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import { Card, CardContent } from "@/components/ui/Card";
import { useEffect, useState, useRef } from "react";
import { ExploreV } from "../ui/ExploreV";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { gsap } from "gsap";

export function Explore() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveIcon = ExploreV[activeTab].icon;
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (newTab: number) => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setActiveTab(newTab);
          gsap.to(imageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    } else {
      setActiveTab(newTab);
    }

    // Center active tab on mobile without affecting page scroll
    if (scrollRef.current && window.innerWidth < 640) {
      const container = scrollRef.current;
      const activeButton = container.children[newTab] as HTMLElement;
      if (activeButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        const scrollLeft =
          activeButton.offsetLeft -
          containerRect.width / 2 +
          buttonRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleTabChange((activeTab + 1) % ExploreV.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <section className="bg-black py-12 sm:py-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <Topic
          text="Platform Features"
          Icon={SparklesIcon}
          className="bg-blue-50 mb-4 sm:mb-6"
        />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-12">
          Discover the Boltz Ai Platform
        </h2>

        {/* Desktop Tabs */}
        <div className="hidden sm:flex justify-center gap-4 lg:gap-8 mb-12">
          {ExploreV.map((item, i) => (
            <button
              key={i}
              className={cn(
                "px-6 py-4 rounded-lg transition-all duration-300 flex items-center gap-3",
                activeTab === i
                  ? "bg-primary-600 text-white scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
              onClick={() => handleTabChange(i)}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </div>

        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-2 sm:p-6">
            <div
              ref={imageRef}
              className="relative w-full aspect-video sm:aspect-[16/10] lg:aspect-[16/9] bg-transparent"
            >
              <Image
                src={ExploreV[activeTab].src}
                alt={ExploreV[activeTab].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                className="rounded-lg sm:rounded-xl object-cover"
                priority
              />
            </div>

            {/* Mobile Tab Title */}
            <div className="flex items-center gap-2 justify-center mt-3 sm:hidden">
              <ActiveIcon className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900">
                {ExploreV[activeTab].title}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Scrollable Tabs */}
        <div className="sm:hidden mt-4">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {ExploreV.map((item, i) => (
              <button
                key={i}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  activeTab === i
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-300"
                )}
                onClick={() => handleTabChange(i)}
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
