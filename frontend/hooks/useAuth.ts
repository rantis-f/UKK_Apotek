import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export interface User {
  id: number;
  email: string;
  role: string;
  nama_pelanggan?: string;
  no_telp?: string;
  foto?: string | null;
  url_ktp?: string | null;
  alamat1?: string;
  kota1?: string;
  propinsi1?: string;
  kodepos1?: string;
  alamat2?: string;
  kota2?: string;
  propinsi2?: string;
  kodepos2?: string;
  alamat3?: string;
  kota3?: string;
  propinsi3?: string;
  kodepos3?: string;
  name?: string;
  jabatan?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, type: "admin" | "pelanggan") => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      login: async (email: string, password: string, type: "admin" | "pelanggan") => {
        set({ loading: true });
        try {
          const path = type === "admin" ? "/auth/login" : "/auth/login-pelanggan";
          const payload = type === "admin"
            ? { email, password }
            : { email, katakunci: password };

          const response = await fetch(`${API_URL}${path}`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
          });

          const resData = await response.json();

          if (response.ok && resData.success) {
            const userData = resData.data;
            const token = resData.data.token;

            setCookie("token", token, { maxAge: 60 * 60 * 24 });
            setCookie("user", JSON.stringify(userData), { maxAge: 60 * 60 * 24 });

            set({ user: userData, token: token, loading: false });
            return { success: true };
          }

          set({ loading: false });
          return { success: false, error: resData.message || "Email atau Password salah" };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: "Gagal terhubung ke server backend" };
        }
      },

      getProfile: async () => {
        const tokenFromCookie = getCookie("token");
        const token = get().token || (tokenFromCookie ? tokenFromCookie.toString() : null);
        
        if (!token) return;

        set({ loading: true });
        try {
          const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const resData = await response.json();
          if (resData.success) {
            set({ user: resData.data, loading: false });
            setCookie("user", JSON.stringify(resData.data));
          } else {
            set({ loading: false });
          }
        } catch (error) {
          set({ loading: false });
          console.error("Gagal sinkron data profil:", error);
        }
      },

      logout: () => {
        deleteCookie("token");
        deleteCookie("user");
        set({ user: null, token: null, loading: false });
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);