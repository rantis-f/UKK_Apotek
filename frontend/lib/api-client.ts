const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async (endpoint: string, token: string, options: any = {}) => {
  const isFormData = options.body instanceof FormData;

  const headers: any = {
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object" && !isFormData) {
    config.body = JSON.stringify(options.body);
  } else {
    config.body = options.body;
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Gagal terhubung ke server");
  }

  return json.data;
};