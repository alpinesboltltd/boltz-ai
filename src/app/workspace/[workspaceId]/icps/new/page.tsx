"use client";

import { ICPForm } from "@/components/icp/ICPForm";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NewICPPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link href={`/workspace/${workspaceId}/icps`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New ICP</h2>
          <p className="text-muted-foreground">
            Define a new Ideal Customer Profile for your agents.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <ICPForm workspaceId={workspaceId} />
      </div>
    </div>
  );
}
