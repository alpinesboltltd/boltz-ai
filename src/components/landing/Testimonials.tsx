"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { AdvantagesV } from "../ui/AdvantagesV";
import { CompWork } from "../ui/CompWork";

const CARD_PER_PAGE = 3;

export function Testimonials() {
  return (
    <section className="mt-3 sm:px-6 lg:px-8">
      <Topic
        text="What people say"
        Icon={SparklesIcon}
        className="bg-blue-50"
      />
      <h1 className="font-semibold text-5xl text-center mb-4">
        With over 9000 clients served, here's what they have to say
      </h1>

      <div className="flex gap-4 overflow-hidden mb-4 p-2">
        <Card className="w-2/3">
          <p className="text-sm text-gray-600 mb-28">
            "Chatbase is a strong signal of how customer support will evolve. It
            is an early adopter of the agentic approach, which will become
            increasingly effective, trusted, and prominent."
          </p>
          <CompWork text="Marc Manara" work="OpenAI" src="/images/logo.webp" />
        </Card>
        <Card className="w-1/2">
          <p className="text-sm text-gray-600 mb-28">
            "This is awesome, thanks for building it!"
          </p>
          <CompWork
            text="Logan Kilpatrick"
            work="Google"
            src="/images/logo.webp"
          />
        </Card>
        <Card className="w-1/3">
          <CardHeader src="/images/logo.webp" />
          <CardTitle text="9000+" className="*text-5xl" />
          <CardDescription text="businesses trust Chatbase" />
        </Card>
      </div>
      <div className="flex gap-4 overflow-hidden mb-4 p-2">
        <Card className="w-1/3">
          <CardHeader src="/images/logo.webp" />
          <CardTitle text="9000+" className="*text-5xl" />
          <CardDescription text="businesses trust Chatbase" />
        </Card>
        <Card className="w-1/2">
          <p className="text-sm text-gray-600 mb-28">
            "An overpowered tool built with the OP stack."
          </p>
          <CompWork text="Greg Kogan" work="Pinecone" src="/images/logo.webp" />
        </Card>
        <Card className="w-2/3">
          <p className="text-sm text-gray-600 mb-28">
            "Chatbase is a strong signal of how customer support will evolve. It
            is an early adopter of the agentic approach, which will become
            increasingly effective, trusted, and prominent."
          </p>
          <CompWork text="Marc Manara" work="OpenAI" src="/images/logo.webp" />
        </Card>
      </div>
    </section>
  );
}
