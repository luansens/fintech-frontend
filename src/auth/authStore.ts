import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccountSchema } from "../accounts/AccountSchemas";
import type { UserSchema } from "../users/UserSchemas";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserSchema | null;
  setAuth: (token: string, userInfo: UserSchema) => void;
  userAccounts: AccountSchema[];
  setUserAccounts: (accounts: AccountSchema[]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      userInfo: null,
      setAuth: (token, userInfo) =>
        set({
          isAuthenticated: true,
          token,
          userInfo,
        }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          token: null,
          userInfo: null,
        }),
      setUserAccounts: (accounts) => set({ userAccounts: accounts }),
      userAccounts: [],
    }),
    {
      name: "auth-storage", // name of the item in localStorage
    }
  )
);
