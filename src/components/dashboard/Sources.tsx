import { File, Upload, Search, X, ChevronRight, Ellipsis  } from "lucide-react"
import { formatBytes } from "@/utils/fileUtils"
import { useState, ChangeEvent, useRef } from "react";
import Image from "next/image";
import TextEditor from "./TextEditor";

export default function Sources() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('files')
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null); // Clear previous errors

    const file = event.target.files?.[0]; // Get the first selected file

    if (file) {
        const MAX_FILE_SIZE_MB = 5; 
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
            setUploadedFile(null);
            event.target.value = ''; // Clear the input visually
            return;
        }

        const allowedTypes = ['application/pdf', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Only PDF, and TXT files are allowed.');
            setUploadedFile(null);
            event.target.value = ''; 
            return;
        }

        setUploadedFile(file);
        } else {
        setUploadedFile(null); // No file selected
        }
    };

    const handleDivClick = () => {
        fileInputRef.current?.click(); 
    };

    // Helper function to get the appropriate SVG icon based on file type
  const getFileIcon = (fileType: string | undefined, fileName: string): JSX.Element => {
    if (!fileType) {
      // Fallback if fileType is undefined, use extension
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') return <PdfIcon />;
      if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <ImageIcon />;
      if (ext === 'txt') return <TextIcon />;
      return <GenericFileIcon />;
    }

    if (fileType === 'application/pdf') return <PdfIcon />;
    if (fileType === 'text/plain') return <TextIcon />;
    if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <DocIcon />;
    if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return <ExcelIcon />;
    if (fileType === 'application/vnd.ms-powerpoint' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return <PowerPointIcon />;

    return <GenericFileIcon />;
  };

    // SVG Icons for different file types
    const PdfIcon = () => (
        <Image src="/pdf.svg" alt="My Icon" width={40} height={40} />
    );

    const TextIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const GenericFileIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );

    // Added icons for common document types (optional)
    const DocIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const ExcelIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H19a2 2 0 012 2v5m-1.414 4.586A2 2 0 0118 18H6a2 2 0 01-2-2v-1a2 2 0 00-2-2v0a2 2 0 002-2h0a2 2 0 012-2h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H19a2 2 0 012 2v1a2 2 0 002 2v0a2 2 0 00-2-2h0a2 2 0 01-2-2h-3.586a1 1 0 00-.707-.293L12 8a1 1 0 00-.707-.293H5a2 2 0 00-2 2z" />
        </svg>
    );

    const PowerPointIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H19a2 2 0 012 2v5m-1.414 4.586A2 2 0 0118 18H6a2 2 0 01-2-2v-1a2 2 0 00-2-2v0a2 2 0 002-2h0a2 2 0 012-2h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H19a2 2 0 012 2v1a2 2 0 002 2v0a2 2 0 00-2-2h0a2 2 0 01-2-2h-3.586a1 1 0 00-.707-.293L12 8a1 1 0 00-.707-.293H5a2 2 0 00-2 2z" />
        </svg>
    );

    return(
        <div>
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`${
                        activeTab === 'files'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
                    >
                        
                        Files
                    </button>
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`${
                        activeTab === 'text'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
                    >
                        
                        Text
                    </button>
                    <button
                        onClick={() => setActiveTab('website')}
                        className={`${
                        activeTab === 'website'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
                    >
                        
                        Website
                    </button>
                    <button
                        onClick={() => setActiveTab('q&a')}
                        className={`${
                        activeTab === 'q&a'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
                    >
                        
                        Q & A
                    </button>
                </nav>
            </div>
             
            <div className="flex justify-evenly items-start space-x-2 w-full mt-6">
                {activeTab === 'files' &&
                <div className="flex flex-col w-3/4 space-y-6">
                    <div className="border border-gray-300 px-4 shadow-md rounded-lg py-3 ">
                        <h1>Files</h1>
                        <p className="text-wrap text-sm">The Files tab allows you to upload and manage various document 
                            types to train your AI agent. <a href="">Learn more</a>
                        </p>
                        <div onClick={handleDivClick} className="flex flex-col border border-gray-500 border-dashed text-sm rounded-lg justify-center items-center py-20 w-full bg-gray-200 my-4 space-y-2">
                            <Upload className="w-5" />
                            <p className="text-center">Drag & drop files here, or click to select the files</p>
                            <p className="text-center">Supported File Types: .pdf, .doc, .docx, .txt</p>
                        </div>
                        {/* Hidden File Input */}
                        <input
                            id="file-upload"
                            type="file"
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            className="hidden" 
                        />

                        {/* Error Message Div */}
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <p className="text-sm">{errorMessage}</p>
                            </div>
                        )}
                        <p className="text-sm text-center">If you are uploading a PDF, make sure you can select/highlight the text</p>
                    </div>
                    <div className="border border-gray-300 px-4 shadow-md rounded-lg py-5 space-y-4 ">
                        <div className="flex justify-between">
                            <h1>File Sources</h1>
                            <div className='relative '>
                                <Search className="absolute text-gray-400 ml-3 top-5 transform -translate-y-1/2 w-4" />
                                <input 
                                className="pl-8 placeholder:text-sm py-1.5 outline-[0.5px] rounded-lg w-[265px] border border-gray-500 " 
                                type="text"
                                placeholder='Search...'
                                />
                                <X className="absolute text-gray-400 left-60 cursor-pointer top-5 transform -translate-y-1/2 w-4"/>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center gap-x-1">
                                <input type="checkbox" className="border rounded-lg shadow-md" />
                                <label htmlFor="select" className="text-black text-sm font-medium">Select All</label>
                            </div>
                            <div className="flex items-center">
                                <p className="text-sm">Sort by:</p>
                                <select className="border-0 outline-none bg-gray-100 hover:bg-gray-200 rounded-lg p-1 text-sm font-medium">
                                    <option>Default</option>
                                    <option>Status</option>
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                    <option>Alphabetical (A-Z)</option>
                                    <option>Alphabetical (Z-A)</option>
                                </select>
                            </div>
                            
                        </div>
                        <div className="w-full border border-gray-400"></div>
                        {/* Uploaded File Information Div */}
                        {uploadedFile && (
                            <div className="mt-6 ">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    {getFileIcon(uploadedFile.type, uploadedFile.name)} 
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-sans font-medium text-gray-950">{uploadedFile.name}</span>
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            <span className="font-sans text-gray-700">{formatBytes(uploadedFile.size)}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Ellipsis className="cursor-pointer" />
                                    <ChevronRight className="cursor-pointer" />
                                </div>
                            </div>
                            </div>

                        )}
                    </div>
                </div>}
                {activeTab === 'text' && 
                    <div className="flex flex-col w-3/4">
                        <div className="border border-gray-300 px-4 shadow-md rounded-lg py-3 space-y-5">
                            <div>
                                <h2>Text</h2>
                                <p className="text-sm text-gray-500 mt-3">Add and process plain text-based sources to train your AI Agent with precise information. <a href="">Learn more</a></p>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label htmlFor="title">Title</label>
                                <input type="text" placeholder="Ex: Refund Requests" className="rounded-lg bg-gray-100 border-[0.5px] px-3 py-1 outline-none text-md border-gray-400" />
                            </div>
                            <div className="gap-y-2">
                                <p className="text-sm text-gray-500 font-medium">Text</p>
                                <TextEditor />
                            </div>
                        </div>
                    </div>
                }
                <div className="border border-gray-300 px-4 shadow-md rounded-lg py-3 w-1/3 space-y-6">
                    <h2>Sources</h2>
                    <div className="flex justify-between">
                        <p className="flex items-center text-sm "><File className="w-3" /> 1 File</p>
                        <p className="text-sm">{uploadedFile ? formatBytes(uploadedFile.size) : `7 KB`}</p>
                    </div>
                    <div className="border border-dashed border-gray-500"></div>
                    <div className="flex justify-between text-sm">
                        <p>Total Size:</p>
                        
                        <p className="text-wrap flex flex-col items-end">{uploadedFile ? formatBytes(uploadedFile.size) : `7 KB`} <p>/400 KB</p></p>
                    </div>
                    
                    <p className="bg-black text-white px-3 py-3 rounded-xl text-center border text-sm font-semibold">Retrain Agent</p>
                </div> 
            </div>
        </div>
    )
}