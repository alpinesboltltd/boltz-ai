"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { objectiveSchema, ObjectiveValues } from "@/schemas/objective";
import { objectivesAPI, agentsAPI } from "@/lib/api"; // Assuming agentsAPI exists for agent selection
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/store/toastStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Agent } from "@/types/agent";

interface ObjectiveFormProps {
  workspaceId: string;
}

export function ObjectiveForm({ workspaceId }: ObjectiveFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const form = useForm<ObjectiveValues>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: {
      description: "",
      agent_id: undefined,
    },
  });

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const res = await agentsAPI.getByWorkspaceId(workspaceId);
        setAgents(res.agents || []);
      } catch (error) {
        console.error("Failed to fetch agents", error);
        // Optional: toast.error("Failed to load agents");
      } finally {
        setIsLoadingAgents(false);
      }
    };
    if (workspaceId) {
      fetchAgents();
    }
  }, [workspaceId]);

  const onSubmit = async (data: ObjectiveValues) => {
    setIsSubmitting(true);
    try {
      await objectivesAPI.create(workspaceId, data.description, data.agent_id);
      toast.success("Objective created successfully");
      router.push(`/workspace/${workspaceId}/objectives`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create objective");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create Objective</CardTitle>
        <CardDescription>
          Define a high-level goal for your agent(s) to achieve.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Increase website traffic by 20%"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Agent (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingAgents ? (
                        <div className="p-2 flex items-center justify-center text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Loading...
                        </div>
                      ) : agents.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No agents found
                        </div>
                      ) : (
                        agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    If selected, this objective will be specifically tracked for
                    this agent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Objective
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
