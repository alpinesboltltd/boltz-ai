"use client";

import { ObjectiveForm } from "@/components/objectives/ObjectiveForm";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NewObjectivePage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link href={`/workspace/${workspaceId}/objectives`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create New Objective
          </h2>
          <p className="text-muted-foreground">
            Define a clear goal for your AI workforce.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ObjectiveForm workspaceId={workspaceId} />
      </div>
    </div>
  );
}
