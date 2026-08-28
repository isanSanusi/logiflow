import { useAuthStore } from "./authStore.js";
import { defineStore } from "pinia";
import {ref, reactive} from 'vue'
import api from "@/plugin/Axios.js";

export const useUserStore = defineStore("users", () => {

  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

    function getBaseEndpoint() {
      const { roles } = useAuthStore();
      return roles === "SUPER_ADMIN" ? "/co" : "/usr";
    }

    async function fetchUsers() {
      loading.value = true;
      error.value = null;
      try {
        const endPoint = this.getBaseEndpoint();
        const res = await api.get(endPoint);
        users.value = res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
      } finally {
        loading.value = false;
      }
    }

    async function createUsers(payload) {
      loading.value = true;
      error.value = null;
      try {
        const endPoint = this.getBaseEndpoint();
        const res = await api.post(endPoint, payload);
        users.value.push(res.data);
        return res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function updateUsers(id, payload) {
      loading.value = true;
      error.value = null;
      try {
        const endPoint = this.getBaseEndpoint() + `/${id}`;
        const res = await api.put(endPoint, payload);
        // ⬅️ replace data di state
        const index = this.users.findIndex((c) => c.id === id);
        if (index !== -1) {
          users[index] = res.data;
        }
        return res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function deleteUsers(id) {
      try {
        const endPoint = getBaseEndpoint() + `/${id}`;
        await api.delete(endPoint);
        users.value = users.value.filter((c) => c.id !== id);
      } catch (err) {
        throw err.response?.data?.message || err.message;
      }
    }

    return {users, loading, error, fetchUsers, getBaseEndpoint, createUsers, updateUsers, deleteUsers}
});
