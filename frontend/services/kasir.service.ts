import { apiRequest } from "@/lib/api-client";

export const kasirService = {
  getAllProducts: (token?: string, params?: any) => {
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

  checkout: (token: string, data: any) =>
    apiRequest("/penjualan", token, {
      method: "POST",
      body: data,
    }),
};