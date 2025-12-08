import { SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
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
            Connect with your existing tools and unlock powerful capabilities
            for your AI agents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <Image src="/img/logo.webp" alt="Feature Icon" width={48} height={48} className="w-12 h-12 mb-4" />
              <CardTitle>Sync with Real-time Data</CardTitle>
              <CardDescription>
                Connect your agent to order management, CRMs, and databases for instant access to customer information and order details.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Image src="/img/logo.webp" alt="Feature Icon" width={48} height={48} className="w-12 h-12 mb-4" />
              <CardTitle>Take Actions on Your Systems</CardTitle>
              <CardDescription>
                Enable your agent to update subscriptions, process refunds, schedule appointments, and perform actions across your business systems.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Image src="/img/logo.webp" alt="Feature Icon" width={48} height={48} className="w-12 h-12 mb-4" />
              <CardTitle>Compare AI Models</CardTitle>
              <CardDescription>
                Test different AI models side-by-side to find the perfect fit for your specific use case and performance requirements.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Image src="/img/logo.webp" alt="Feature Icon" width={48} height={48} className="w-12 h-12 mb-4" />
              <CardTitle>Smart Escalation</CardTitle>
              <CardDescription>
                Set natural language rules for when to escalate complex queries to human agents automatically.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Image src="/img/logo.webp" alt="Feature Icon" width={48} height={48} className="w-12 h-12 mb-4" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Track performance metrics, conversation quality, and customer satisfaction with detailed reporting dashboards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Integrations Section */}
        <Card className="p-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="lg:w-1/3">
              <CardTitle className="text-2xl mb-4">
                Works with Your Favorite Tools
              </CardTitle>
              <CardDescription className="text-lg">
                Seamlessly integrate with payment processors, communication platforms, and business tools to create a unified customer experience.
              </CardDescription>
            </div>
            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
              <CompWork text="Stripe" src="/images/stripe.png" />
              <CompWork text="Paystack" src="/images/paystack.png" />
              <CompWork text="WhatsApp" src="/images/whatsapp.png" />
              <CompWork text="Messenger" src="/images/messenger.png" />
              <CompWork
                text="Google Calendar"
                src="/images/googlecalendar.png"
              />
              <CompWork text="Cal.com" src="/images/cal.png" />
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <SparklesIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle>White Label Solution</CardTitle>
              <CardDescription>
                Remove all Boltz branding and customize the interface to match your brand perfectly.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <SparklesIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle>Continuously Learning</CardTitle>
              <CardDescription>
                Your agent improves over time by learning from interactions and syncing with your business systems.
              </CardDescription>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
