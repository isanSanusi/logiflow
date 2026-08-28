<script setup>
import { containerMaxW } from "@/config.js";
</script>

<template>
  <section class="p-6 min-h-[85vh]" :class="containerMaxW">
    <slot />
  </section>
</template>
