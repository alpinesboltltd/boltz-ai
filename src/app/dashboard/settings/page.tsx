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

export default function SettingsPage() {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [liveMode, setLiveMode] = useState<boolean>(false);
  // Mock user data
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

  // Mock payment methods
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

  // Mock subscription data
  const [subscription] = useState({
    plan: "Pro",
    price: "$29/month",
    status: "active",
    nextBillingDate: "2023-12-01",
    features: [
      "10,000 messages per month",
      "Advanced chatagent customization",
      "Website & WhatsApp integration",
      "All AI models (Gemini, GPT-4, Claude)",
      "Knowledge base integration",
      "Analytics dashboard",
      "Priority support",
    ],
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Profile update is not yet supported by the backend
    toast.info("Coming Soon", "Profile update is currently disabled.");
  };

  const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // Only email notifications (OTP) are supported via API for now
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
        return; // Don't update state if API call failed
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
      // In production, this would call the real API
      // await fetch(`/api/payment-methods/${id}/default`, { method: 'PUT' });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      toast.success(
        "Payment Method Updated",
        "Default payment method has been updated"
      );
    } catch {
      toast.error("Update Failed", "Failed to set default payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    setLoading(true);

    try {
      // In production, this would call the real API
      // await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
      toast.success(
        "Payment Method Removed",
        "Payment method has been removed successfully"
      );
    } catch {
      toast.error("Removal Failed", "Failed to remove payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    setLoading(true);

    try {
      // In production, this would call the real API
      // const response = await fetch('/api/user/api-key', { method: 'POST' });
      // const data = await response.json();

      // For development, simulate API call
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
      toast.success(
        "API Key Regenerated",
        "Your API key has been regenerated successfully"
      );
    } catch {
      toast.error("Regeneration Failed", "Failed to regenerate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your account settings, payment methods, and subscription.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account information and profile details.
                </p>

                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        width={40}
                        height={40}
                        src={userData.avatar || "hello world"} //FIXME: Default avater image for users
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-5">
                      <button
                        type="button"
                        className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={userData.name || "Admin"}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={userData.email!}
                        disabled
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={userData.company}
                        onChange={(e) =>
                          setUserData({ ...userData, company: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Role
                      </label>
                      {/* FIXME:change to drop down option */}
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={userData.role}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            role: e.target.value as UserRoles,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Notification Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage how and when you receive notifications.
                </p>

                <div className="mt-6 space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-notifications"
                        name="email"
                        type="checkbox"
                        checked={userData.notifications.email}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="email-notifications"
                        className="font-medium text-gray-700"
                      >
                        Email notifications
                      </label>
                      <p className="text-gray-500">
                        Receive notifications about chatagent activity, updates,
                        and important alerts via email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-notifications"
                        name="push"
                        type="checkbox"
                        checked={userData.notifications.push}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="push-notifications"
                        className="font-medium text-gray-700"
                      >
                        Push notifications
                      </label>
                      <p className="text-gray-500">
                        Receive browser push notifications for real-time alerts
                        and updates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketing-notifications"
                        name="marketing"
                        type="checkbox"
                        checked={userData.notifications.marketing}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="marketing-notifications"
                        className="font-medium text-gray-700"
                      >
                        Marketing emails
                      </label>
                      <p className="text-gray-500">
                        Receive updates about new features, promotions, and
                        other marketing communications.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(
                          "Preferences Saved",
                          "Your notification preferences have been updated"
                        )
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Current Subscription
                  </h3>

                  <div className="mt-5 border-t border-gray-200 pt-5">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Plan
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {subscription.plan}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Price
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {subscription.price}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Status
                        </dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {subscription.status}
                          </span>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Next billing date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {subscription.nextBillingDate}
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Features
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {subscription.features.map((feature, index) => (
                              <li
                                key={index}
                                className="pl-3 pr-4 py-3 flex items-center justify-start text-sm"
                              >
                                <svg
                                  className="flex-shrink-0 h-5 w-5 text-green-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="ml-2 truncate">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Upgrade Plan
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Payment Methods
                  </h3>

                  <div className="mt-5 space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {method.brand === "visa" && (
                              <span className="text-blue-600 font-bold">
                                VISA
                              </span>
                            )}
                            {method.brand === "mastercard" && (
                              <span className="text-red-600 font-bold">MC</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              •••• •••• •••• {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleSetDefaultPaymentMethod(method.id)
                              }
                              className="text-sm text-primary-600 hover:text-primary-500"
                            >
                              Set as default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="text-sm text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  API Access
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your API keys and access tokens for integrating with
                  our platform.
                </p>

                <div className="mt-6">
                  <div className="flex justify-start items-center gap-4">
                    <label
                      htmlFor="api-key"
                      className="block text-sm font-medium text-gray-700"
                    >
                      API Key
                    </label>
                    <Switch onClick={() => setLiveMode(!liveMode)}>
                      {liveMode ? "Test keys" : "Live keys"}
                    </Switch>
                  </div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    {liveMode ? (
                      <input
                        type="text"
                        name="api-key"
                        id="api-key"
                        value={userData.api_key.live_key}
                        readOnly
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300"
                      />
                    ) : (
                      <input
                        type="text"
                        name="api-key"
                        id="api-key"
                        value={userData.api_key.test_key}
                        readOnly
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300"
                      />
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            liveMode
                              ? userData.api_key.live_key
                              : userData.api_key.test_key
                          );
                          toast.success(
                            "Copied!",
                            "API key copied to clipboard"
                          );
                        } catch (err) {
                          toast.error(
                            "Copy Failed",
                            err instanceof Error
                              ? err.message
                              : "Failed to copy API key. Please copy manually."
                          );
                        }
                      }}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleRegenerateApiKey}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Regenerate API Key"
                    )}
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Regenerating your API key will invalidate your existing key.
                    Make sure to update any applications using the old key.
                  </p>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    API Documentation
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Learn how to integrate with our API and build custom
                    applications.
                  </p>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View API Documentation →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
