import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PersistStateStore = {
  isSidebarOpen?: boolean;
  selectedModel?: string;
  lastRoute?: string;
  actions: {
    setIsSidebarOpen: (isSidebarOpen: boolean) => void;
    setSelectedModel: (selectedModel: string) => void;
    setLastPage: (lastPage: string) => void;
  };
};

export const usePersistStateStore = create<PersistStateStore>()(
  persist(
    (set) => ({
      isSidebarOpen: undefined,
      selectedModel: undefined,
      lastRoute: undefined,
      actions: {
        setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
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
