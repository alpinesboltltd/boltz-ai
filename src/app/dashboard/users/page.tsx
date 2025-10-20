"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/common/Spinner";
import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserPlusIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import UserForm from "@/components/form/userForm";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { UserRoles } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  status: "active" | "inactive";
  lastActive: string;
  phone?: string;
  avatar?: string;
  whatsapp?: string;
  onlineStatus: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock current user - in production, get from auth context
  const currentUserRole = UserRoles.superAdmin; // Change to test different roles
  const permissions = useUserPermissions({ currentUserRole });

  useEffect(() => {
    async function loadUsers() {
      try {
        // In production, this would call the real API
        // const response = await fetch('/api/users');
        // const data = await response.json();

        // For development, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const roles = [UserRoles.staff, UserRoles.admin];
        const mockUsers = Array.from({ length: 20 }, (_, i) => {
          const roleIndex = i % 2;
          return {
            id: `user_${i}`,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: roles[roleIndex],
            status: i % 5 === 0 ? "inactive" : "active",
            lastActive: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
            phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            whatsapp: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            avatar: `https://i.pravatar.cc/150?u=${i}`,
            onlineStatus: Math.random() > 0.5,
          } as User;
        });

        setUsers(mockUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    role: UserRoles;
  }) => {
    setIsSubmitting(true);
    try {
      // In production, call API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        role: data.role,
        status: "active",
        lastActive: new Date().toISOString(),
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      };

      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    role: UserRoles;
  }) => {
    if (!userToEdit) return;

    setIsSubmitting(true);
    try {
      // In production, call API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userToEdit.id
            ? {
                ...user,
                name: data.name,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                role: data.role,
              }
            : user
        )
      );
      setEditForm(false);
      setUserToEdit(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !permissions.canDeleteUsers) return;

    setIsDeleting(true);
    try {
      // In production, call API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers(users.filter((user) => user.id !== userToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users in your account including their name, email,
            role and status.
          </p>
        </div>

        {permissions.canCreateUsers && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add User
          </button>
        )}
      </div>
      {/* Add User Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Add New User
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6">
              <UserForm
                currentUserRole={currentUserRole}
                onSubmit={handleCreateUser}
                onCancel={() => setShowForm(false)}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                placeholder="Search users"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div>
              <select
                id="role-filter"
                name="role-filter"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <select
                id="status-filter"
                name="status-filter"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 flex-shrink-0">
                            {user.avatar ? (
                              <>
                                <Image
                                  height={40}
                                  width={40}
                                  className="h-10 w-10 rounded-full"
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                {/* Status Dot */}
                                <span
                                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                    user.onlineStatus
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
                                {/* Status Dot */}
                                <span
                                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                    user.onlineStatus
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
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.role === UserRoles.admin
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role === UserRoles.admin ? "Admin" : "Staff"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            title="Role Info"
                            onClick={() => setSelectedUserInfo(user)}
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
                              onClick={() => {
                                setUserToEdit(user);
                                setEditForm(true);
                              }}
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
                              onClick={() => {
                                setUserToDelete(user.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {editForm && userToEdit && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
                      onClick={() => {
                        setEditForm(false);
                        setUserToEdit(null);
                      }}
                    >
                      <div
                        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                          <h2 className="text-lg font-semibold text-gray-900">
                            Edit User
                          </h2>
                          <button
                            onClick={() => {
                              setEditForm(false);
                              setUserToEdit(null);
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          >
                            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                          </button>
                        </div>
                        <div className="p-6">
                          <UserForm
                            user={userToEdit}
                            currentUserRole={currentUserRole}
                            onSubmit={handleUpdateUser}
                            onCancel={() => {
                              setEditForm(false);
                              setUserToEdit(null);
                            }}
                            isLoading={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Role Info Modal (per-user) */}
        {selectedUserInfo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
            onClick={() => setSelectedUserInfo(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUserInfo.name} —{" "}
                  {selectedUserInfo.role === UserRoles.admin
                    ? "Admin"
                    : "Staff"}
                </h3>
                <button
                  onClick={() => setSelectedUserInfo(null)}
                  className="text-gray-500 hover:text-red-500"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 text-sm text-gray-700 space-y-3">
                {(() => {
                  const perms: Record<UserRoles, string[]> = {
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
                    [UserRoles.staff]: [
                      "Retrain agents",
                      "Reply to messages",
                      "Manage content",
                    ],
                    [UserRoles.user]: ["Basic user access"],
                  };
                  const list = perms[selectedUserInfo.role] || [
                    "No permissions defined",
                  ];
                  return (
                    <>
                      <p className="text-sm text-gray-600">Role permissions:</p>
                      <ul className="list-disc ml-5 space-y-1">
                        {list.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete User
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                disabled={isDeleting}
              >
                <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Spinner size="sm" color="white" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
