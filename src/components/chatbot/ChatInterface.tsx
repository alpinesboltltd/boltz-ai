import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { VoiceRecorder } from "@/components/chatagent";
import {
  CalendarWidget,
  PaymentMethodWidget,
  ProductSearchWidget,
  SubscriptionWidget,
  BankTransferWidget,
} from "./InteractiveWidgets";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  audioUrl?: string;
  hasVoice?: boolean;
  widget?: {
    type: "calendar" | "payment" | "products" | "subscription" | "bankTransfer";
    data?: any;
  };
}

interface ChatInterfaceProps {
  chatagentName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  avatarStyle?: "default" | "robot" | "human" | "custom" | "none";
  avatarImage?: string;
  isOpen?: boolean;
  onClose?: () => void;
  darkMode?: boolean;
  fontFamily?: string;
  position?: "bottom-right" | "bottom-left";
}

export default function ChatInterface({
  chatagentName = "AI Assistant",
  welcomeMessage = "Hello! How can I help you today?",
  primaryColor = "#6366F1",
  secondaryColor = "#F3F4F6",
  avatarStyle = "default",
  avatarImage,
  isOpen = true,
  onClose = () => {},
  darkMode = false,
  fontFamily = "Inter, sans-serif",
  position = "bottom-right",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
      hasVoice: true,
    },
  ]);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceResponseEnabled, setVoiceResponseEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(
      () => {
        const response = getBotResponse(inputValue);
        const botMessage: Message = {
          id: messages.length + 2,
          text: response.text,
          sender: "bot",
          timestamp: new Date(),
          hasVoice: true,
          widget: response.widget,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);

        // Set active widget if present
        if (response.widget) {
          setActiveWidget(`${messages.length + 2}-${response.widget.type}`);
        }

        // Generate voice response if enabled
        if (voiceResponseEnabled) {
          generateVoiceResponse(response.text, messages.length + 2);
        }
      },
      1000 + Math.random() * 2000
    ); // Random delay between 1-3 seconds
  };

  const handleVoiceRecordingComplete = (audioBlob: Blob) => {
    setIsRecording(false);

    // Create audio URL
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create user message with audio
    const userMessage: Message = {
      id: messages.length + 1,
      text: "Voice message",
      sender: "user",
      timestamp: new Date(),
      audioUrl,
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    // In a real app, you would send the audio to a speech-to-text service
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      const botResponse = "I received your voice message. How can I help you?";
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        hasVoice: true,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);

      // Generate voice response if enabled
      if (voiceResponseEnabled) {
        generateVoiceResponse(botResponse, messages.length + 2);
      }
    }, 2000);
  };

  // Enhanced mock response function with widget support
  const getBotResponse = (
    userInput: string
  ): { text: string; widget?: any } => {
    const input = userInput.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
      return { text: "Hello there! How can I assist you today?" };
    } else if (input.includes("help")) {
      return {
        text: "I can help you with product information, troubleshooting, or answer general questions. What do you need help with?",
      };
    } else if (
      input.includes("price") ||
      input.includes("cost") ||
      input.includes("pricing")
    ) {
      return {
        text: "We offer several pricing plans. Our Basic plan starts at $29/month, Pro at $99/month, and Enterprise with custom pricing. Would you like more details about any specific plan?",
      };
    } else if (input.includes("feature") || input.includes("capabilities")) {
      return {
        text: "Our platform offers AI model selection, knowledge base integration, multi-channel deployment, analytics, and more. Which feature would you like to know more about?",
      };
    } else if (input.includes("thank")) {
      return {
        text: "You're welcome! Is there anything else I can help you with?",
      };
    } else if (
      input.includes("book") ||
      input.includes("schedule") ||
      input.includes("meeting") ||
      input.includes("appointment")
    ) {
      return {
        text: "I'd be happy to help you schedule a meeting. Please select a date and time that works for you:",
        widget: {
          type: "calendar",
          data: {
            availableTimes: [
              "9:00 AM",
              "10:00 AM",
              "11:00 AM",
              "1:00 PM",
              "2:00 PM",
              "3:00 PM",
              "4:00 PM",
            ],
          },
        },
      };
    } else if (
      input.includes("payment") ||
      input.includes("card") ||
      input.includes("credit card")
    ) {
      return {
        text: "You can manage your payment methods here:",
        widget: {
          type: "payment",
          data: {
            savedCards: [
              {
                id: "card_1",
                last4: "4242",
                brand: "visa",
                expMonth: 12,
                expYear: 2024,
              },
              {
                id: "card_2",
                last4: "5555",
                brand: "mastercard",
                expMonth: 8,
                expYear: 2025,
              },
            ],
          },
        },
      };
    } else if (
      input.includes("product") ||
      input.includes("buy") ||
      input.includes("purchase")
    ) {
      return {
        text: "Here are some products that might interest you:",
        widget: {
          type: "products",
          data: {
            products: [
              {
                id: "prod_1",
                name: "Premium Plan",
                price: 99.99,
                image: "https://via.placeholder.com/150",
                description:
                  "Our most popular plan with all features included.",
              },
              {
                id: "prod_2",
                name: "Basic Plan",
                price: 29.99,
                image: "https://via.placeholder.com/150",
                description:
                  "Perfect for getting started with essential features.",
              },
              {
                id: "prod_3",
                name: "Enterprise Plan",
                price: 299.99,
                image: "https://via.placeholder.com/150",
                description: "For large organizations with advanced needs.",
              },
            ],
          },
        },
      };
    } else if (
      input.includes("upgrade") ||
      input.includes("downgrade") ||
      input.includes("subscription") ||
      input.includes("plan")
    ) {
      return {
        text: "You can change your subscription plan here:",
        widget: {
          type: "subscription",
          data: {
            currentPlan: "Basic Plan ($29/month)",
            availablePlans: [
              {
                id: "free",
                name: "Free",
                price: 0,
                features: [
                  "1,000 messages/month",
                  "Basic customization",
                  "Website integration",
                ],
              },
              {
                id: "pro",
                name: "Pro",
                price: 29,
                features: [
                  "10,000 messages/month",
                  "Advanced customization",
                  "All integrations",
                ],
                popular: true,
              },
              {
                id: "business",
                name: "Business",
                price: 99,
                features: [
                  "Unlimited messages",
                  "Priority support",
                  "Custom AI training",
                ],
              },
            ],
          },
        },
      };
    } else if (
      input.includes("transfer") ||
      input.includes("bank") ||
      input.includes("money")
    ) {
      return {
        text: "I can help you with secure bank transfers. Please note that you'll need to authenticate with your bank:",
        widget: {
          type: "bankTransfer",
          data: {},
        },
      };
    } else {
      return {
        text:
          "I understand you're asking about " +
          userInput +
          ". Let me connect you with more information about that. Is there anything specific you'd like to know?",
      };
    }
  };

  // Generate voice response (in a real app, this would call a text-to-speech API)
  const generateVoiceResponse = async (text: string, messageId: number) => {
    try {
      // In a real app, this would call a text-to-speech API
      // For now, we'll use the browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Store the audio URL in the message
      window.speechSynthesis.speak(utterance);

      // In a real app, you would update the message with the audio URL
      // setMessages(prevMessages =>
      //   prevMessages.map(msg =>
      //     msg.id === messageId ? { ...msg, audioUrl: audioUrl } : msg
      //   )
      // );
    } catch (error) {
      console.error("Error generating voice response:", error);
    }
  };

  const playVoiceResponse = (messageId: number) => {
    // In a real app, you would play the audio from the message's audioUrl
    // For now, we'll use the browser's built-in speech synthesis
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      const utterance = new SpeechSynthesisUtterance(message.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getAvatarContent = () => {
    if (avatarStyle === "none") return null;

    if (avatarStyle === "custom" && avatarImage) {
      return (
        <img
          src={avatarImage}
          alt="Bot avatar"
          className="h-full w-full object-cover"
        />
      );
    }

    switch (avatarStyle) {
      case "robot":
        return "🤖";
      case "human":
        return "👤";
      default:
        return "😊";
    }
  };

  if (!isOpen) return null;

  const themeClass = darkMode
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-200";

  const darkModeStyles = darkMode
    ? {
        header: "bg-gray-900 text-white",
        messageArea: "bg-gray-800",
        userMessage: primaryColor,
        botMessage: "bg-gray-700 text-white border-gray-600",
        input: "bg-gray-700 text-white border-gray-600",
      }
    : {
        header: primaryColor,
        messageArea: secondaryColor,
        userMessage: primaryColor,
        botMessage: "bg-white text-gray-800 border-gray-200",
        input: "bg-white text-gray-800 border-gray-300",
      };

  return (
    <div
      className={`fixed bottom-4 ${position === "bottom-right" ? "right-4" : "left-4"} w-80 sm:w-96 h-[500px] rounded-lg shadow-xl flex flex-col overflow-hidden border ${themeClass}`}
      style={{ fontFamily }}
    >
      {/* Chat Header */}
      <div
        className="px-4 py-3 flex justify-between items-center"
        style={{ backgroundColor: darkModeStyles.header, color: "white" }}
      >
        <div className="flex items-center">
          {avatarStyle !== "none" && (
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-2 overflow-hidden">
              {getAvatarContent()}
            </div>
          )}
          <h3 className="font-medium">{chatagentName}</h3>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setVoiceResponseEnabled(!voiceResponseEnabled)}
            className={`text-white hover:text-gray-200 mr-2 ${voiceResponseEnabled ? "text-green-300" : "text-white"}`}
            title={
              voiceResponseEnabled
                ? "Voice responses enabled"
                : "Voice responses disabled"
            }
          >
            <SpeakerWaveIcon className="h-5 w-5" />
          </button>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ backgroundColor: darkModeStyles.messageArea }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "bot" && avatarStyle !== "none" && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden">
                {getAvatarContent()}
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[75%] ${
                message.sender === "user"
                  ? "text-white"
                  : darkModeStyles.botMessage
              }`}
              style={{
                backgroundColor:
                  message.sender === "user"
                    ? darkModeStyles.userMessage
                    : undefined,
              }}
            >
              <p className="text-sm">{message.text}</p>

              {message.audioUrl && (
                <audio
                  src={message.audioUrl}
                  controls
                  className="mt-2 max-w-full"
                  ref={audioRef}
                />
              )}

              {message.widget &&
                activeWidget === `${message.id}-${message.widget.type}` && (
                  <>
                    {message.widget.type === "calendar" && (
                      <CalendarWidget
                        availableTimes={message.widget.data.availableTimes}
                        onTimeSelected={(time) => {
                          setMessages([
                            ...messages,
                            {
                              id: messages.length + 1,
                              text: `Meeting booked for ${time}`,
                              sender: "bot",
                              timestamp: new Date(),
                            },
                          ]);
                          setActiveWidget(null);
                        }}
                        onClose={() => setActiveWidget(null)}
                      />
                    )}

                    {message.widget.type === "payment" && (
                      <PaymentMethodWidget
                        savedCards={message.widget.data.savedCards}
                        onAddCard={(cardDetails) => {
                          setMessages([
                            ...messages,
                            {
                              id: messages.length + 1,
                              text: `Card ending in ${cardDetails.cardNumber.slice(-4)} has been added`,
                              sender: "bot",
                              timestamp: new Date(),
                            },
                          ]);
                          setActiveWidget(null);
                        }}
                        onSelectCard={(cardId) => {
                          const card = message.widget?.data.savedCards.find(
                            (c: any) => c.id === cardId
                          );
                          setMessages([
                            ...messages,
                            {
                              id: messages.length + 1,
                              text: `You selected the card ending in ${card.last4}`,
                              sender: "bot",
                              timestamp: new Date(),
                            },
                          ]);
                          setActiveWidget(null);
                        }}
                        onClose={() => setActiveWidget(null)}
                      />
                    )}

                    {message.widget.type === "products" && (
                      <ProductSearchWidget
                        products={message.widget.data.products}
                        onAddToCart={(productId) => {
                          const product = message.widget?.data.products.find(
                            (p: any) => p.id === productId
                          );
                          setMessages([
                            ...messages,
                            {
                              id: messages.length + 1,
                              text: `Added ${product.name} to your cart`,
                              sender: "bot",
                              timestamp: new Date(),
                            },
                          ]);
                          setActiveWidget(null);
                        }}
                        onViewDetails={(productId) => {
                          const product = message.widget?.data.products.find(
                            (p: any) => p.id === productId
                          );
                          setMessages([
                            ...messages,
                            {
                              id: messages.length + 1,
                              text: `Here are the details for ${product.name}: ${product.description}`,
                              sender: "bot",
                              timestamp: new Date(),
                            },
                          ]);
                        }}
                        onClose={() => setActiveWidget(null)}
                      />
                    )}

                    {message.widget.type === "subscription" && (
                      <SubscriptionWidget
                        currentPlan={message.widget.data.currentPlan}
                        availablePlans={message.widget.data.availablePlans}
                        onChangePlan={(planId) => {
                          const plan = message.widget?.data.availablePlans.find(
                            (p: any) => p.id === planId
                          );
                          setMessages([
                            ...messages,
                            {
                              id: messages.length + 1,
                              text: `Your subscription has been changed to the ${plan.name} plan`,
                              sender: "bot",
                              timestamp: new Date(),
                            },
                          ]);
                          setActiveWidget(null);
                        }}
                        onClose={() => setActiveWidget(null)}
                      />
                    )}

                    {message.widget.type === "bankTransfer" && (
                      <BankTransferWidget />
                    )}
                  </>
                )}

              {message.sender === "bot" &&
                message.widget &&
                activeWidget !== `${message.id}-${message.widget.type}` && (
                  <button
                    onClick={() =>
                      setActiveWidget(`${message.id}-${message.widget.type}`)
                    }
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {message.widget.type === "calendar" &&
                      "View Available Times"}
                    {message.widget.type === "payment" &&
                      "Manage Payment Methods"}
                    {message.widget.type === "products" && "View Products"}
                    {message.widget.type === "subscription" &&
                      "Change Subscription"}
                    {message.widget.type === "bankTransfer" && "Make Transfer"}
                  </button>
                )}

              {message.sender === "bot" && message.hasVoice && (
                <button
                  onClick={() => playVoiceResponse(message.id)}
                  className="mt-1 text-xs flex items-center opacity-70 hover:opacity-100"
                >
                  <SpeakerWaveIcon className="h-3 w-3 mr-1" />
                  Play voice
                </button>
              )}

              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.sender === "user" && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            {avatarStyle !== "none" && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden">
                {getAvatarContent()}
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg ${darkModeStyles.botMessage}`}
            >
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSendMessage}
        className={`p-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center">
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecordingComplete}
            isDisabled={isTyping}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 border rounded-lg mx-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          />
          <button
            type="submit"
            className="p-2 rounded-lg text-white"
            style={{ backgroundColor: primaryColor }}
            disabled={inputValue.trim() === "" || isTyping}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
