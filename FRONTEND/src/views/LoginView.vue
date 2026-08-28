<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import LoginForm from "@/components/Form/LoginForm.vue";

import { useAuthStore } from "@/stores/authStore.js";
import { ref } from "vue";

import api from "@/plugin/Axios.js";

const router = useRouter();
const authStore = useAuthStore();

const globalError = ref("");
const isLoading = ref(false);

const handleLogin = async (payload) => {
  try {
    isLoading.value = true;
    globalError.value = "";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@].[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      payload.identity
    );
    const requestBody = {
      password: payload.password,
      ...(isEmail ? { email: payload.identity } : { username: payload.identity }),
    };

    const { data } = await api.post("/auth/login", requestBody);
    // Simpan ke authStore
    authStore.setAuth({
      accessToken: data.accessToken,
      user: {
        name: data.name,
        username: data.username,
        role: data.role,
      },
    });
    router.push("/dashboard");
    await authStore.fetchMe();
  } catch (err) {
    isLoading.value = false;
    globalError.value = err.response?.data?.message;
  }
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen bg="purplePink">
      <LoginForm
        :globalError="globalError"
        :isLoading="isLoading"
        @submit="handleLogin"
      />
    </SectionFullScreen>
  </LayoutGuest>
</template>
