import { defineStore } from "pinia";
import {ref, reactive} from 'vue'
import api from "@/plugin/Axios.js";

export const useCompanyStore = defineStore("company", () => {
  const companies = ref([])
  const loading = ref(false)
  const error = ref(false)


    async function fetchCompanies() {
      loading.value = true;
      error.value = null;
      try {
        const res = await api.get("/dev");
        companies.value = res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
      } finally {
        loading.value = false;
      }
    }

    async function createCompany(payload) {
      loading.value = true;
      error.value = null;
      try {
        const res = await api.post("/dev", payload);

        // ⬅️ langsung push ke state tanpa fetch ulang
        companies.value.push(res.data);

        return res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function updateCompany(id, payload) {
      loading.value = true;
      error.value = null;
      try {
        const res = await api.put(`/dev/${id}`, payload);
        // ⬅️ replace data di state
        const index = this.companies.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.companies[index] = res.data;
        }
        return res.data;
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
        throw err;
      } finally {
        loading.value = false;
      }
    }

    // fungsi delete
    async function deleteCompany(id) {
      try {
        await api.delete(`/dev/${id}`);
        companies.value = companies.value.filter((c) => c.id !== id);
      } catch (err) {
        throw err.response?.data?.message || "Gagal hapus company.";
      }
    }

    return { companies, loading, error, fetchCompanies, createCompany, updateCompany, deleteCompany}
});
