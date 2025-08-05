import { SparklesIcon } from "@heroicons/react/24/outline";
import Topic from "../ui/Topic";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import VideoPlayer from "../media/VideoPlayer";
import { CompWork } from "../ui/CompWork";

export function Features() {
  return (
    <section className=" px-4 sm:px-6 lg:px-8 mt-3">
      <Topic text="Features" Icon={SparklesIcon} className="bg-blue-50" />
      <div className="flex justify-content-center flex-col mt-3">
        <h1 className="font-semibold text-4xl">
          Everything you need to build advanced AI chatbots
        </h1>
        <p className="font-normal text-sm">
          Our platform combines the latest AI technology with an intuitive
          interface to help you create intelligent, conversational chatbots that
          engage your customers and drive results.
        </p>
      </div>
      <div>
        <div className="grid md:grid-cols-2 items-center mt-3">
          <Card className="my-2 sm:mx-2">
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Sync with real-time data" />
            <CardDescription text="Connect your agent to systems like order management tools, CRMs, and more to seamlessly access data ranging from order details to active subscriptions and beyond." />
          </Card>
          <Card className="my-2 sm:mx-2">
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Take actions on your systems" />
            <CardDescription text="Configure actions that your agent can perform within your systems or through one of our integrations, like updating a customer's subscription or changing their address." />
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center mt-3">
          <Card className="my-2 sm:mx-2">
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Compare AI models" />
            <CardDescription text="Connect your agent to systems like order management tools, CRMs, and more to seamlessly access data ranging from order details to active subscriptions and beyond." />
          </Card>
          <Card className="my-2 sm:mx-2">
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Smart escalation" />
            <CardDescription text="Give your agent instructions in natural language on when to escalate queries to a human agents." />
          </Card>
          <Card className="my-2 sm:mx-2">
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Advanced reporting" />
            <CardDescription text="Gain insights and optimize agent performance with detailed analytics." />
          </Card>
        </div>

        <Card className="flex flex-col lg:flex-row justify-content-center">
          <div className="sm:w-[15vw]">
            <CardTitle text="Works with your tools" />

            <CardDescription text="Integrate diverse data sources to enrich your agent's knowledge and capabilities." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap gap-3 ml-3">
            <CompWork text="Stripe" src="/images/stripe.png" />
            <CompWork text="Paystack" src="/images/paystack.png" />
            <CompWork text="Whatsapp" src="/images/whatsapp.png" />
            <CompWork text="Messenger" src="/images/messenger.png" />
            <CompWork text="G-Calendar" src="/images/googlecalendar.png" />
            <CompWork text="Cal" src="/images/cal.png" />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-3">
        <div className="flex ">
          <div className="mr-3">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="w-96">
            <CardTitle text="Whitelabel" />
            <CardDescription text="Remove any Chatbase branding from the chat widget." />
          </div>
        </div>
        <div className="flex ">
          <div className="mr-3">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="w-96">
            <CardTitle text="Always improving" />
            <CardDescription text="Syncs with your systems and learns from previous interactions." />
          </div>
        </div>
      </div>
    </section>
  );
}
