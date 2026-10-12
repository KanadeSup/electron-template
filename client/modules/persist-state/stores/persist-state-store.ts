import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PersistStateStore = {
  isSidebarOpen?: boolean;
  sidebarWidth?: number;
  selectedModel?: string;
  lastRoute?: string;
  actions: {
    setIsSidebarOpen: (isSidebarOpen: boolean) => void;
    setSidebarWidth: (sidebarWidth: number) => void;
    setSelectedModel: (selectedModel: string) => void;
    setLastPage: (lastPage: string) => void;
  };
};

export const usePersistStateStore = create<PersistStateStore>()(
  persist(
    (set) => ({
      isSidebarOpen: undefined,
      sidebarWidth: undefined,
      selectedModel: undefined,
      lastRoute: undefined,
      actions: {
        setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
        setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
        setSelectedModel: (selectedModel) => set({ selectedModel }),
        setLastPage: (lastPage) => set({ lastRoute: lastPage }),
      },
    }),
    {
      name: "persist-state",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ actions, ...state }) => state,
    },
  ),
);
