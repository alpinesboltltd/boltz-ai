"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/common/Spinner";

const enterpriseFeatures = [
  "Unlimited chatagents",
  "Custom message volume",
  "Custom integrations",
  "Custom AI model deployment",
  "White-labeling",
  "SLA guarantees",
  "Dedicated account manager",
  "On-premises deployment options",
  "Advanced security features",
  "Custom analytics and reporting",
  "Priority support with 24/7 availability",
  "Custom training and onboarding",
  "Multi-language support",
  "Custom data retention policies",
  "HIPAA and GDPR compliance",
];

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    employees: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In production, this would call the real API
      // const response = await fetch('/api/enterprise/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to submit form');
      // }

      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
    } catch (err) {
      console.error("Form submission failed:", err);
      setError("Failed to submit form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Enterprise Solutions
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Tailored AI chatagent solutions for large organizations with
                  custom requirements, advanced security needs, and
                  enterprise-grade support.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#contact-form"
                    className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Contact Sales
                  </a>
                  <Link
                    href="/pricing"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    View all plans <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="bg-white shadow-xl rounded-3xl ring-1 ring-gray-900/10 sm:p-8 lg:p-12">
              <h2 className="text-xl font-semibold leading-7 text-primary-600">
                Enterprise Features
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Everything you need for large-scale deployment
              </p>

              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {enterpriseFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-primary-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Case Studies
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by industry leaders
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              See how enterprise organizations are leveraging our AI chatagent
              platform to transform their customer experience and operations.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: "Global Financial Institution",
                  description:
                    "Reduced customer service costs by 35% while improving satisfaction scores by implementing our AI chatagent across 12 languages.",
                  metric: "35% cost reduction",
                },
                {
                  title: "Fortune 500 Retailer",
                  description:
                    "Increased conversion rates by 28% with personalized shopping assistance and 24/7 customer support via our omnichannel chatagent solution.",
                  metric: "28% higher conversion",
                },
                {
                  title: "Healthcare Provider Network",
                  description:
                    "Streamlined patient intake and appointment scheduling while maintaining HIPAA compliance, reducing wait times by 45%.",
                  metric: "45% faster service",
                },
              ].map((study, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex-1 rounded-3xl bg-gray-50 px-6 pb-8 pt-12 ring-1 ring-inset ring-gray-900/5">
                    <div className="text-base font-semibold leading-7 text-gray-900">
                      {study.title}
                    </div>
                    <div className="mt-2 text-5xl font-bold tracking-tight text-primary-600">
                      {study.metric}
                    </div>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                      {study.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact-form" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Get in Touch
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to discuss your enterprise needs?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Fill out the form below and our enterprise sales team will contact
              you within 24 hours.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-xl sm:mt-20">
            {submitted ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <CheckIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Form submitted successfully
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Thank you for your interest in our Enterprise solutions.
                        Our team will contact you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Full name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Company
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Phone number
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="employees"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Company size
                    </label>
                    <div className="mt-2.5">
                      <select
                        id="employees"
                        name="employees"
                        value={formData.employees}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1001+">1001+ employees</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Message
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="Tell us about your specific requirements and use cases"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    id="privacy-policy"
                    name="privacy-policy"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  />
                  <label
                    htmlFor="privacy-policy"
                    className="ml-3 block text-sm leading-6 text-gray-600"
                  >
                    By selecting this, you agree to our{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-primary-600"
                    >
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="block w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                  >
                    {loading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Contact Sales Team"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
