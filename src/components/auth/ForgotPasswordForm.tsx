"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { otpAPI } from "@/lib/api";
import { toast } from "@/store/toastStore";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const RequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResetSchema = z
  .object({
    code: z.string().min(6, "Code must be at least 6 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestInputs = z.infer<typeof RequestSchema>;
type ResetInputs = z.infer<typeof ResetSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"REQUEST" | "RESET">("REQUEST");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Form for Request Step
  const requestForm = useForm<RequestInputs>({
    resolver: zodResolver(RequestSchema),
    defaultValues: { email: "" },
  });

  // Form for Reset Step
  const resetForm = useForm<ResetInputs>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const onRequestSubmit = async (values: RequestInputs) => {
    setLoading(true);
    try {
      await otpAPI.request(values.email, "password_reset");
      setEmail(values.email);
      setStep("RESET");
      toast.success(
        "Code Sent",
        "Please checks your email for the verification code."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send code";
      toast.error("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (values: ResetInputs) => {
    setLoading(true);
    try {
      await otpAPI.completePasswordReset(email, values.code, values.password);
      toast.success("Success", "Password has been reset. Please login.");
      router.push("/auth/login");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to reset password";
      toast.error("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {step === "REQUEST" ? (
        <Form {...requestForm}>
          <form
            onSubmit={requestForm.handleSubmit(onRequestSubmit)}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
              Reset your password
            </h3>
            <p className="text-center text-sm text-gray-600">
              Enter your email address and we'll send you a code to reset your
              password.
            </p>

            <FormField
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : "Send Code"}
            </Button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onResetSubmit)}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
              Set new password
            </h3>
            <p className="text-center text-sm text-gray-600">
              Enter the code sent to {email} and your new password.
            </p>

            <FormField
              control={resetForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : "Reset Password"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("REQUEST")}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Change Email
              </button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
