import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserRoles } from "@/types";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRoles;
};

interface UserFormProps {
  user?: {
    name: string;
    email: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    role: UserRoles;
  };
  currentUserRole: UserRoles;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  currentUserRole,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      whatsapp: user?.whatsapp || "",
      role: user?.role || UserRoles.staff,
    },
  });

  // Role-based permissions
  const availableRoles = useMemo(() => {
    // SuperAdmin can create Admin and Staff
    if (currentUserRole === UserRoles.superAdmin) {
      return [
        {
          value: UserRoles.admin,
          label: "Admin",
          description: "Can manage users and content",
        },
        {
          value: UserRoles.staff,
          label: "Staff",
          description: "Read-only access",
        },
      ];
    }

    // Admin can only create Staff
    if (currentUserRole === UserRoles.admin) {
      return [
        {
          value: UserRoles.staff,
          label: "Staff",
          description: "Read-only access",
        },
      ];
    }

    return [];
  }, [currentUserRole]);

  const canManageUsers = useMemo(() => {
    return [UserRoles.superAdmin, UserRoles.admin].includes(currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || "",
        role: user.role,
      });
    }
  }, [user, reset]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!canManageUsers) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canManageUsers) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          You don&apos;t have permission to manage users.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Name must be less than 50 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
            placeholder="Enter full name"
            disabled={isLoading || isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
            placeholder="Enter email address"
            disabled={isLoading || isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", {
                pattern: {
                  value: /^[+]?[1-9]?[0-9]{7,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
              placeholder="+1 (555) 123-4567"
              disabled={isLoading || isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              {...register("whatsapp", {
                pattern: {
                  value: /^[+]?[1-9]?[0-9]{7,15}$/,
                  message: "Please enter a valid WhatsApp number",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
              placeholder="+1 (555) 123-4567"
              disabled={isLoading || isSubmitting}
            />
            {errors.whatsapp && (
              <p className="mt-1 text-sm text-red-600">
                {errors.whatsapp.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
            disabled={isLoading || isSubmitting || availableRoles.length === 0}
          >
            <option value="">Select a role</option>
            {availableRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label} - {role.description}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
          {currentUserRole === UserRoles.admin && (
            <p className="mt-1 text-sm text-gray-500">
              As an Admin, you can only create Viewer accounts.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          disabled={isLoading || isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !isValid || isLoading || isSubmitting || availableRoles.length === 0
          }
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {user ? "Updating..." : "Creating..."}
            </div>
          ) : user ? (
            "Update User"
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
