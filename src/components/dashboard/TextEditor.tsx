import React, { useState, useRef, useEffect } from 'react';

export default function TextEditor() {
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [open, setOpen] = useState(false)

  // useEffect to initialize content and update char count on mount/content change
  useEffect(() => {
    if (editorRef.current) {
      if (!editorRef.current.innerHTML) {
        editorRef.current.innerHTML = ''; 
      }
      
      updateCharacterCount();
    }
  }, []); 

  // Function to update the character count
  const updateCharacterCount = () => {
    if (editorRef.current) {
      
      setCharCount(editorRef.current.innerText.length);
      setEditorContent(editorRef.current.innerHTML);
    }
  };

  // Handler for content input (when user types or formats)
  const handleInput = () => {
    updateCharacterCount();
  };

  // Function to handle formatting commands (bold, italic, strikethrough, lists)
  const applyFormatting = (command: string, value?: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus(); // Keep focus on the editor after command
      updateCharacterCount();
    }
  };

  // Function to handle heading changes
  const applyHeading = (tag: string) => {
    if (editorRef.current) {
      document.execCommand('formatBlock', false, tag);
      editorRef.current.focus();
      updateCharacterCount();
    }
  };

  // Function to handle inserting a link
  const insertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      applyFormatting('createLink', url);
    }
  };

  // Function to handle inserting an emoji
  const insertEmoji = () => {
    
    applyFormatting('insertText', '😀');
  };

  // Function to handle adding a text snippet
  const handleAddSnippet = () => {
    console.log('Add text snippet clicked!');
    
    
    if (editorRef.current) {
      
      document.execCommand('insertHTML', false, '<p>This is a text snippet.</p>');
      editorRef.current.focus();
      updateCharacterCount();
    }
  };

  return (
    
      <div className="bg-gray-100 rounded-lg shadow-md w-full mt-3 font-sans border-dotted border-[1px] border-gray-300">
        {/* Toolbar Section */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex space-x-4 text-gray-600">
            {/* Font Style/Size - Capital 'T' icon with dropdown */}
            <div className="relative group">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Font style and size"
              >
                {/* SVG for a bold capital 'T' */}
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10M12 3v18M5 5h14"></path>
                </svg>
              </button>
              {/* Dropdown content */}
              {open ? (<div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 group-hover:block group-focus-within:block">
                <button onClick={() => { applyHeading('p'); setOpen(!open); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Normal text</button>
                <button onClick={() => { applyHeading('h1'); setOpen(!open); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Heading 1</button>
                <button onClick={() => { applyHeading('h2'); setOpen(!open); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Heading 2</button>
                <button onClick={() => { applyHeading('h3'); ; setOpen(!open); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Heading 3</button>
              </div> ) : ''}
            </div>

            {/* Bold button */}
            <button onClick={() => applyFormatting('bold')} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Bold">
              <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5h9a2 2 0 012 2v6a2 2 0 01-2 2h-3l2 4M9 10h4"></path>
              </svg>
            </button>
            {/* Italic button */}
            <button onClick={() => applyFormatting('italic')} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Italic">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 5h4M10 5l-4 14m8-14l-4 14"></path>
              </svg>
            </button>
            {/* Strikethrough button */}
            <button onClick={() => applyFormatting('strikeThrough')} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Strikethrough">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6M4 8h16M4 16h16"></path>
              </svg>
            </button>

            {/* Ordered List button */}
            <button onClick={() => applyFormatting('insertOrderedList')} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Ordered List">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h.01M3 14h.01M3 18h.01M7 10h14M7 14h14M7 18h14M7 6h14"></path>
              </svg>
            </button>
            {/* Bullet List (Unordered List) button */}
            <button onClick={() => applyFormatting('insertUnorderedList')} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Unordered List">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M6 6v.01M6 12v.01M6 18v.01"></path>
              </svg>
            </button>

            {/* Insert Link button */}
            <button onClick={insertLink} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Insert Link">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-.758l-.01.011M17.21 12.79a4 4 0 00-5.656 0l-4 4a4 4 0 005.656 5.656l1.102-1.101m-.758-.758l-.01.011M2.293 2.293a1 1 0 011.414 0l16 16a1 1 0 01-1.414 1.414l-16-16a1 1 0 010-1.414z"></path>
              </svg>
            </button>
            {/* Insert Emoji button */}
            <button onClick={insertEmoji} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Insert Emoji">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
          {/* Right side - Character Count */}
          <span className="text-sm text-gray-500">{charCount} Characters</span>
        </div>

        {/* Text Input Area - Now contentEditable div */}
        <div className="relative p-4">
          <div
            ref={editorRef} // Assign ref to the div
            className="w-full h-48 p-2 text-gray-700 outline-none focus:ring-0 placeholder-gray-400 overflow-y-auto"
            contentEditable="true" // Makes the div editable
            onInput={handleInput} // Listen for input changes
            role="textbox" // For accessibility
            aria-multiline="true" // For accessibility
            aria-label="Rich text editor area"
            // You might want to handle initial placeholder appearance manually with CSS ::before or JS
          ></div>
          {/* Expand icon at bottom right */}
          <button className="absolute bottom-6 right-6 p-1 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Expand text area">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0 0h-4m0 0l-5 5m5 5v4m0 0h-4m0 0l-5-5m5 5v4m0 0h4m0 0l5-5"></path>
            </svg>
          </button>
        </div>

        {/* Add Text Snippet Button */}
        <div className="p-4 pt-0 flex justify-end">
          <button
            onClick={handleAddSnippet}
            className="bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Add text snippet
          </button>
        </div>
      </div>
    
  );
}
