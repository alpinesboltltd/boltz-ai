"use client";

import { useEffect, useState } from "react";
import { activityAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity } from "lucide-react";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export function ActivityList() {
  const { workspaceId } = useParams();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!workspaceId) return;
      try {
        const res = await activityAPI.getByWorkspace(workspaceId as string, 50);
        setActivities(res.activities || []);
      } catch (error) {
        console.error("Failed to load activities", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Activity className="w-8 h-8 opacity-20" />
              <p>No recent activity recorded.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="transition-all hover:bg-accent/10"
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {activity.action.replace(/_/g, " ")}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.actor_type}: {activity.agent_id || "System"}
                  </p>
                  {activity.metadata && (
                    <div className="text-xs font-mono bg-muted/50 p-2 rounded mt-2 overflow-x-auto max-w-full">
                      {activity.metadata}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
