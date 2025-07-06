import ChatbotPage from "@/app/chatbot/[id]/page"
import { RefreshCw, SlidersHorizontal, Download, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import DOMPurify from 'isomorphic-dompurify';


export default function Activity({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const [activeTab, setActiveTab] = useState('chat')
    
    // Sanitize static content to prevent XSS
    const sanitizedContent = useMemo(() => ({
        chatMessage: DOMPurify.sanitize("I dont have the ability to view files,..."),
        chatSubtext: DOMPurify.sanitize("have you seen the content of the file"),
        noLeadsMessage: DOMPurify.sanitize("No leads Found")
    }), [])
    
    return(
        <>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`${
                        activeTab === 'chat'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Chat Log
                    </button>
                    <button
                        onClick={() => setActiveTab('lead')}
                        className={`${
                        activeTab === 'lead'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Lead
                    </button>
                </nav>
            </div>

            { activeTab === 'chat' && <div className="flex flex-col w-full mt-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mx-3 my-3">
                    <h2 className="text-2xl font-semibold font-sans">Chat Logs</h2>
                    <div className="flex space-x-2">
                        <button 
                        className="flex items-center hover:bg-gray-800 hover:text-white hover:border-gray-100 transition ease-in-out border-[0.5px] border-gray-400 rounded-lg p-2 gap-x-1 text-sm font-medium font-sans">
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
                <div className="w-full border border-gray-200 my-4 z-50"></div>
                <div className="flex flex-row w-full items-start justify-center space-x-0 py-3">
                    <div className="w-3/5 flex bg-gray-200 p-2 justify-between">
                        <div className="flex flex-col">
                            <p className="fomt-medium text-md text-black" dangerouslySetInnerHTML={{ __html: sanitizedContent.chatMessage }} />
                            <p className="text-sm text-gray-500 font-sans" dangerouslySetInnerHTML={{ __html: sanitizedContent.chatSubtext }} />
                        </div>
                        <p className="text-sm">11 days ago</p>
                    </div>
                    <div className="flex flex-col w-3/4 -mt-8">
                        <ChatbotPage params={params} showHeader={false} />
                    </div>
                </div>  
            </div> }
            {activeTab === 'lead' && 
                 <div className="flex flex-col w-full mt-6 border border-gray-200 rounded-lg">
                    <div className="flex flex-col mx-3 my-3 gap-y-4">
                        <h2 className="text-2xl font-semibold font-sans">Leads</h2>
                        <p>Filters</p>
                        <div className="flex justify-between space-x-2">
                            <div className="flex items-center cursor-pointer hover:bg-gray-300 space-x-1 border-[0.5px] border-gray-700 rounded-lg px-9">
                                <Calendar width={20} />
                                <p className="text-sm font-medium">May 30, 2025 - Jun 29, 2025</p>
                            </div>
                            <button className="flex items-center border-[0.5px] bg-gray-800 text-white border-gray-100 transition ease-in-out hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 rounded-lg py-2 px-7 gap-x-1 font-medium text-sm font-sans">
                                <Download width={16} />
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="w-full border border-gray-200 my-4 z-50"></div>
                    <div className="h-full flex items-center justify-center">
                        <p className="text-center" dangerouslySetInnerHTML={{ __html: sanitizedContent.noLeadsMessage }} />
                    </div>
                </div>
            }
        </>
    )
}