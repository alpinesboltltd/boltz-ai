"use client";

import { useState, useEffect, useRef, use as useReact } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ChatInterface, ModifiedCalendarWidget } from "@/components/chatbot";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface GeminiChatHistoryItem {
  role: "user" | "model";
  parts: string;
}

export default function ChatbotPage({
  params: initialParams,
  showHeader = true,
}: {
  params: Promise<{ id: string }>;
  showHeader?: boolean;
}) {
  // Use React.use() to unwrap the params promise
  const resolvedParams = useReact(initialParams);
  const id = resolvedParams.id;
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 1,
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const chatbot = {
    id,
    name: "Customer Support Bot",
    description: "A helpful assistant for customer inquiries",
    primaryColor: "#6366F1",
    welcomeMessage: "Hello! How can I help you today?",
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const historyForApi: GeminiChatHistoryItem[] = messages
      .filter(
        (msg) =>
          msg.id !== 1 &&
          !msg.content.includes("Your appointment has been scheduled")
      )
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: msg.content,
      }));

    historyForApi.push({ role: "user", parts: inputValue });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          history: historyForApi,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const assistantResponseContent = data.reply;

      if (
        inputValue.toLowerCase().includes("appointment") ||
        inputValue.toLowerCase().includes("book") ||
        inputValue.toLowerCase().includes("schedule")
      ) {
        // If keyword detected, show calendar and provide a specific response
        setShowCalendar(true);
        const calendarTriggerMessage: ChatMessage = {
          id: messages.length + 2,
          role: "assistant",
          content:
            "I'd be happy to help you book an appointment. Let me show you the available dates.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          calendarTriggerMessage,
        ]);
      } else {
        // Otherwise, display the AI's response
        const assistantMessage: ChatMessage = {
          id: messages.length + 2,
          role: "assistant",
          content: assistantResponseContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "Sorry, I am having trouble connecting to the AI. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTimeSelected = (time: string, date: Date) => {
    setShowCalendar(false);

    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const confirmationMessage: ChatMessage = {
      id: messages.length + 1,
      role: "assistant",
      content: `Great! Your appointment has been scheduled for ${formattedDate} at ${time}. You'll receive a confirmation email shortly. Is there anything else you need help with?`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, confirmationMessage]);
  };

  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Conditional Rendering of the Header */}
      {showHeader && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0">
                  <span className="text-2xl font-bold text-primary-600">
                    Chatboltz
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  href="/dashboard/chatbots"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {chatbot.name}
              </h2>
              <p className="text-sm text-gray-500">{chatbot.description}</p>
            </div>

            <div
              ref={chatWindowRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {" "}
              {/* Added ref here */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {showCalendar && (
                <ModifiedCalendarWidget
                  availableTimes={availableTimes}
                  onTimeSelected={handleTimeSelected}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Type your message..."
                  disabled={isTyping} // Disable input while typing
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isTyping || !inputValue.trim()} // Disable send button
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
