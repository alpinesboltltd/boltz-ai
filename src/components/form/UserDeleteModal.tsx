"use client";

import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/common/Spinner";

interface UserDeleteModalProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function UserDeleteModal({
  onConfirm,
  onCancel,
  isLoading,
}: UserDeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading}
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" color="white" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}