const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async (
  endpoint: string,
  token?: string | null,
  options: RequestInit & { body?: any } = {}
) => {
  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object" && !isFormData) {
    config.body = JSON.stringify(options.body);
  } else {
    config.body = options.body;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config);

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await res.text();
      console.error("Server tidak mengirim JSON:", textError);
      throw new Error(`Server Error (${res.status}): Tidak dapat memproses permintaan.`);
    }

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || `Error ${res.status}: Gagal terhubung ke server`);
    }

    return json; 

  } catch (error: any) {
    console.error("🚨 API REQUEST ERROR:", error.message);
    throw error;
  }
};