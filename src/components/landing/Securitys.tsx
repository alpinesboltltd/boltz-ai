"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/Card";
import { Privacy } from "../ui/AdvantagesV";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Securitys() {
  return (
    <section className="mt-3 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between">
        <div className="w-1/3">
          <Topic
            text="What people say"
            Icon={SparklesIcon}
            className="bg-blue-50"
          />
          <h1 className="font-semibold text-5xl  mb-4">
            Enterprise-grade security & privacy
          </h1>
          <p>
            We take security and compliance seriously. Boltz is SOC 2 Type II
            and GDPR compliant, trusted by thousands of businesses to build
            secure and compliant AI Agents.
          </p>
          <div className="flex gap-3">
            <Image
              height={500}
              width={500}
              src="/img/logo.webp"
              className="w-32 h-32"
              alt="Security certification"
            />
            <Image
              height={500}
              width={500}
              src="/img/logo.webp"
              className="w-32 h-32"
              alt="Compliance certification"
            />
          </div>
        </div>
        <Card className="bg-white border-b-2">
          <CardContent className="flex flex-col">
            {Privacy.map((_item, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col lg:flex-row items-center justify-between gap-4 p-4",
                  i % 2 !== 0 && "border-y border-gray-200"
                )}
              >
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">Your data stays yours</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Your data is only accessible to your AI agent and is never used to train models.</CardDescription>
                </div>
                <Image
                  height={500}
                  width={500}
                  src="/img/logo.webp"
                  className="w-32 h-32 object-contain"
                  alt="Privacy feature illustration"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
