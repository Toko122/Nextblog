import axios from "axios";

const resolveBaseUrl = () => {
  const explicit =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (typeof window === "undefined") {
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}/api`;
    }
    return "http://localhost:3000/api";
  }

  return "/api";
};

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (config.url && (config.url.includes("/auth/signup") || config.url.includes("/auth/login"))) {
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;

