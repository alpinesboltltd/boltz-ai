"use client";

import { ICPList } from "@/components/icp/ICPList";
import { useParams } from "next/navigation";

export default function ICPsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ICPList workspaceId={workspaceId} />
    </div>
  );
}
