"use client";

import { useState, useEffect, useRef, use as useReact } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
// import { ModifiedCalendarWidget } from "@/components/agent";
import { AgentData, useAgentStore } from "@/store/agentStore";
// import { Chatbot, MessageRoles } from "@/types/agent";
import { useParams } from "next/navigation";
import { AdminChatLogAPI, agentsAPI } from "@/lib/api";
import { cn, getOptimalTextColor, sanitizedContent } from "@/lib/utils";
import { ChatMessage } from "@/types/conversations";
import FeedbackButtons from "@/components/ui/FeedbackButtons";
import { ModifiedCalendarWidget } from "@/components/chatbot/ModifiedCalendarWidget";
import { Agent, MessageRoles } from "@/types/agent";

interface GeminiChatHistoryItem {
  role: MessageRoles;
  parts: string;
}

interface ChatBotPage {
  convoId?: string;
  agentId?: string;
}

export default function ChatbotPage({ convoId }: ChatBotPage) {
  const agentId = useParams().id as string;
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getAgent } = useAgentStore();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationData, setConversationData] = useState<any>(null);

  const handleFeedback = async (
    messageId: string,
    type: string,
    comment?: string
  ) => {
    console.log("Feedback submitted:", { messageId, type, comment });
    // TODO: Implement API call to save feedback
  };

  const handleImprove = async (
    messageId: string,
    improvedText: string,
    reason: string
  ) => {
    console.log("Improvement submitted:", { messageId, improvedText, reason });
    // TODO: Implement API call to save improvement
  };

  const getMessageFeedback = (messageId: string) => {
    // Mock feedback data - replace with API call
    const feedbacks = [
      { message_id: "msg_003", feedback_type: "positive" },
      { message_id: "msg_008", feedback_type: "correction" },
    ];
    return feedbacks.find((f) => f.message_id === messageId);
  };

  const getMessageImprovement = (messageId: string) => {
    // Mock improvement data - replace with API call
    const improvements = [
      {
        original_message_id: "msg_008",
        improved_text:
          "I'd be happy to help you schedule a cardiology consultation. We have Dr. Smith and Dr. Michael Chen available...",
      },
    ];
    return improvements.find((i) => i.original_message_id === messageId);
  };

  const getEscalationPoint = (messageId: string) => {
    // Mock escalation data - replace with API call
    const escalations = [
      {
        message_id: "msg_010",
        escalation_reason: "Complex medical scheduling request",
      },
      {
        message_id: "msg_025",
        escalation_reason: "Legal matter requiring attorney consultation",
      },
    ];
    return escalations.find((e) => e.message_id === messageId);
  };

  // FIXME: on agent opened, create conversation, on agent closed, or offline, close conversation
  useEffect(() => {
    const getBotData = async () => {
      const { agent: agnt } = getAgent(agentId);
      if (!agnt) {
        return;
      }
      // NOTE: retrieves the bot with the details we need
      const { data } = await agentsAPI.getById(agnt.id);
      if (data) {
        const welcomeMessage = {
          id: 1,
          convo_id: convoId!,
          role: MessageRoles.ASSISTANT,
          text: data.appearance.welcome_message,
          timestamp: new Date().toISOString(),
        };
        if (!messages.length && !convoId) setMessages([welcomeMessage]);
        setAgent(agnt);
        setAgentData(data);
      }
    };

    getBotData();
  }, [agentId]);

  useEffect(() => {
    const getConvo = async () => {
      if (convoId) {
        const { data: chatLogMessages } =
          await AdminChatLogAPI.getChatLogMessages(convoId);
        const { data: conversations } =
          await AdminChatLogAPI.getChatLog(agentId);
        const currentConvo = conversations?.find((c) => c.id === convoId);

        if (chatLogMessages.length) {
          setMessages(chatLogMessages);
        }
        if (currentConvo) {
          setConversationData(currentConvo);
        }
      }
    };

    getConvo();
  }, [convoId, agentId]);

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
      convo_id: convoId!, //FIXME: uSE REAL CONVO_ID FROM BACKEND
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
            : agent?.ai_model.toLowerCase().includes("gemini")
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
          convo_id: convoId!, // FIXME: USE REAL CONVERSATION ID FROM DB
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
          convo_id: convoId!, // FIXME:USE REAL CONVERSATION ID FROM DB
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
        convo_id: convoId!, // FIXME:USE REAL CONVERSATION ID FROM DB
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
      convo_id: convoId!, // FIXME:USE REAL CONVERSATION ID FROM DB
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

  if ((!agent || !agentData) && !convoId) {
    return (
      <div className="flex justify-start">
        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-gray-100">
      <div className="flex-1 overflow-hidden">
        <div className="w-full px-2 sm:px-4 py-2 h-full">
          <div
            className={cn(
              "rounded-lg shadow h-full max-h-[500px] flex flex-col",
              conversationData?.escalated_to_human
                ? "bg-orange-50 border-2 border-orange-200"
                : "bg-white"
            )}
          >
            <div
              className="px-6 py-4 border-b border-gray-200 rounded-t-md flex items-center justify-between"
              style={{
                backgroundColor: agentData?.appearance.primary_color,
              }}
            >
              <div className="text-white font-medium">
                {conversationData?.escalated_to_human && (
                  <span className="text-sm bg-orange-500 px-2 py-1 rounded text-white">
                    Escalated: {conversationData.escalation_reason}
                  </span>
                )}
              </div>
            </div>

            <div
              ref={chatWindowRef}
              className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4"
            >
              {/* Added ref here */}
              {messages.map((message) => {
                const feedback = getMessageFeedback(message.id.toString());
                const improvement = getMessageImprovement(
                  message.id.toString()
                );
                const escalation = getEscalationPoint(message.id.toString());

                return (
                  <div key={message.id}>
                    {escalation && (
                      <div className="text-center mb-2">
                        <div className="inline-block bg-orange-100 border border-orange-300 rounded-full px-3 py-1 text-xs text-orange-700">
                          🚨 Escalated to Human: {escalation.escalation_reason}
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        message.role === MessageRoles.USER
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={cn(
                          "relative max-w-[250px] sm:max-w-xs md:max-w-md px-3 sm:px-4 py-2 rounded-lg",
                          message.role === MessageRoles.USER
                            ? ""
                            : "bg-gray-100 text-gray-800",
                          feedback?.feedback_type === "positive" &&
                            "bg-green-50 border border-green-200",
                          feedback?.feedback_type &&
                            feedback.feedback_type !== "positive" &&
                            "bg-red-50 border border-red-200",
                          improvement && "bg-blue-50 border border-blue-200"
                        )}
                        style={{
                          backgroundColor:
                            message.role === MessageRoles.USER
                              ? agentData?.appearance.primary_color
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
                        {improvement && (
                          <div className="mt-2 p-2 bg-blue-100 rounded border-l-4 border-blue-400">
                            <p className="text-xs font-medium text-blue-800 mb-1">
                              Improved Response:
                            </p>
                            <p className="text-sm text-blue-700">
                              {improvement.improved_text}
                            </p>
                          </div>
                        )}
                        {convoId && message.role === MessageRoles.ASSISTANT && (
                          <div className="mt-2 flex flex-col gap-2">
                            {message.confidence_score && (
                              <p
                                className={cn(
                                  "px-2 py-1 rounded text-xs font-medium w-fit",
                                  message.confidence_score > 0.75
                                    ? "bg-green-100 text-green-800"
                                    : message.confidence_score >= 0.5
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                )}
                              >
                                Confidence:{" "}
                                {Math.round(message.confidence_score * 100)}%
                              </p>
                            )}
                            <FeedbackButtons
                              messageId={message.id.toString()}
                              onFeedback={handleFeedback}
                              onImprove={handleImprove}
                            />
                          </div>
                        )}
                      </div>
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

            <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200">
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
                    inputRef.current!.style.border = `2px solid ${agentData?.appearance.primary_color}`;
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
                    backgroundColor: agentData!?.appearance.primary_color,
                    color: getOptimalTextColor(
                      agentData?.appearance.primary_color || "#f3f4f6"
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
