// lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async (endpoint: string, token: string, options: any = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal terhubung ke server eksternal");
  }

  return json.data;
};