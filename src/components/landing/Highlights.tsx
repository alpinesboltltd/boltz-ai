import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { highlights } from "@/constants";

export function Highlights() {
  return (
    <section className="sm:px-6 lg:px-8 mt-3">
      <Topic text="Hightlights" Icon={SparklesIcon} className="bg-blue-50" />
      {/* <div className="grid md:grid-cols-2 place-content-end place-items-end mt-3 gap-1"> */}
      {/* <h1 className="font-semibold text-4xl">
          The Smarter Way to Build AI Agents That Do More Than Talk
        </h1> */}
      <h3 className="font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        Your AI should do more than answer — it should act, adapt, and evolve
        with your business.
      </h3>
      {/* </div> */}
      <div className="flex flex-wrap justify-start items-stretch gap-4 mt-6 px-4">
        {highlights.map((item) => (
          <Card key={item.title} className="shadow-none border">
            <CardHeader>
              <img src={item.src} alt={item.title} className="w-12 h-12 mb-4" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
