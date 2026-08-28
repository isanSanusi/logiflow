<script setup>
import { computed, ref, onMounted } from "vue";
import { mdiChartTimelineVariant, mdiAccountMultiple, mdiCartOutline } from "@mdi/js";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import SectionMain from "@/components/SectionMain.vue";
import { useAuthStore } from "@/stores/authStore";

const user = useAuthStore().user;
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div
        class="h-[60vh] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-6"
      >
        <div
          class="shadow-lg rounded-2xl p-10 max-w-xl w-full text-center animate-fadeIn"
        >
          <h1 class="text-5xl font-bold text-gray-800 mb-4">
            Selamat Datang, {{ user.name }}!
          </h1>
          <p class="text-gray-600 text-lg mb-6">
            Senang melihatmu kembali di dashboard. 🚀
          </p>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out forwards;
}
</style>
