import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

export function Highlights() {
  return (
    <section className="sm:px-6 lg:px-8 mt-3">
      <Topic text="Hightlights" Icon={SparklesIcon} className="bg-blue-50" />
      <div className="grid md:grid-cols-2 place-content-end place-items-end mt-3 gap-1">
        <h1 className="font-semibold text-4xl">
          The complete platform for AI support agents
        </h1>
        <p className="font-normal text-sm">
          Chatbase is designed for building AI support agents that solve your
          customers' hardest problems while improving business outcomes.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4 mt-6">
        <Card>
          <CardHeader src="/img/logo10.png" />
          <CardTitle text="Purpose-built for LLMs" />
          <CardDescription text="Language models with reasoning capabilities for effective responses to complex queries." />
        </Card>
        <Card>
          <CardHeader src="/img/logo10.png" />
          <CardTitle text="Designed for simplicity" />
          <CardDescription text="Create, manage, and deploy AI Agents easily, even without technical skills." />
        </Card>
        <Card>
          <CardHeader src="/img/logo10.png" />
          <CardTitle text="Engineered for security" />
          <CardDescription text="Enjoy peace of mind with robust encryption and strict compliance standards." />
        </Card>
      </div>
    </section>
  );
}
