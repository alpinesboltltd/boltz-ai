"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/common/Spinner";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { UserRoles } from "@/types";
import UserAddModal from "@/components/form/UserAddModal";
import UserEditModal from "@/components/form/UserEditModal";
import UserDeleteModal from "@/components/form/UserDeleteModal";
import UserInfoModal from "@/components/form/UserInfoModal";
import UserFilters from "@/components/form/UserFilters";
import UsersTable from "@/components/form/UsersTable";

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

      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalUsers={users.length}
        filteredCount={filteredUsers.length}
      />

      <UsersTable
        users={filteredUsers}
        permissions={permissions}
        onEditUser={(user) => {
          setUserToEdit(user);
          setEditForm(true);
        }}
        onDeleteUser={(userId) => {
          setUserToDelete(userId);
          setShowDeleteModal(true);
        }}
        onShowUserInfo={setSelectedUserInfo}
      />

      {/* Modals - Outside table structure */}
      {showForm && (
        <UserAddModal
          currentUserRole={currentUserRole}
          onSubmit={handleCreateUser}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      )}

      {editForm && userToEdit && (
        <UserEditModal
          user={userToEdit}
          currentUserRole={currentUserRole}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setEditForm(false);
            setUserToEdit(null);
          }}
          isLoading={isSubmitting}
        />
      )}

      {selectedUserInfo && (
        <UserInfoModal
          user={selectedUserInfo}
          onClose={() => setSelectedUserInfo(null)}
        />
      )}

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
