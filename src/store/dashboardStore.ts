import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum DetailsTab {
  PLAYGROUND = "playground",
  ACTIVITY = "activity",
  CONVERSATIONS = "conversations",
  SOURCES = "sources",
  // ACTION = "action",
  APPEARANCE = "appearance",
}

interface DashboardState {
  activeTab: DetailsTab;
  setActiveTab: (tab: DetailsTab) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      activeTab: DetailsTab.PLAYGROUND,
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "dashboard-storage",
    }
  )
);
