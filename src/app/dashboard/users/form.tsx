import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type User = {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
};

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
};
interface FormProps {
  user?: User;
}
const Forms: React.FC<FormProps> = ({ user }) => {
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
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">User Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name *</label>
          <input
            {...register("fullName", { required: "Full name is required" })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter phone number"
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block font-medium mb-1">
            WhatsApp Number (Optional)
          </label>
          <input
            type="tel"
            {...register("whatsapp")}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter WhatsApp number"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-primary-600 text-white rounded-lg py-2 mt-2 hover:bg-primary-700 transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default Forms;
