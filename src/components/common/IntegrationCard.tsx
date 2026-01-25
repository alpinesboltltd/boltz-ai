import React from "react";
import { RefreshCw } from "lucide-react";


interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "loading";
  onStatusCheck?: () => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  footerMeta?: React.ReactNode;
  className?: string;
}

export const IntegrationCard = ({
  title,
  description,
  icon,
  status,
  onStatusCheck,
  children,
  actions,
  footerMeta,
  className = "",
  iconClassName = "bg-primary-50 text-primary-600",
}: IntegrationCardProps & { iconClassName?: string }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${iconClassName}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
          ) : status === "connected" ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-xs font-medium text-gray-600">Active</span>
            </>
          ) : (
            <>
              {onStatusCheck ? (
                <RefreshCw
                  className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={onStatusCheck}
                />
              ) : (
                <RefreshCw className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs font-medium text-gray-400">
                Inactive
              </span>
            </>
          )}
        </div>
      </div>

      {children && <div className="mt-4">{children}</div>}

      {(actions || footerMeta) && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">{footerMeta}</div>
          <div className="flex gap-2">{actions}</div>
        </div>
      )}
    </div>
  );
};
