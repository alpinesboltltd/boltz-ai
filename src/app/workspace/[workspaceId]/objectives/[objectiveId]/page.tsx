"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { objectivesAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckCircle, Clock } from "lucide-react";

export default function ObjectiveDetailPage() {
  const { workspaceId, objectiveId } = useParams();
  const router = useRouter();
  const [objective, setObjective] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (objectiveId) {
      loadObjective();
    }
  }, [objectiveId]);

  const loadObjective = async () => {
    try {
      const res = await objectivesAPI.get(objectiveId as string);
      setObjective(res.objective);
    } catch (error) {
      console.error("Failed to load objective", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!objectiveId) return;
    setExecuting(true);
    try {
      const res = await objectivesAPI.execute(objectiveId as string);
      setObjective(res.objective);
    } catch (error) {
      console.error("Failed to execute objective", error);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!objective) return <div>Objective not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Objective Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{objective.description}</p>
              <div className="mt-4 flex gap-2">
                <Badge
                  variant={
                    objective.status === "completed" ? "default" : "secondary"
                  }
                >
                  {objective.status}
                </Badge>
                {objective.agent_id && (
                  <Badge variant="outline">Agent: {objective.agent_id}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Plan & Execution</CardTitle>
              {objective.status !== "completed" && (
                <Button onClick={handleExecute} disabled={executing}>
                  {executing ? "Executing..." : "Execute Plan"}
                  {!executing && <Play className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {objective.tasks && objective.tasks.length > 0 ? (
                <div className="space-y-4">
                  {objective.tasks.map((task: any) => (
                    <div key={task.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">
                          Step {task.sequence}: {task.description}
                        </span>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                      {task.output && (
                        <div className="bg-muted p-2 rounded text-sm mt-2">
                          <span className="font-semibold">Result:</span>{" "}
                          {task.output}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No plan generated yet or decomposition in progress.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info/Result */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              {objective.result ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 mb-2" />
                  {objective.result}
                </div>
              ) : (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending execution
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
