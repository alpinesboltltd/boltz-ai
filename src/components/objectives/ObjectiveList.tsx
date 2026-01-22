"use client";

import { useEffect, useState } from "react";
import { objectivesAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ObjectiveList() {
  const { workspaceId } = useParams();
  const [objectives, setObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workspaceId) {
      loadObjectives();
    }
  }, [workspaceId]);

  const loadObjectives = async () => {
    try {
      const res = await objectivesAPI.getByWorkspace(workspaceId as string);
      setObjectives(res.objectives || []);
    } catch (error) {
      console.error("Failed to load objectives", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Objectives</h2>
        <Link href={`/workspace/${workspaceId}/objectives/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Objective
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {objectives.map((obj) => (
          <Card
            key={obj.id}
            className="transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-medium">{obj.description}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(obj.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={obj.status === "completed" ? "default" : "secondary"}
                >
                  {obj.status}
                </Badge>
                <Link href={`/workspace/${workspaceId}/objectives/${obj.id}`}>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {objectives.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No active objectives found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
