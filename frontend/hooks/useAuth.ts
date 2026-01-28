"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setCookie, deleteCookie } from "cookies-next";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "pelanggan";
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: "admin" | "pelanggan") => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password, role) => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const endpoint = role === "admin" ? "/auth/login-admin" : "/auth/login-pelanggan";

          const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, katakunci: password }),
          });

          const resData = await response.json();

          if (!response.ok) {
            throw new Error(resData.message || "Email atau password salah!");
          }

          // AMBIL DATA DARI KEY 'data' (Sesuai response API kamu)
          const userData = resData.data;
          const token = resData.token;

          // Simpan ke Cookies untuk Middleware & Hard Reload
          setCookie("token", token, { maxAge: 60 * 60 * 24 });
          setCookie("user", JSON.stringify(userData), { maxAge: 60 * 60 * 24 });

          // Update State Zustand
          set({ user: userData, token: token });

          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        deleteCookie("token");
        deleteCookie("user");
        set({ user: null, token: null });
        window.location.href = "/login";
      },
    }),
    { name: "auth-storage" }
  )
);