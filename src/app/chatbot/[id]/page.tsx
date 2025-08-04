"use client";

import { useState, useEffect, useRef, use as useReact } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ModifiedCalendarWidget } from "@/components/chatbot";
import { ChatbotData, useAgentStore } from "@/store/agentStore";
import { Chatbot, MessageRoles } from "@/types/chatbot";
import { useParams } from "next/navigation";
import { AdminChatLogAPI, chatbotsAPI } from "@/lib/api";
import { cn, getOptimalTextColor, sanitizedContent } from "@/lib/utils";
import { ChatMessage } from "@/types/conversations";

interface GeminiChatHistoryItem {
  role: MessageRoles;
  parts: string;
}

interface ChatBotPage {
  convoId?: string;
  agentId?: string;
}

export default function ChatbotPage({ convoId }: ChatBotPage) {
  const chatbotId = useParams().id as string;
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getChatbot } = useAgentStore();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // FIXME: on chatbot opened, create conversation, on chatbot closed, or offline, close conversation
  useEffect(() => {
    const getBotData = async () => {
      const { chatbot: bot } = getChatbot(chatbotId);
      if (!bot) {
        return;
      }

      if (convoId) {
        const { data: chatLogMessages } =
          await AdminChatLogAPI.getChatLogMessages(convoId);

        if (chatLogMessages.length) {
          setMessages(chatLogMessages);
        }
      } else {
        // DOCS: retrieves the bot with the details we need
        const { data } = await chatbotsAPI.getById(bot.id);
        if (data) {
          const welcomeMessage = {
            id: 1,
            convo_id: "convo_1",
            role: MessageRoles.ASSISTANT,
            text: data.appearance.welcome_message,
            timestamp: new Date().toISOString(),
          };
          if (!messages.length) setMessages([welcomeMessage]);
          setChatbot(bot);
          setChatbotData(data);
        }
      }
    };

    getBotData();
  }, [chatbotId]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    let input = sanitizedContent(inputValue);
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      convo_id: "convo_1", //FIXME: uSE REAL CONVO_ID FROM BACKEND
      role: MessageRoles.USER,
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const historyForApi: GeminiChatHistoryItem[] = messages
      .filter(
        (msg) =>
          msg.id !== 1 &&
          !msg.text.includes("Your appointment has been scheduled")
      )
      .map((msg) => ({
        role:
          msg.role === MessageRoles.USER
            ? MessageRoles.USER
            : chatbot?.ai_model.includes("gemini")
              ? MessageRoles.MODEL
              : MessageRoles.ASSISTANT,
        parts: msg.text,
      }));

    historyForApi.push({ role: MessageRoles.USER, parts: inputValue });

    // FIXME: MOVE TO THE API FILE
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
          convo_id: "convo_1", // FIXME: USE REAL CONVERSATION ID FROM DB
          role: MessageRoles.ASSISTANT,
          text: "I'd be happy to help you book an appointment. Let me show you the available dates.",
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
          convo_id: "convo_id", // FIXME:USE REAL CONVERSATION ID FROM DB
          role: MessageRoles.ASSISTANT,
          text: assistantResponseContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        convo_id: "convo_id", // FIXME:USE REAL CONVERSATION ID FROM DB
        role: MessageRoles.ASSISTANT,
        text: "Sorry, I am having trouble connecting to the AI. Please try again later.",
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
      convo_id: "convo_id", // FIXME:USE REAL CONVERSATION ID FROM DB
      role: MessageRoles.ASSISTANT,
      text: `Great! Your appointment has been scheduled for ${formattedDate} at ${time}. You'll receive a confirmation email shortly. Is there anything else you need help with?`,
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

  if ((!chatbot || !chatbotData) && !convoId) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <div
            className={cn("bg-white rounded-lg shadow h-[500px] flex flex-col")}
          >
            <div
              className="px-6 py-4 border-b border-gray-200 rounded-t-md"
              style={{ backgroundColor: chatbotData?.appearance.primary_color }}
            >
              {/* TODO: Add bot Logo with fallback to chatboltz logo */}
            </div>

            <div
              ref={chatWindowRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {/* Added ref here */}
              {messages.map((message) => {
                const color = getOptimalTextColor(
                  message.role === MessageRoles.USER
                    ? chatbotData!.appearance.primary_color
                    : "#f3f4f6"
                );
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === MessageRoles.USER
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                        message.role !== MessageRoles.USER &&
                        "bg-gray-100 text-gray-800"
                      }`}
                      style={{
                        backgroundColor:
                          message.role === MessageRoles.USER
                            ? chatbotData?.appearance.primary_color
                            : "",
                        color:
                          message.role === MessageRoles.USER ? "#ffffff" : "",
                      }}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
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

            <div className="px-4 py-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={cn(
                    "flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 px-3"
                  )}
                  onFocus={() => {
                    inputRef.current!.style.border = `2px solid ${chatbotData?.appearance.primary_color}`;
                    inputRef.current!.style.outline = "none";
                  }}
                  onBlur={() => {
                    inputRef.current!.style.border = "none";
                  }}
                  placeholder="Type your message..."
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-full shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isTyping || !inputValue.trim()}
                  style={{
                    backgroundColor: chatbotData!?.appearance.primary_color,
                    color: getOptimalTextColor(
                      chatbotData!?.appearance.primary_color
                    ),
                  }}
                >
                  <PaperAirplaneIcon
                    title="send"
                    className="text-white h-6 w-6"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
