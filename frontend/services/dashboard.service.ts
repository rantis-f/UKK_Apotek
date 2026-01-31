import { apiRequest } from "@/lib/api-client";

export const dashboardService = {
  getStats: (token: string) => 
    apiRequest("/dashboard", token, { method: "GET" }),
};