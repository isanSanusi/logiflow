import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import api from "@/plugin/Axios.js";

export const useAuthStore = defineStore("auth", () =>  {

  const me = ref([])
  const isAuthenticated = ref(false)
  const user = ref(null)
  const role = ref(null)
  const loading = ref(false)
  const error = ref(null);
  
  const roles = computed(() => role.value)
  const isAdmin = computed(() => role.value === "ADMIN")
  const isSuper = computed(() => role.value === "SUPER_ADMIN")
  

    function setAuth(payload) {
      isAuthenticated.value = true;
      user.value = payload.user;
      role.value = payload.user?.role || null;
      localStorage.setItem("user", JSON.stringify(payload.user));
    }

    function clearAuth() {
      isAuthenticated.value = false;
      user.value = null;
      role.value= null;
      localStorage.removeItem("user");
    }

    function initializeAuth() {
      const user = localStorage.getItem("user");
      if (user) {
        setAuth({ user: JSON.parse(user) });
      }
    }

    async function refreshToken() {
      try {
        const { data } = await api.post("/auth/refresh");
        const user = JSON.parse(localStorage.getItem("user"));
        setAuth({ user });
        return data.accessToken;
      } catch (err) {
        clearAuth();
        return null;
      }
    }

    async function fetchMe() {
      loading.value = true;
      error.value = null;
      try {
        const res = await api.get("/auth/me");
        me.value = res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
      } finally {
        loading.value = false;
      }
    }

    async function logout() {
      try {
        await api.post("/auth/logout");
        me.value = [];
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        clearAuth();
      }
    }
  
    return {
      me, isAuthenticated,roles,isAdmin,isSuper, role, loading, error, user, fetchMe, logout, refreshToken, initializeAuth, clearAuth, setAuth
    }
});
