"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
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

interface UserInfoModalProps {
  user: User;
  onClose: () => void;
}

export default function UserInfoModal({ user, onClose }: UserInfoModalProps) {
  const permissions: Record<UserRoles, string[]> = {
    [UserRoles.superAdmin]: [
      "Full system access",
      "Create all user types",
      "Delete any user",
      "Manage all agents",
    ],
    [UserRoles.admin]: [
      "Create staff users",
      "Create agents",
      "Retrain agents",
      "Delete agents",
      "Reply to messages",
    ],
    [UserRoles.editor]: [
      "Edit agents",
      "Retrain agents",
      "Reply to messages",
      "Manage content",
    ],
    [UserRoles.viewer]: [
      "View agents",
      "View messages",
      "View analytics",
    ],
    [UserRoles.staff]: [
      "Retrain agents",
      "Reply to messages",
      "Manage content",
    ],
    [UserRoles.user]: ["Basic user access"],
  };

  const rolePermissions = permissions[user.role] || ["No permissions defined"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.name} — {user.role === UserRoles.admin ? "Admin" : "Staff"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 text-sm text-gray-700 space-y-3">
          <p className="text-sm text-gray-600">Role permissions:</p>
          <ul className="list-disc ml-5 space-y-1">
            {rolePermissions.map((permission) => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}