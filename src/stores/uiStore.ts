import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  pendingCoachCount: number;
  toggleSidebar: () => void;
  setPendingCoachCount: (count: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  pendingCoachCount: 0,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setPendingCoachCount: (count) => set({ pendingCoachCount: count }),
}));
