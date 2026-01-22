"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bot, MessageSquare, Shield } from "lucide-react";

export function SuperAdminSidebar() {
  const pathname = usePathname();

  // Assuming superadmin routes are under /superadmin
  const navigation = [
    { name: "AI Models", href: "/superadmin/models", icon: Bot },
    { name: "Agent Templates", href: "/superadmin/templates", icon: Bot },
    { name: "Feedback", href: "/superadmin/feedback", icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Super Admin
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
