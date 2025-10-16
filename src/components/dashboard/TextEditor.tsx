import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Strikethrough,
  Type,
  Link,
  Italic,
  Maximize2,
  Bold,
  List,
} from "lucide-react";

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      if (!editorRef.current.innerHTML) {
        editorRef.current.innerHTML = "";
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

    // FIXME: V.important
    console.log(editorContent);
  };

  // Handler for content input (when user types or formats)
  const handleInput = () => {
    updateCharacterCount();
  };

  // Function to handle formatting commands (bold, italic, strikethrough, lists)
  const applyFormatting = (command: string, value?: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      updateCharacterCount();
    }
  };

  // Function to handle heading changes
  const applyHeading = (tag: string) => {
    if (editorRef.current) {
      document.execCommand("formatBlock", false, tag);
      editorRef.current.focus();
      updateCharacterCount();
    }
  };

  // Function to handle inserting an emoji
  const insertEmoji = () => {
    applyFormatting("insertText", "😀");
  };

  // Function to handle adding a text snippet
  const handleAddSnippet = () => {
    console.log("Add text snippet clicked!");

    if (editorRef.current) {
      document.execCommand(
        "insertHTML",
        false,
        "<p>This is a text snippet.</p>"
      );
      editorRef.current.focus();
      updateCharacterCount();
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md w-full mt-3 font-sans border-dotted border-[1px] border-gray-300">
      {/* Toolbar Section */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex space-x-1 text-gray-600 items-center">
          <div className="relative group">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 flex items-center rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Font style and size"
            >
              <Type width={16} height={16} className="font-semibold" />
              <ChevronDown width={20} height={20} />
            </button>
            {/* Dropdown content */}
            {open ? (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 group-hover:block group-focus-within:block">
                <button
                  onClick={() => {
                    applyHeading("p");
                    setOpen(!open);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Normal text
                </button>
                <button
                  onClick={() => {
                    applyHeading("h1");
                    setOpen(!open);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Heading 1
                </button>
                <button
                  onClick={() => {
                    applyHeading("h2");
                    setOpen(!open);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Heading 2
                </button>
                <button
                  onClick={() => {
                    applyHeading("h3");
                    setOpen(!open);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Heading 3
                </button>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="relative group inline-block">
            <button
              onClick={() => applyFormatting("bold")}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Bold"
            >
              <Bold width={16} height={16} />
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              Bold
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              onClick={() => applyFormatting("italic")}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Italic"
            >
              <Italic width={16} height={16} />
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              Italic
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              onClick={() => applyFormatting("strikeThrough")}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Strikethrough"
            >
              <Strikethrough width={16} height={16} />
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              StrikeThrough
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              onClick={() => applyFormatting("insertOrderedList")}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Ordered List"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h.01M3 14h.01M3 18h.01M7 10h14M7 14h14M7 18h14M7 6h14"
                ></path>
              </svg>
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              Ordered
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              onClick={() => applyFormatting("insertUnorderedList")}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Unordered List"
            >
              <List width={16} height={16} />
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              Unorderd
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Insert Link"
            >
              <Link width={16} height={16} />
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              Link
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              onClick={insertEmoji}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Insert Emoji"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <div className="absolute bg-black text-sm text-white left-0 -mt-16 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out hidden group-hover:block border border-gray-300 shadow-md px-3 py-1 rounded-lg">
              Emoji
            </div>
          </div>
        </div>
        {/* Right side - Character Count */}
        <span className="text-sm text-gray-500">{charCount} B</span>
      </div>

      {/* Text (Input Area) */}

      <div className="relative p-4">
        <div
          ref={editorRef}
          className="w-full h-48 p-2 text-gray-700 outline-none focus:ring-0 placeholder-gray-400 overflow-y-auto"
          contentEditable="true"
          onInput={handleInput}
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text editor area"
        ></div>
        {/* Expand icon at bottom right */}

        <button
          className="absolute bottom-6 right-6 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Expand text area"
        >
          <Maximize2 width={20} height={20} />
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
