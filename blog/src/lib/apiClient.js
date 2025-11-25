import axios from "axios";

const resolveBaseUrl = () => {
   if (process.env.NODE_ENV === "production") {
    return "https://nextblog-ten-chi.vercel.app/api";
  }
  return "http://localhost:3000/api";

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

