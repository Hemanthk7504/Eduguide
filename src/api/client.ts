import axios from "axios";

export const TOKEN_KEY = "eduguide_token";

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// If running in production / HTTPS (e.g. Vercel) and URL points to localhost,
// automatically route to deployed cloud backend to avoid mixed-content and unreachable host errors
if (
  typeof window !== "undefined" &&
  (window.location.protocol === "https:" || !window.location.hostname.match(/^(localhost|127\.0\.0\.1)$/)) &&
  (rawBaseUrl.includes("localhost") || rawBaseUrl.includes("127.0.0.1"))
) {
  rawBaseUrl = "https://eduguide.fastapicloud.dev/api/v1";
}

const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseURL = cleanBaseUrl.endsWith("/api/v1") ? cleanBaseUrl : `${cleanBaseUrl}/api/v1`;

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
