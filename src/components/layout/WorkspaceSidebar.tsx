"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Settings,
  MessageSquare,
  FileText,
  BookOpen,
  ShoppingBag,
  Target,
} from "lucide-react";

import { useWorkspaceStore } from "@/store/workspaceStore";

interface WorkspaceSidebarProps {
  workspaceId: string;
}

export function WorkspaceSidebar({ workspaceId }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { currentWorkspace } = useWorkspaceStore();

  const navigation = [
    {
      name: "Analytics",
      href: `/workspace/${workspaceId}/analytics`,
      icon: BarChart3,
    },
    { name: "Users", href: `/workspace/${workspaceId}/users`, icon: Users },
    {
      name: "ICPs",
      href: `/workspace/${workspaceId}/icps`,
      icon: Target,
    },
    {
      name: "Instructions",
      href: `/workspace/${workspaceId}/instructions`,
      icon: FileText,
    },
    {
      name: "Knowledge",
      href: `/workspace/${workspaceId}/knowledge`,
      icon: BookOpen,
    },
    {
      name: "Marketplace",
      href: `/workspace/${workspaceId}/market`,
      icon: ShoppingBag,
    },
    {
      name: "Feedback",
      href: `/workspace/${workspaceId}/feedback`,
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: `/workspace/${workspaceId}/settings`,
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-200 h-16 flex items-center">
        <h2
          className="text-sm font-bold text-gray-900 truncate"
          title={currentWorkspace?.name}
        >
          {currentWorkspace?.name || "Workspace"}
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-white text-primary-700 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active
                    ? "text-primary-600"
                    : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
