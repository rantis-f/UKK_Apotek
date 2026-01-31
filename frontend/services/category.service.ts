import { apiRequest } from "@/lib/api-client";

export const categoryService = {
  getAll: (token: string) => 
    apiRequest("/jenis-obat", token, { method: "GET" }),

  create: (token: string, data: any) => 
    apiRequest("/jenis-obat", token, { method: "POST", body: data }),

  update: (token: string, id: string, data: any) => 
    apiRequest(`/jenis-obat/${id}`, token, { method: "PUT", body: data }),

  delete: (token: string, id: string) => 
    apiRequest(`/jenis-obat/${id}`, token, { method: "DELETE" }),
};