"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useCurrentUser } from "@/store/authStore";
import { Profile, UserRoles } from "@/types";
import { Switch } from "@headlessui/react";
import { toast } from "@/store/toastStore";
import { authAPI } from "@/lib/api";
import {
  User,
  Bell,
  CreditCard,
  Key,
  Building,
  Mail,
  Shield,
  Check,
  Copy,
  RefreshCw,
  Trash2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [liveMode, setLiveMode] = useState<boolean>(false);

  const [userData, setUserData] = useState<
    Profile & {
      notifications: { email: boolean; push: boolean; marketing: boolean };
      api_key: { test_key: string; live_key: string };
      company?: string;
      avatar?: string;
    }
  >({
    ...user!,
    company: "Acme Inc.",
    avatar: "/images/logo.webp",
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    api_key: {
      test_key: "alp_test_" + Math.random().toString(36).substring(2, 15),
      live_key: "alp_live_" + Math.random().toString(36).substring(2, 15),
    },
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "card_1",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2024,
      isDefault: true,
    },
    {
      id: "card_2",
      brand: "mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2025,
      isDefault: false,
    },
  ]);

  const [subscription] = useState({
    plan: "Pro",
    price: "$29/month",
    status: "active",
    nextBillingDate: "2023-12-01",
    features: [
      "10,000 messages per month",
      "Advanced agent customization",
      "Website & WhatsApp integration",
      "All AI models (Gemini, GPT-4, Claude)",
      "Knowledge base integration",
      "Analytics dashboard",
      "Priority support",
    ],
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Coming Soon", "Profile update is currently disabled.");
  };

  const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name === "email") {
      try {
        if (checked) {
          await authAPI.enableOTP(user?.email || "");
          toast.success("Success", "OTP enabled successfully");
        } else {
          await authAPI.disableOTP(user?.email || "");
          toast.success("Success", "OTP disabled successfully");
        }
      } catch (error) {
        console.error("Failed to update OTP settings:", error);
        toast.error("Error", "Failed to update OTP settings");
        return;
      }
    }

    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }));
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      toast.success("Updated", "Default payment method updated");
    } catch {
      toast.error("Failed", "Could not update payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
      toast.success("Removed", "Payment method removed successfully");
    } catch {
      toast.error("Failed", "Could not remove payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserData((prev) => ({
        ...prev,
        api_key: {
          live_key: liveMode
            ? `alp_live_${Math.random().toString(36).substring(2, 15)}`
            : userData.api_key.live_key,
          test_key: !liveMode
            ? `alp_test_${Math.random().toString(36).substring(2, 15)}`
            : userData.api_key.test_key,
        },
      }));
      toast.success("Regenerated", "API key regenerated successfully");
    } catch {
      toast.error("Failed", "Could not regenerate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="mt-2 text-gray-500">
          Manage your account, billing, and API preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 inline-flex">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "billing", label: "Billing", icon: CreditCard },
            { id: "api", label: "API Access", icon: Key },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white text-primary-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                Profile Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">Update your personal details and company info.</p>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                    <Image
                      src={userData.avatar || "/images/logo.webp"}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary text-sm"
                  >
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.name || "Admin"}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="input pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={userData.email!}
                        disabled
                        className="input pl-10 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.company}
                        onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                        className="input pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.role}
                        onChange={(e) => setUserData({ ...userData, role: e.target.value as UserRoles })}
                        className="input pl-10 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? <Spinner size="sm" color="white" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-500" />
                Notification Preferences
              </h3>
              <p className="mt-1 text-sm text-gray-500">Choose how you want to be notified.</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {[
                {
                  id: "email",
                  label: "Email Notifications",
                  desc: "Receive updates about agent activity and important alerts.",
                },
                {
                  id: "push",
                  label: "Push Notifications",
                  desc: "Get real-time browser alerts for immediate updates.",
                },
                {
                  id: "marketing",
                  label: "Marketing Emails",
                  desc: "Stay updated with new features and promotions.",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <label htmlFor={item.id} className="font-medium text-gray-900 block mb-1">
                      {item.label}
                    </label>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      id={item.id}
                      name={item.id}
                      type="checkbox"
                      checked={userData.notifications[item.id as keyof typeof userData.notifications]}
                      onChange={handleNotificationChange}
                      className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-500" />
                    Current Plan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">You are currently on the <span className="font-medium text-gray-900">{subscription.plan}</span> plan.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 uppercase tracking-wide">
                  {subscription.status}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{subscription.price}</span>
                </div>

                <div className="space-y-4 mb-8">
                  {subscription.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="btn btn-primary">Upgrade Plan</button>
                  <button className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50">Cancel Subscription</button>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
                        <span className={cn(
                          "text-xs font-bold",
                          method.brand === "visa" ? "text-blue-600" : "text-red-600"
                        )}>
                          {method.brand === "visa" ? "VISA" : "MC"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">•••• {method.last4}</p>
                        <p className="text-xs text-gray-500">Exp {method.expMonth}/{method.expYear}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {method.isDefault ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Default</span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button className="mt-auto w-full btn btn-secondary flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary-500" />
                API Configuration
              </h3>
              <p className="mt-1 text-sm text-gray-500">Manage your API keys for integration.</p>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Environment Mode</h4>
                  <p className="text-xs text-gray-500 mt-1">Toggle between Test and Live API keys.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-sm font-medium", !liveMode ? "text-primary-600" : "text-gray-500")}>Test</span>
                  <Switch
                    checked={liveMode}
                    onChange={setLiveMode}
                    className={cn(
                      liveMode ? "bg-primary-600" : "bg-gray-200",
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    )}
                  >
                    <span
                      className={cn(
                        liveMode ? "translate-x-6" : "translate-x-1",
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      )}
                    />
                  </Switch>
                  <span className={cn("text-sm font-medium", liveMode ? "text-primary-600" : "text-gray-500")}>Live</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={liveMode ? userData.api_key.live_key : userData.api_key.test_key}
                      className="input w-full font-mono text-sm bg-gray-50 text-gray-600"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          liveMode ? userData.api_key.live_key : userData.api_key.test_key
                        );
                        toast.success("Copied", "API key copied to clipboard");
                      } catch {
                        toast.error("Failed", "Could not copy API key");
                      }
                    }}
                    className="btn btn-secondary px-4"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Regenerate Key</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-md">
                      This will invalidate your current key immediately. Make sure to update your applications.
                    </p>
                  </div>
                  <button
                    onClick={handleRegenerateApiKey}
                    disabled={loading}
                    className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {loading ? <Spinner size="sm" /> : (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Regenerate
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
