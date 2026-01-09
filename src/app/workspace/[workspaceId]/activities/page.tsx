"use client";

import { ActivityList } from "@/components/activity/ActivityList";

export default function ActivitiesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <ActivityList />
      </div>
    </div>
  );
}
