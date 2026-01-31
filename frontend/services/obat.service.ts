import { apiRequest } from "@/lib/api-client";

export const obatService = {
  getAll: (token: string, params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest(`/obat${query}`, token, { method: "GET" });
  },

  getById: (token: string, id: string) => 
    apiRequest(`/obat/${id}`, token, { method: "GET" }),

  getLowStock: (token: string) => 
    apiRequest("/obat/low-stock", token, { method: "GET" }),

  create: (token: string, data: any) => 
    apiRequest("/obat", token, { method: "POST", body: data }),

  update: (token: string, id: string, data: any) => 
    apiRequest(`/obat/${id}`, token, { method: "PUT", body: data }),

  delete: (token: string, id: string) => 
    apiRequest(`/obat/${id}`, token, { method: "DELETE" }),
};