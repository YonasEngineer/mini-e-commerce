import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  setLoggedInUser: (user: User, session: Session) => void;
  clearLoggedInUser: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoggedIn: false,
      setLoggedInUser: (user, session) =>
        set({
          user,
          session,
          isLoggedIn: true,
        }),
      clearLoggedInUser: () =>
        set({
          user: null,
          session: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "mini-e-commerce-auth",
    },
  ),
);

export const selectCurrentUser = (state: AuthStore) => state.user;
export const selectCurrentSession = (state: AuthStore) => state.session;
export const selectAuthState = (state: AuthStore) => ({
  currentUser: state.user,
  currentSession: state.session,
  isLoggedIn: state.isLoggedIn,
});
