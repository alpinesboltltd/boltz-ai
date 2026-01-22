"use client";

import * as React from "react";

const TabsContext = React.createContext<string>("");

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  value,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  return (
    <TabsContext.Provider value={value}>
      <div className={className}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onValueChange,
            });
          }
          return child;
        })}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function TabsList({
  children,
  className = "",
  onValueChange,
}: TabsListProps) {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function TabsTrigger({
  value,
  children,
  className = "",
  onValueChange,
}: TabsTriggerProps) {
  const activeTab = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium transition-all ${isActive
          ? "bg-white text-primary-700 shadow-sm rounded-md"
          : "text-gray-600 hover:text-gray-900"
        } ${className}`}
      onClick={() => onValueChange?.(value)}
      type="button"
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const activeTab = React.useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
}

export { TabsContext };
