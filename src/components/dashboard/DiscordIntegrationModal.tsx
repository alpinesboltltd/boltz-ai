"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/common/Spinner";
import { agentsAPI } from "@/lib/api";
import { Platform } from "@/types/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";

const discordSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  botToken: z.string().min(1, "Bot Token is required"),
});

type DiscordFormValues = z.infer<typeof discordSchema>;

interface DiscordIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onSuccess?: () => void;
  initialData?: {
    apiKey?: string;
    apiSecret?: string;
  };
}

export default function DiscordIntegrationModal({
  isOpen,
  onClose,
  agentId,
  onSuccess,
  initialData,
}: DiscordIntegrationModalProps) {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(discordSchema),
    defaultValues: {
      applicationId: initialData?.apiKey || "",
      botToken: initialData?.apiSecret || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        applicationId: initialData?.apiKey || "",
        botToken: initialData?.apiSecret || "",
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (data: DiscordFormValues) => {
    try {
      await agentsAPI.createIntegration({
        agent_id: agentId,
        platform: Platform.DISCORD,
        api_key: data.applicationId,
        api_secret: data.botToken,
        is_active: true,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to configure Discord", error);
      // Could add toast here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Discord Bot</DialogTitle>
          <DialogDescription>
            Enter your Discord Application ID and Bot Token to connect.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="applicationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application ID</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="botToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Token</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="MTA..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-2"
              >
                {form.formState.isSubmitting && <Spinner />} Connect
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
