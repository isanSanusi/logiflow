<script setup>
import UserAvatar from "@/components/UserAvatar.vue";
import { useAuthStore } from "@/stores/authStore";
import { useMainStore } from "@/stores/main";

const authStore = useAuthStore();
const mainStore = useMainStore();
</script>

<template>
  <UserAvatar :username="authStore.user.name" :avatar="mainStore.userAvatar">
    <slot />
  </UserAvatar>
</template>
