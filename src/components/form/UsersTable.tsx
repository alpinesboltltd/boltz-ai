"use client";

import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
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

interface UsersTableProps {
  users: User[];
  permissions: {
    canEditUsers: boolean;
    canDeleteUsers: boolean;
  };
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onShowUserInfo: (user: User) => void;
}

export default function UsersTable({
  users,
  permissions,
  onEditUser,
  onDeleteUser,
  onShowUserInfo,
}: UsersTableProps) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Last Active
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 shrink-0">
                          {user.avatar ? (
                            <>
                              <Image
                                height={40}
                                width={40}
                                className="h-10 w-10 rounded-full"
                                src={user.avatar}
                                alt={user.name}
                              />
                              <span
                                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${user.onlineStatus
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                  }`}
                              ></span>
                            </>
                          ) : (
                            <>
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                              <span
                                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${user.onlineStatus
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                  }`}
                              ></span>
                            </>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.role === UserRoles.admin
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {user.role === UserRoles.admin ? "Admin" : "Staff"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.lastActive
                        ? new Date(user.lastActive).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          title="Role Info"
                          onClick={() => onShowUserInfo(user)}
                        >
                          <InformationCircleIcon className="h-5 w-5" />
                        </button>
                        {user.email && (
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            title="Email"
                          >
                            <EnvelopeIcon className="h-5 w-5" />
                          </button>
                        )}
                        {user.phone && (
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            title="Call"
                          >
                            <PhoneIcon className="h-5 w-5" />
                          </button>
                        )}
                        {permissions.canEditUsers && (
                          <button
                            type="button"
                            onClick={() => onEditUser(user)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                        {permissions.canDeleteUsers && (
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            onClick={() => onDeleteUser(user.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}