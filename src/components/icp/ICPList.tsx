"use client";

import { useEffect, useState } from "react";
import { ICP } from "@/schemas/icp";
import { icpAPI } from "@/lib/api";
// import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import { Plus, Edit, Trash, Copy } from "lucide-react";
import Link from "next/link";
// import { toast } from "sonner"; // Removed
import { toast } from "@/store/toastStore"; // Added
// import { Badge } from "../ui/Badge";
// import { Skeleton } from "../ui/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/Button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

interface ICPListProps {
  workspaceId: string;
}

export function ICPList({ workspaceId }: ICPListProps) {
  const [icps, setIcps] = useState<ICP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for deletion dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchIcps = async () => {
    setIsLoading(true);
    try {
      const data = await icpAPI.list(workspaceId);
      setIcps(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ICPs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIcps();
  }, [workspaceId]);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await icpAPI.delete(workspaceId, deleteId);
      toast.success("ICP deleted");
      fetchIcps();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete ICP");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ideal Customer Profiles
          </h2>
          <p className="text-muted-foreground">
            Define and manage your target audience profiles for AI agents.
          </p>
        </div>
        <Link href={`/workspace/${workspaceId}/icps/new`}>
          <Button className="flex justify-center items-center">
            <Plus className="w-4 h-4 mr-2" /> Create ICP
          </Button>
        </Link>
      </div>

      {icps.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No ICPs defined yet.</p>
            <Link href={`/workspace/${workspaceId}/icps/new`}>
              <Button variant="outline">Create your first ICP</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {icps.map((icp) => (
            <Card key={icp.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate pr-2" title={icp.name}>
                    {icp.name}
                  </CardTitle>
                  <Badge variant={icp.is_active ? "default" : "secondary"}>
                    {icp.is_active ? "Active" : "Draft"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {icp.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {icp.intended_agents?.map((agent) => (
                    <Badge key={agent} variant="outline" className="text-xs">
                      {agent}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Industry:</strong>{" "}
                    {icp.firmographics?.industry?.slice(0, 2).join(", ")}
                    {icp.firmographics?.industry &&
                      icp.firmographics?.industry?.length > 2 &&
                      "..."}
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    {icp.value_priority?.support_tier}
                  </p>
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex justify-between mt-auto">
                <Link
                  href={`/workspace/${workspaceId}/icps/${icp.id}`}
                  className="w-full mr-2"
                >
                  <Button
                    variant="outline"
                    className="w-full flex justify-center items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  size="md"
                  onClick={() => icp.id && confirmDelete(icp.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Delete ICP</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ICP? This action cannot be
            undone.
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
