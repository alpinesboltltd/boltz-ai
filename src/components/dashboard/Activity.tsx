import ChatbotPage from "@/app/chatbot/[id]/page";
import { RefreshCw, SlidersHorizontal, Download, Calendar } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { AdminChatLogAPI, chatbotsAPI } from "@/lib/api";
import { ChatMessage, Conversation } from "@/types/conversations";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { sanitizedContent as DOMPurify } from "@/lib/utils";
import { Button } from "@headlessui/react";

// FIXME: ALLOWS AGENT OWNERS TO READ A CONVERSATION
enum Tabs {
  CHAT_LOG = "chat_log",
  LEAD = "lead",
}

export default function Activity({ chatbotId }: { chatbotId: string }) {
  const [activeTab, setActiveTab] = useState(Tabs.CHAT_LOG);
  const [chatLog, setChatLog] = useState<Conversation[]>([]);
  const [convoId, setConvoId] = useState<string>();
  useEffect(() => {
    // TODO: Implement Pagination for conversation history
    async function fetchChatLog() {
      const { data } = await AdminChatLogAPI.getChatLog(chatbotId);
      if (data) {
        setChatLog(data);
        setConvoId(data[0].id);
      }
    }

    fetchChatLog();
  }, [chatbotId]);

  // FIXME: USE SANITIZE UTIL IN THE UTIL FILE
  // Sanitize static content to prevent XSS
  const sanitizedContent = useMemo(
    () => ({
      chatMessage: DOMPurify("I dont have the ability to view files,..."),
      chatSubtext: DOMPurify("have you seen the content of the file"),
      noLeadsMessage: DOMPurify("No leads Found"),
    }),
    []
  );

  return (
    <>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {Object.values(Tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === Tabs.CHAT_LOG && (
        <div className="flex flex-col w-full mt-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mx-3 my-3 py-3">
            <h2 className="text-xl font-semibold font-sans">Chat Logs</h2>
            <div className="flex space-x-2">
              <button className="flex items-center hover:bg-gray-800 hover:text-white hover:border-gray-100 transition ease-in-out border-[0.5px] border-gray-400 rounded-lg p-2 gap-x-1 text-sm font-medium font-sans">
                <RefreshCw width={16} />
                Refresh
              </button>
              <button className="flex items-center border-[0.5px] hover:bg-gray-800 hover:text-white hover:border-gray-100 transition ease-in-out border-gray-400 rounded-lg py-2 px-3 gap-x-1 text-sm font-medium font-sans">
                <SlidersHorizontal width={16} />
                Filter
              </button>
              <button className="flex items-center border-[0.5px] bg-gray-800 text-white border-gray-100 transition ease-in-out hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 rounded-lg p-2 gap-x-1 font-medium text-sm font-sans">
                <Download width={16} />
                Export
              </button>
            </div>
          </div>
          <div className="flex flex-row w-full items-start justify-center space-x-0 py-3">
            <div className="w-full md:w-3/5 flex flex-col gap-3 px-2">
              {/* TODO: Display conversations history */}
              {chatLog.map((log) => {
                const date = new Date(log.created_at);
                return (
                  <Button
                    key={log.id}
                    className="p-3 bg-gray-300 rounded-md cursor-pointer flex flex-col items-start justify-start text-start"
                    onClick={() => setConvoId(log.id)}
                  >
                    <h4 className="text-sm">{log.title}</h4>
                    <p className="text-xs">Platform: {log.platform}</p>
                    <p className="text-gray-500 text-xs">
                      Date: {date.getDate().toString().padStart(2, "0")}:
                      {date.getMonth().toString().padStart(2, "0")}:
                      {date.getFullYear().toString().padStart(2, "0")}
                    </p>
                  </Button>
                );
              })}
            </div>
            <div className="flex flex-col w-full md:w-2/4 -mt-8">
              {convoId && <ChatbotPage convoId={convoId} />}
            </div>
          </div>
        </div>
      )}
      {activeTab === Tabs.LEAD && (
        <div className="hidden md:flex flex-col w-full mt-6 border border-gray-200 rounded-lg">
          <div className="flex flex-col mx-3 my-3 gap-y-4">
            <h2 className="text-2xl font-semibold font-sans">Leads</h2>
            <p>Filters</p>
            <div className="flex justify-between space-x-2">
              <div className="flex items-center cursor-pointer hover:bg-gray-300 space-x-1 border-[0.5px] border-gray-700 rounded-lg px-9">
                <Calendar width={20} />
                <p className="text-sm font-medium">
                  May 30, 2025 - Jun 29, 2025
                </p>
              </div>
              <button className="flex items-center border-[0.5px] bg-gray-800 text-white border-gray-100 transition ease-in-out hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 rounded-lg py-2 px-7 gap-x-1 font-medium text-sm font-sans">
                <Download width={16} />
                Export
              </button>
            </div>
          </div>
          <div className="w-full border border-gray-200 my-4 z-50"></div>
          <div className="h-full flex items-center justify-center">
            <p
              className="text-center"
              dangerouslySetInnerHTML={{
                __html: sanitizedContent.noLeadsMessage,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
