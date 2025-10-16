/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Spinner } from "@/components/common/Spinner";

interface HumanHandoffSettingsProps {
  chatagentId?: string;
  initialSettings?: {
    enabled: boolean;
    email?: string;
    threshold?: number;
    customMessage?: string;
    businessHours?: {
      enabled: boolean;
      timezone: string;
      schedule: {
        day: string;
        start: string;
        end: string;
      }[];
    };
  };
  onSave: (settings: any) => Promise<void>;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

export default function HumanHandoffSettings({
  // chatagentId,
  initialSettings = {
    enabled: false,
    threshold: 70,
    customMessage:
      "I'll connect you with a human agent who can help you further.",
    businessHours: {
      enabled: false,
      timezone: "UTC",
      schedule: [
        { day: "Monday", start: "09:00", end: "17:00" },
        { day: "Tuesday", start: "09:00", end: "17:00" },
        { day: "Wednesday", start: "09:00", end: "17:00" },
        { day: "Thursday", start: "09:00", end: "17:00" },
        { day: "Friday", start: "09:00", end: "17:00" },
      ],
    },
  },
  onSave,
}: HumanHandoffSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBusinessHoursChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    setSettings((prev) => {
      const newSchedule = [...prev.businessHours.schedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };

      return {
        ...prev,
        businessHours: {
          ...prev.businessHours,
          schedule: newSchedule,
        },
      };
    });
  };

  const handleAddDay = () => {
    // Find first day not in schedule
    const usedDays = settings.businessHours.schedule.map((item) => item.day);
    const availableDay = daysOfWeek.find((day) => !usedDays.includes(day));

    if (availableDay) {
      setSettings((prev) => ({
        ...prev,
        businessHours: {
          ...prev.businessHours,
          schedule: [
            ...prev.businessHours.schedule,
            { day: availableDay, start: "09:00", end: "17:00" },
          ],
        },
      }));
    }
  };

  const handleRemoveDay = (index) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        schedule: prev.businessHours.schedule.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Live Human Handoff Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure when and how your chatagent should transfer conversations to
          human agents.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enabled"
                name="enabled"
                type="checkbox"
                checked={settings.enabled}
                onChange={handleChange}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enabled" className="font-medium text-gray-700">
                Enable human handoff
              </label>
              <p className="text-gray-500">
                When enabled, conversations can be transferred to human agents.
              </p>
            </div>
          </div>

          {settings.enabled && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notification Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={settings.email || ""}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="support@yourcompany.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email address to notify when a conversation is transferred
                    to a human agent.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="threshold"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confidence Threshold ({settings.threshold}%)
                </label>
                <div className="mt-1">
                  <input
                    type="range"
                    name="threshold"
                    id="threshold"
                    min="0"
                    max="100"
                    value={settings.threshold}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    When the AI&#39;s confidence falls below this threshold, the
                    conversation will be transferred to a human.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="customMessage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Handoff Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="customMessage"
                    name="customMessage"
                    rows={3}
                    value={settings.customMessage}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Message displayed to users when transferring to a human
                    agent.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="businessHoursEnabled"
                      name="enabled"
                      type="checkbox"
                      checked={settings.businessHours.enabled}
                      onChange={handleBusinessHoursChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="businessHoursEnabled"
                      className="font-medium text-gray-700"
                    >
                      Enable business hours
                    </label>
                    <p className="text-gray-500">
                      Only transfer to human agents during specified business
                      hours.
                    </p>
                  </div>
                </div>

                {settings.businessHours.enabled && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="timezone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={settings.businessHours.timezone}
                        onChange={handleBusinessHoursChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule
                      </label>

                      {settings.businessHours.schedule.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <select
                            value={item.day}
                            onChange={(e) =>
                              handleScheduleChange(index, "day", e.target.value)
                            }
                            className="block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          >
                            {daysOfWeek.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>

                          <input
                            type="time"
                            value={item.start}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                "start",
                                e.target.value
                              )
                            }
                            className="block w-1/4 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          />

                          <span className="text-gray-500">to</span>

                          <input
                            type="time"
                            value={item.end}
                            onChange={(e) =>
                              handleScheduleChange(index, "end", e.target.value)
                            }
                            className="block w-1/4 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveDay(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {settings.businessHours.schedule.length < 7 && (
                        <button
                          type="button"
                          onClick={handleAddDay}
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <svg
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add Day
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end">
            {success && (
              <span className="mr-4 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                Settings saved successfully
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" color="white" /> : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
