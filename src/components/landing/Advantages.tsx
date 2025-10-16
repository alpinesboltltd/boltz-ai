"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/Card";
import { AdvantagesV } from "../ui/AdvantagesV";
import Image from "next/image";

const CARD_PER_PAGE = 3;

export function Advantages() {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index + CARD_PER_PAGE < AdvantagesV.length) {
      setIndex(index + CARD_PER_PAGE);
    }
  };

  const prev = () => {
    if (index - CARD_PER_PAGE >= 0) {
      setIndex(index - CARD_PER_PAGE);
    }
  };

  return (
    <section className="mt-3 sm:px-6 lg:px-8">
      <Topic text="How it works" Icon={SparklesIcon} className="bg-blue-50" />
      <h1 className="font-semibold text-5xl text-center mb-4">
        Unlock the power of AI-driven Agents
      </h1>

      <div className="flex gap-4 overflow-hidden mb-4 p-2">
        {AdvantagesV.slice(index, index + CARD_PER_PAGE).map((item, i) => (
          <Card key={i} className="w-1/3 bg-white">
            <CardContent className="p-0">
              <Image
                height={40}
                width={40}
                src={item.src}
                alt={item.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
            </CardContent>
            <CardContent>
              <CardTitle className="text-lg font-bold text-gray-800">{item.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={prev} className="px-4 py-2 bg-gray-300 rounded">
          ←
        </button>
        <button onClick={next} className="px-4 py-2 bg-gray-300 rounded">
          →
        </button>
      </div>
    </section>
  );
}
