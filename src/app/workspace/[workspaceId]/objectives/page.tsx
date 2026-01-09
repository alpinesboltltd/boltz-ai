"use client";

import ObjectiveList from "@/components/objectives/ObjectiveList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ObjectivesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Objectives</h1>
        <p className="text-muted-foreground">
          Manage and track autonomous agent objectives and tasks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <ObjectiveList />
      </div>
    </div>
  );
}
