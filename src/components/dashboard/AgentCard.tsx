import {
  LucideIcon,
  MessageSquare,
  Trash2,
  MoreVertical,
  Zap,
  Star,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/types/agent";
import Image from "next/image";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { enumToAgentType } from "@/lib/agentTypeSerializer";
import { Button } from "../ui/Button";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    status: AgentStatus;
    imageUrl?: string;
    icon?: LucideIcon;
    isTemplate?: boolean;
    agent_type?: string | number;
    ai_model?: string;
    credits_per_1k?: number;
    average_rating?: number;
  };
  onDelete: (id: string, name: string) => void;
  onManage?: () => void;
  onHire?: () => void;
}

export function AgentCard({
  agent,
  onDelete,
  onManage,
  onHire,
}: AgentCardProps) {
  const IconComponent = agent.icon || Bot;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      {/* Card Header / Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {agent.imageUrl ? (
          <Image
            src={agent.imageUrl}
            alt={agent.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-50 to-primary-100/50">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="h-10 w-10 text-primary-600" />
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md",
              agent.status === "active"
                ? "bg-green-500/10 text-green-700 ring-1 ring-green-600/20 bg-white/80"
                : "bg-yellow-500/10 text-yellow-700 ring-1 ring-yellow-600/20 bg-white/80"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                agent.status === "active"
                  ? "bg-green-600 animate-pulse"
                  : "bg-yellow-600"
              )}
            />
            {agent.status === "active" ? "Active" : "Draft"}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-gray-500 shadow-sm hover:bg-white hover:text-gray-900 transition-colors focus:outline-none">
              <MoreVertical className="h-4 w-4" />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={agent.isTemplate ? onHire : onManage}
                        className={cn(
                          "group flex w-full items-center rounded-lg px-2 py-2 text-sm",
                          focus
                            ? "bg-primary-50 text-primary-900"
                            : "text-gray-900"
                        )}
                      >
                        {agent.isTemplate ? (
                          <Zap className="mr-2 h-4 w-4 text-primary-500" />
                        ) : (
                          <MessageSquare className="mr-2 h-4 w-4 text-primary-500" />
                        )}
                        {agent.isTemplate ? "Hire Agent" : "Manage Agent"}
                      </button>
                    )}
                  </MenuItem>
                </div>
                {!agent.isTemplate && (
                  <div className="px-1 py-1">
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={() => onDelete(agent.id, agent.name)}
                          className={cn(
                            "group flex w-full items-center rounded-lg px-2 py-2 text-sm",
                            focus ? "bg-red-50 text-red-900" : "text-gray-900"
                          )}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                          Delete
                        </button>
                      )}
                    </MenuItem>
                  </div>
                )}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="font-semibold text-gray-900 line-clamp-1"
              title={agent.name}
            >
              {agent.name}
            </h3>
            {agent.average_rating && (
              <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 fill-current" />
                {agent.average_rating}
              </div>
            )}
          </div>
          <p
            className="mt-2 text-sm text-gray-500 line-clamp-2"
            title={agent.description}
          >
            {agent.description || "No description provided."}
          </p>

          {/* Stats Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Model
              </p>
              <p className="mt-0.5 text-sm font-medium text-gray-700 truncate uppercase">
                {typeof agent.ai_model === "object" && agent.ai_model !== null
                  ? (agent.ai_model as any).name
                  : agent.ai_model || "GPT-4"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Type
              </p>
              <p className="mt-0.5 text-sm font-medium text-gray-700 truncate capitalize">
                {enumToAgentType(agent.agent_type as number)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <Button
            onClick={agent.isTemplate ? onHire : onManage}
            className="btn w-full"
          >
            {agent.isTemplate ? (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Hire Agent
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Open Chat
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
