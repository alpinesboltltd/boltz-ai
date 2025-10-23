"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  requireTyping?: boolean;
  expectedText?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  requireTyping = false,
  expectedText = "DELETE",
  isLoading = false,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(!requireTyping);

  useEffect(() => {
    if (requireTyping) {
      setIsValid(inputValue === expectedText);
    }
  }, [inputValue, expectedText, requireTyping]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isValid && !isLoading) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">{message}</p>
            
            {requireTyping && (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Type <span className="font-mono font-semibold">{expectedText}</span> to confirm:
                </p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={expectedText}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!isValid || isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
            >
              {isLoading ? "Deleting..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}