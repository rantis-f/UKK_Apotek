import { apiRequest } from "@/lib/api-client";

export const restockService = {
    getAll: (token: string) => apiRequest("/restock", token),
    create: (token: string, data: any) =>
        apiRequest("/restock", token, {
            method: "POST",
            body: data
        }),
    getById: (token: string, id: string) => apiRequest(`/arestock/${id}`, token),
};