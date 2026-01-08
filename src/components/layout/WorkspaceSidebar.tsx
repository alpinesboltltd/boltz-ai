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
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { useWorkspaceStore } from "@/store/workspaceStore";

interface WorkspaceSidebarProps {
  workspaceId: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function WorkspaceSidebar({
  workspaceId,
  collapsed,
  setCollapsed,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { currentWorkspace } = useWorkspaceStore();
  const sidebarRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const headerTextRef = useRef<HTMLHeadingElement>(null);

  const navigation = [
    {
      name: "Dashboard",
      href: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
    },
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

  // Animate sidebar on collapse/expand
  useEffect(() => {
    if (!sidebarRef.current) return;

    const timeline = gsap.timeline();

    // Animate sidebar width
    timeline.to(sidebarRef.current, {
      width: collapsed ? 80 : 256,
      duration: 0.35,
      ease: "power2.inOut",
    });

    // Animate text elements opacity
    const allTextElements = [
      headerTextRef.current,
      ...textRefs.current.filter(Boolean),
    ];

    if (collapsed) {
      // Fade out text first, then shrink sidebar
      timeline.to(
        allTextElements,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.out",
        },
        0
      );
    } else {
      // Expand sidebar first, then fade in text
      timeline.to(
        allTextElements,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.in",
        },
        0.15
      );
    }
  }, [collapsed]);

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside
      ref={sidebarRef}
      className="bg-gray-50 border-r border-gray-200 hidden md:flex flex-col"
      style={{ width: collapsed ? 80 : 256 }}
    >
      <div className="p-4 border-b border-gray-200 h-16 flex items-center justify-between">
        <h2
          ref={headerTextRef}
          className={cn(
            "text-sm font-bold text-gray-900 truncate transition-all",
            collapsed && "opacity-0 w-0"
          )}
          title={currentWorkspace?.name}
        >
          {currentWorkspace?.name || "Workspace"}
        </h2>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item, index) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-white text-primary-700 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm",
                collapsed && "justify-center px-0"
              )}
              title={item.name}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active
                    ? "text-primary-600"
                    : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                className={cn(
                  "truncate transition-all",
                  collapsed && "opacity-0 w-0 hidden"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
