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
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Advanced Features & Integrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with your existing tools and unlock powerful capabilities for your AI agents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Sync with Real-time Data" />
            <CardDescription text="Connect your agent to order management, CRMs, and databases for instant access to customer information and order details." />
          </Card>
          <Card>
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Take Actions on Your Systems" />
            <CardDescription text="Enable your agent to update subscriptions, process refunds, schedule appointments, and perform actions across your business systems." />
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Compare AI Models" />
            <CardDescription text="Test different AI models side-by-side to find the perfect fit for your specific use case and performance requirements." />
          </Card>
          <Card>
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Smart Escalation" />
            <CardDescription text="Set natural language rules for when to escalate complex queries to human agents automatically." />
          </Card>
          <Card>
            <CardHeader src="/img/logo.webp" />
            <CardTitle text="Advanced Analytics" />
            <CardDescription text="Track performance metrics, conversation quality, and customer satisfaction with detailed reporting dashboards." />
          </Card>
        </div>

        {/* Integrations Section */}
        <Card className="p-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="lg:w-1/3">
              <CardTitle text="Works with Your Favorite Tools" className="text-2xl mb-4" />
              <CardDescription text="Seamlessly integrate with payment processors, communication platforms, and business tools to create a unified customer experience." className="text-lg" />
            </div>
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <CompWork text="Stripe" src="/images/stripe.png" />
              <CompWork text="Paystack" src="/images/paystack.png" />
              <CompWork text="WhatsApp" src="/images/whatsapp.png" />
              <CompWork text="Messenger" src="/images/messenger.png" />
              <CompWork text="Google Calendar" src="/images/googlecalendar.png" />
              <CompWork text="Cal.com" src="/images/cal.png" />
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <SparklesIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle text="White Label Solution" />
              <CardDescription text="Remove all Boltz branding and customize the interface to match your brand perfectly." />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <SparklesIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle text="Continuously Learning" />
              <CardDescription text="Your agent improves over time by learning from interactions and syncing with your business systems." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
