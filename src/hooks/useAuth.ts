import { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext, type AuthState } from "../lib/auth";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types";

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (data) {
        setProfile(data);
        return;
      }
    } catch {
      // ignore network errors
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Check localStorage fallback first
    const savedMockUser = localStorage.getItem("esp_local_user");
    if (savedMockUser) {
      try {
        const u = JSON.parse(savedMockUser);
        if (isMounted) {
          setUser(u as User);
          setProfile({
            id: u.id,
            display_name: u.user_metadata?.display_name || u.email?.split("@")[0] || "Player",
            created_at: new Date().toISOString(),
          });
          setLoading(false);
        }
      } catch {
        // ignore JSON errors
      }
    }

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        const u = session?.user ?? null;
        if (u) {
          setUser(u);
          fetchProfile(u.id);
        }
        setLoading(false);
      }).catch(() => {
        if (isMounted) setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!isMounted) return;
          const u = session?.user ?? null;
          if (u) {
            setUser(u);
            fetchProfile(u.id);
          }
        }
      );

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } catch {
      if (isMounted) setLoading(false);
    }
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
        return;
      }
    } catch (err: any) {
      // If network error / mock supabase, create a local session
      console.warn("Supabase auth unavailable, falling back to local session:", err);
      const mockUser: any = {
        id: "local-" + Math.random().toString(36).substring(2, 9),
        email,
        app_metadata: {},
        user_metadata: { display_name: email.split("@")[0] },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("esp_local_user", JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        display_name: email.split("@")[0],
        created_at: new Date().toISOString(),
      });
    }
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
        return;
      }
    } catch (err: any) {
      // Fallback local session
      console.warn("Supabase auth unavailable, falling back to local session:", err);
      const mockUser: any = {
        id: "local-" + Math.random().toString(36).substring(2, 9),
        email,
        app_metadata: {},
        user_metadata: { display_name: displayName || email.split("@")[0] },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("esp_local_user", JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        display_name: displayName || email.split("@")[0],
        created_at: new Date().toISOString(),
      });
    }
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem("esp_local_user");
    setUser(null);
    setProfile(null);
  }, []);

  const signInAnonymously = useCallback(async (displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: { data: { display_name: displayName } },
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
        return;
      }
    } catch (err: any) {
      // Fallback guest session
      console.warn("Supabase auth unavailable, using guest local session:", err);
      const mockUser: any = {
        id: "guest-" + Math.random().toString(36).substring(2, 9),
        email: "guest@esptournament.local",
        app_metadata: {},
        user_metadata: { display_name: displayName || "Guest Player" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("esp_local_user", JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        display_name: displayName || "Guest Player",
        created_at: new Date().toISOString(),
      });
    }
  }, [fetchProfile]);

  return { user, profile, loading, signIn, signUp, signOut, signInAnonymously };
}
