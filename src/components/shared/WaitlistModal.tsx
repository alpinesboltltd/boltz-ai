"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import gsap from "gsap";
import { waitlistAPI } from "@/lib/api";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  role: z.string().optional(),
  inquiry: z.string().optional(),
  marketingConsent: z.boolean().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function WaitlistModal({
  isOpen,
  closeModal,
}: WaitlistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  // GSAP Animations
  useEffect(() => {
    if (isOpen) {
      // Opening animation
      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, scale: 0.95, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.5)",
            delay: 0.1,
          }
        );
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    // Closing animation
    if (overlayRef.current && contentRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          closeModal();
          // Reset internal state after close
          setTimeout(() => {
            setIsSuccess(false);
            setError(null);
            reset();
          }, 200);
        },
      });

      tl.to(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "-=0.1"
      );
    } else {
      closeModal();
    }
  };

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await waitlistAPI.join({
        name: data.name,
        email: data.email,
        organization: data.organization || "",
        role: data.role || "",
        inquiry: data.inquiry || "",
        marketing_consent: data.marketingConsent || false,
      });

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0f172a] border border-white/10 p-8 text-left shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              You're on the list!
            </h3>
            <p className="text-gray-400">
              We'll be in touch soon with your exclusive access to Level-X.
            </p>
            <button
              onClick={handleClose}
              className="mt-8 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Request Access
            </h3>
            <div className="mt-2 mb-6">
              <p className="text-sm text-gray-400">
                Join the waitlist for Level 4 Autonomous Employees.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Work Email
                </label>
                <input
                  {...register("email")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="john@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Organization{" "}
                    <span className="text-gray-600">(Optional)</span>
                  </label>
                  <input
                    {...register("organization")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Role <span className="text-gray-600">(Optional)</span>
                  </label>
                  <input
                    {...register("role")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="CTO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Inquiry <span className="text-gray-600">(Optional)</span>
                </label>
                <textarea
                  {...register("inquiry")}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Tell us about your automation needs..."
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  {...register("marketingConsent")}
                  className="mt-1 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/20"
                />
                <label
                  htmlFor="marketingConsent"
                  className="text-xs text-gray-400 leading-normal"
                >
                  I consent to receiving infrequent updates about Level-X
                  product launches and features.
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
