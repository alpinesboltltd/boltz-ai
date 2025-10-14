"use client";

import { useState } from "react";
import { CodeBracketIcon, CheckIcon } from "@heroicons/react/24/outline";

interface SystemPromptEditorProps {
  defaultPrompt: string;
  onSave: (prompt: string) => void;
}

export function SystemPromptEditor({
  defaultPrompt,
  onSave,
}: SystemPromptEditorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(prompt);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">System Prompt</h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CodeBracketIcon className="h-4 w-4 mr-1.5" />
            Edit Prompt
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CheckIcon className="h-4 w-4 mr-1.5" />
            Save Changes
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={12}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
            placeholder="Enter system prompt instructions..."
          />
          <p className="mt-2 text-sm text-gray-500">
            The system prompt defines your agent&#39;s personality, knowledge,
            and behavior. Be specific about how you want your agent to respond.
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {prompt ||
              "No system prompt defined. Click 'Edit Prompt' to add one."}
          </pre>
        </div>
      )}
    </div>
  );
}
