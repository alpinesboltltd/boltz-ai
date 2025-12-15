"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox"; // Assuming this exists or will use standard input
import { Button } from "../ui/Button";
import { Spinner } from "../common/Spinner";
import { apiRequest } from "@/lib/api";
import {
  HardDrive,
  Calendar,
  Mail,
  BookOpen,
  Presentation,
  Table,
} from "lucide-react";

const googleServicesSchema = z.object({
  services: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type GoogleServicesFormValues = z.infer<typeof googleServicesSchema>;

interface GoogleServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  initialServices?: string[];
  onSuccess?: () => void;
}

const servicesList = [
  { id: "drive", label: "Google Drive", icon: HardDrive },
  { id: "calendar", label: "Google Calendar", icon: Calendar },
  { id: "mail", label: "Gmail", icon: Mail },
  { id: "classroom", label: "Google Classroom", icon: BookOpen },
  { id: "slides", label: "Google Slides", icon: Presentation },
  { id: "sheets", label: "Google Sheets", icon: Table },
];

export function GoogleServicesModal({
  isOpen,
  onClose,
  agentId,
  initialServices = [],
  onSuccess,
}: GoogleServicesModalProps) {
  const form = useForm<GoogleServicesFormValues>({
    resolver: zodResolver(googleServicesSchema),
    defaultValues: {
      services: initialServices,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ services: initialServices });
    }
  }, [isOpen, initialServices, form]);

  const onSubmit = async (data: GoogleServicesFormValues) => {
    try {
      await apiRequest(`/agent/${agentId}/integrations/google/batch`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update Google services", error);
      // form.setError or toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Google Services</DialogTitle>
          <DialogDescription>
            Select the Google services you want to enable for this agent.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    {servicesList.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          const Icon = service.icon;
                          return (
                            <FormItem
                              key={service.id}
                              className="flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          service.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="flex items-center gap-2 font-normal cursor-pointer">
                                  <Icon className="w-4 h-4" />
                                  {service.label}
                                </FormLabel>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex items-center gap-2"
              >
                {form.formState.isSubmitting && <Spinner />} Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
