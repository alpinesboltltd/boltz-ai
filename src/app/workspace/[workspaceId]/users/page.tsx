"use client";

import { useState, useEffect, use } from "react";
import { Spinner } from "@/components/common/Spinner";
import {
  User,
  UserPlus,
  Search,
  Shield,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { UserRoles } from "@/types";
import UserDeleteModal from "@/components/form/UserDeleteModal";
import UserForm from "@/components/form/userForm";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

export default function UsersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
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
  const currentUserRole = UserRoles.superAdmin;
  const permissions = useUserPermissions({ currentUserRole });

  useEffect(() => {
    async function loadUsers() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In real app, fetch users for workspaceId
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

    if (workspaceId) {
      loadUsers();
    }
  }, [workspaceId]);

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    role: UserRoles;
  }) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        role: data.role,
        status: "active",
        lastActive: null,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        onlineStatus: false,
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-primary-600" />
            Users
          </h1>
          <p className="mt-2 text-gray-500">
            Manage team members, roles, and access permissions.
          </p>
        </div>

        {permissions.canCreateUsers && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            className="input py-2 text-sm bg-gray-50 border-gray-200"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          <select
            className="input py-2 text-sm bg-gray-50 border-gray-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Last Active
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 shrink-0">
                        <Image
                          height={40}
                          width={40}
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.name}`
                          }
                          alt={user.name}
                        />
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                            user.onlineStatus ? "bg-green-500" : "bg-gray-300"
                          )}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        user.role === UserRoles.admin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {user.role === UserRoles.admin ? "Admin" : "Staff"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserInfo(user)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      {permissions.canEditUsers && (
                        <button
                          onClick={() => {
                            setUserToEdit(user);
                            setEditForm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {permissions.canDeleteUsers && (
                        <button
                          onClick={() => {
                            setUserToDelete(user.id);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modals */}
      <AnimatePresence>
        {(showForm || editForm) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForm(false);
                setEditForm(false);
              }}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editForm ? "Edit User" : "Add New User"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditForm(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <UserForm
                  user={editForm ? (userToEdit ?? undefined) : undefined}
                  currentUserRole={currentUserRole}
                  onSubmit={editForm ? handleUpdateUser : handleCreateUser}
                  onCancel={() => {
                    setShowForm(false);
                    setEditForm(false);
                  }}
                  isLoading={isSubmitting}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role Info Modal */}
      <AnimatePresence>
        {selectedUserInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUserInfo(null)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  Role Permissions
                </h3>
                <button
                  onClick={() => setSelectedUserInfo(null)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 relative overflow-hidden">
                    <Image
                      src={
                        selectedUserInfo.avatar ||
                        `https://ui-avatars.com/api/?name=${selectedUserInfo.name}`
                      }
                      alt={selectedUserInfo.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {selectedUserInfo.name}
                    </h4>
                    <span className="text-sm text-gray-500 capitalize">
                      {selectedUserInfo.role}
                    </span>
                  </div>
                </div>

                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Access Level
                </h5>
                <ul className="space-y-2">
                  {[
                    "View dashboard analytics",
                    "Manage assigned agents",
                    "Reply to user conversations",
                    "Edit agent settings",
                  ].map((perm, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showDeleteModal && (
        <UserDeleteModal
          onConfirm={handleDeleteUser}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
