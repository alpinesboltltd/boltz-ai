"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import UserForm from "./userForm";
import { UserRoles } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  status: "active" | "inactive";
  lastActive: null | string;
  phone?: string;
  avatar?: string;
  whatsapp?: string;
  onlineStatus?: boolean;
}

interface UserEditModalProps {
  user: User;
  currentUserRole: UserRoles;
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    role: UserRoles;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function UserEditModal({
  user,
  currentUserRole,
  onSubmit,
  onCancel,
  isLoading,
}: UserEditModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="p-6">
          <UserForm
            user={user}
            currentUserRole={currentUserRole}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}