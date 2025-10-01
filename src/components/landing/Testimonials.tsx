"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/Card";
import { AdvantagesV } from "../ui/AdvantagesV";
import { CompWork } from "../ui/CompWork";
import Image from "next/image";

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
        <Card className="w-2/3 bg-white">
          <CardContent>
            <p className="text-sm text-gray-600 mb-28">
              "Boltz is a strong signal of how customer support will evolve. It is
              an early adopter of the agentic approach, which will become
              increasingly effective, trusted, and prominent."
            </p>
            <CompWork text="Marc Manara" work="OpenAI" src="/images/logo.webp" />
          </CardContent>
        </Card>
        <Card className="w-1/2 bg-white">
          <CardContent>
            <p className="text-sm text-gray-600 mb-28">
              "This is awesome, thanks for building it!"
            </p>
            <CompWork
              text="Logan Kilpatrick"
              work="Google"
              src="/images/logo.webp"
            />
          </CardContent>
        </Card>
        <Card className="w-1/3 bg-white">
          <CardContent className="flex flex-col items-center gap-2">
            <Image
              height={48}
              width={48}
              src="/images/logo.webp"
              alt="icon"
              className="w-12 h-12 object-contain"
            />
            <CardTitle className="text-5xl">9000+</CardTitle>
            <CardDescription>businesses trust Boltz</CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 overflow-hidden mb-4 p-2">
        <Card className="w-1/3 bg-white">
          <CardContent className="flex flex-col items-center gap-2">
            <Image
              height={48}
              width={48}
              src="/images/logo.webp"
              alt="icon"
              className="w-12 h-12 object-contain"
            />
            <CardTitle className="text-5xl">9000+</CardTitle>
            <CardDescription>businesses trust Boltz</CardDescription>
          </CardContent>
        </Card>
        <Card className="w-1/2 bg-white">
          <CardContent>
            <p className="text-sm text-gray-600 mb-28">
              "An overpowered tool built with the OP stack."
            </p>
            <CompWork text="Greg Kogan" work="Pinecone" src="/images/logo.webp" />
          </CardContent>
        </Card>
        <Card className="w-2/3 bg-white">
          <CardContent>
            <p className="text-sm text-gray-600 mb-28">
              "Boltz is a strong signal of how customer support will evolve. It is
              an early adopter of the agentic approach, which will become
              increasingly effective, trusted, and prominent."
            </p>
            <CompWork text="Marc Manara" work="OpenAI" src="/images/logo.webp" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
