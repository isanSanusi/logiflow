import { defineStore } from "pinia";
import { ref, reactive } from "vue"
import api from "@/plugin/Axios.js";

export const useProductStore = defineStore("product", () => {
  const products = ref([])
  const product = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProduct() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get("/order");
      products.value = res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductId(id) {
    product.value = [];
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get(`/order/${id}`);
      product.value = res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
    } finally {
      loading.value = false;
    }
  }

  async function inputProduct(payload) {
    loading.value = true;
    error.value = false;
    try {
      const res = await api.post("/order", payload);
      products.value.push(res.data);
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(id, payload) {
    loading.value = true;
    error.value = false;
    try {
      const res = await api.put(`/order/${id}`, payload);
      const index = this.product.findIndex((c) => c.id === id);
      if (index !== -1) {
        product[index] = res.data;
      }
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function markedData(id) {
    loading.value = true;
    error.value = false;
    try {
      const res = await api.post(`/order/mark/${id}`);
      if (res.ok) {
        products.value = this.product.map((p) =>
          p.id === id ? { ...p, marked: true } : p
        );
      }
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id) {
    try {
      await api.delete(`/order/${id}`);
      product.value = product.value.filter((c) => c.id !== id);
    } catch (err) {
      throw err.response?.data?.message || "Delete product failed";
    }
  }

  return { product, products, loading, error, fetchProduct, fetchProductId, updateProduct, deleteProduct, markedData, inputProduct }
});
