<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useProductStore } from "@/stores/productStore";
import { onMounted } from "vue";

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProduct();
});
</script>

<template>
  <LayoutAuthenticated />
</template>
