import { apiRequest } from "@/lib/api-client";

export const obatService = {
  getAll: (token?: string, params?: any) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    return apiRequest(`/obat${queryString ? `?${queryString}` : ""}`, token);
  },

  getById: (id: string, token?: string) => 
    apiRequest(`/obat/${id}`, token),

  getLowStock: (token: string) => 
    apiRequest("/obat/low-stock", token),

  create: (token: string, data: FormData) => 
    apiRequest("/obat", token, { method: "POST", body: data }),

  update: (token: string, id: string, data: FormData) => 
    apiRequest(`/obat/${id}`, token, { method: "PUT", body: data }),

  delete: (token: string, id: string) => 
    apiRequest(`/obat/${id}`, token, { method: "DELETE" }),
};