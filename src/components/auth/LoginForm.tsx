"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SigninFormInputs, signinSchema } from "@/types/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthRequestMethods, SubscriptionPlans } from "@/types";
import { socialSignIn } from "@/lib/utils";
import Link from "next/link";
import { Spinner } from "@/components/common/Spinner";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import { authAPI } from "@/lib/api";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/configs/firebase";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken, clearAuth } = useAuthStore();
  const sessionExpired = searchParams?.get("session_expired") === "true";

  useEffect(() => {
    if (sessionExpired) {
      clearAuth();
    }
  }, [sessionExpired, clearAuth]);

  const form = useForm<SigninFormInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
      method: AuthRequestMethods.password,
    },
  });

  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    try {
      await authAPI.resendVerificationEmail(unverifiedEmail);
      toast.success("Verification Sent", "Please check your email inbox.");
      setUnverifiedEmail(null); // Clear state after sending
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send verification email";
      toast.error("Error", errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (value: SigninFormInputs) => {
    setLoading(true);
    try {
      // 1. Authenticate with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
      const firebaseUser = userCredential.user;

      // 2. Check Email Verification
      if (!firebaseUser.emailVerified) {
        setUnverifiedEmail(value.email);
        throw new Error("EMAIL_NOT_VERIFIED");
      }

      // 3. Get ID Token
      const idToken = await firebaseUser.getIdToken();

      // 4. Verify with Backend to get Session Token & User Profile
      const data = await authAPI.verifyToken(idToken);

      const { user, token } = data;

      setToken(token);
      // Ensure plan field exists, fallback to free
      setUser({ ...user, plan: user.plan || SubscriptionPlans.free });

      toast.success("Welcome back!", "You have been successfully signed in");

      const redirectTo = searchParams?.get("redirect");
      const targetUrl = redirectTo
        ? decodeURIComponent(redirectTo)
        : "/dashboard";
      router.push(targetUrl);
    } catch (err: any) {
      // Handle Firebase specific errors if possible, or generic
      let errorMessage = "Login failed";

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Firebase auth errors often have a code
      if (err.code) {
        switch (err.code) {
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password";
            break;
          case "auth/user-not-found":
            errorMessage = "Account not found";
            break;
          case "auth/wrong-password":
            errorMessage = "Invalid password";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          case "auth/user-disabled":
            errorMessage = "Account disabled.";
            break;
        }
      }

      if (errorMessage === "EMAIL_NOT_VERIFIED") {
        toast.error(
          "Account Unverified",
          "Please verify your email address to login."
        );
      } else {
        toast.error("Login Failed", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignin = async (method: AuthRequestMethods) => {
    if (!method) {
      toast.error("Invalid Method", "Please select a valid sign-in method");
      return;
    }
    try {
      const { user: u, token } = await socialSignIn(method);
      if (!u) {
        toast.error("Sign-in Failed", "Social sign-in was unsuccessful");
        return;
      }

      const user = { ...u, plan: SubscriptionPlans.free };

      setToken(token);
      setUser(user);
      toast.success("Welcome back!", "You have been successfully signed in");

      const redirectTo = searchParams?.get("redirect");
      const targetUrl = redirectTo
        ? decodeURIComponent(redirectTo)
        : "/dashboard";
      router.push(targetUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Social sign-in failed";
      toast.error("Sign-in Failed", errorMessage);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {sessionExpired && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Session expired
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your session has expired. Please sign in again.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" color="white" /> : "Sign in"}
            </Button>
          </div>
        </form>
      </Form>

      {unverifiedEmail && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-800 mb-3">
            Your email address has not been verified yet.
          </p>
          <Button
            variant="outline"
            className="w-full border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            onClick={handleResendVerification}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <Spinner size="sm" />
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>
      )}

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <Button
              variant="secondary"
              className="w-full flex justify-start items-center gap-3"
              onClick={() => handleSocialSignin(AuthRequestMethods.google)}
            >
              <svg
                className="h-5 w-5 mr-2"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              Google
            </Button>
          </div>

          <div>
            <Button
              variant="secondary"
              className="w-full flex justify-start items-center gap-3"
              onClick={() => handleSocialSignin(AuthRequestMethods.github)}
            >
              <svg
                className="h-5 w-5 mr-2"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
