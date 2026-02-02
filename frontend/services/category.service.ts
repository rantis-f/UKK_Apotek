import { apiRequest } from "@/lib/api-client";

export const categoryService = {
  getAll: (token?: string) =>
    apiRequest("/jenis-obat", token),

  create: (token: string, data: FormData) =>
    apiRequest("/jenis-obat", token, { method: "POST", body: data }),

  update: (token: string, id: string, data: FormData) =>
    apiRequest(`/jenis-obat/${id}`, token, { method: "PUT", body: data }),

  delete: (token: string, id: string) =>
    apiRequest(`/jenis-obat/${id}`, token, { method: "DELETE" }),
};