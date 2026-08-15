import { createContext } from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types";

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAnonymously: (displayName: string) => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInAnonymously: async () => {},
});
