"use client";

import { useEffect, useState } from "react";
import { ICPForm } from "@/components/icp/ICPForm";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { icpAPI } from "@/lib/api";
import { ICP } from "@/schemas/icp";
import { toast } from "@/store/toastStore";

export default function EditICPPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const icpId = params.icpId as string;
  const [icp, setIcp] = useState<ICP | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcp = async () => {
      try {
        const data = await icpAPI.get(workspaceId, icpId);
        setIcp(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load ICP");
      } finally {
        setIsLoading(false);
      }
    };
    fetchIcp();
  }, [workspaceId, icpId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link href={`/workspace/${workspaceId}/icps`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit ICP</h2>
          <p className="text-muted-foreground">{icp?.name}</p>
        </div>
      </div>

      <div className="max-w-3xl">
        {icp && <ICPForm workspaceId={workspaceId} initialData={icp} />}
      </div>
    </div>
  );
}
