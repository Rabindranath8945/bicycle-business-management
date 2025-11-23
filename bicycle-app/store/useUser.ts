import { create } from "zustand";

export type User = {
  _id: string;
  name: string;
  email: string;
  token: string;
  role: string; // <-- ADD THIS
};

type Store = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useUser = create<Store>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  logout: () => set({ user: null }),
}));
