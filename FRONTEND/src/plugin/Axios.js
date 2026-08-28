// plugin/Axios.js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore.js";
// import router from "@/router/Router.js";
import router from "@/router/index.js"

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const AuthStore = useAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await AuthStore.refreshToken();
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        await AuthStore.logout();
        router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);
export default api;
