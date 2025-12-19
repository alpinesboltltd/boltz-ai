"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/common/Spinner";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;

  useEffect(() => {
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}/analytics`);
    }
  }, [workspaceId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}
