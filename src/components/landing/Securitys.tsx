"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import clsx from "clsx";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Privacy } from "../ui/AdvantagesV";

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
            We take security and compliance seriously. Chatbase is SOC 2 Type II
            and GDPR compliant, trusted by thousands of businesses to build
            secure and compliant AI Agents.
          </p>
          <div className="flex gap-3">
            <img src="/images/logo.png" className="w-32 h-32" />
            <img src="/images/logo.png" className="w-32 h-32" />
          </div>
        </div>
        <Card className="flex flex-col border-b-2">
          {Privacy.map((item, i) => (
            <div
              key={i}
              className={clsx(
                "flex flex-col lg:flex-row items-center justify-between gap-4 p-4",
                i % 2 !== 0 && "border-y border-gray-200"
              )}
            >
              <div>
                <CardTitle text="Your data stays yours" />
                <CardDescription text="Your data is only accessible to your AI agent and is never used to train models." />
              </div>
              <img
                src="/images/logo.png"
                className="w-32 h-32 object-contain"
              />
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
