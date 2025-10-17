import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserRoles } from "@/types";

type User = {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRoles;
};

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRoles;
};
interface FormProps {
  user?: User;
}
const UserForm: React.FC<FormProps> = ({ user }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (user) {
      setValue("fullName", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("whatsapp", user.whatsapp || "");
      setValue("role", user.role);
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          {...register("fullName", { required: "Full name is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
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
              message: "Invalid email address",
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          {...register("phone")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          WhatsApp Number
        </label>
        <input
          type="tel"
          {...register("whatsapp")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter WhatsApp number"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role *
        </label>
        <select
          {...register("role", { required: "Role is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          defaultValue={user?.role || ""}
        >
          <option value="">Select role</option>
          <option value={UserRoles.editor}>Editor</option>
          <option value={UserRoles.viewer}>Viewer</option>
          <option value={UserRoles.admin}>Admin</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => window.location.reload()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {user ? "Update User" : "Add User"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
