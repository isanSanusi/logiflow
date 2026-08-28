<script setup>
import { mdiMessageOff, mdiMessage, mdiInbox } from "@mdi/js";
import { useProductStore } from "@/stores/productStore.js";
import { useCardStore } from "@/stores/CardStore.js";
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardItem from "@/components/Card/CardItem.vue";
import CardBox from "@/components/CardBox.vue";

const productStore = useProductStore();

const items = computed(() => productStore.products);

onMounted(() => {
  productStore.fetchProduct();
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiInbox" title="Inbox Order" />
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardItem
          v-for="(item, index) in items"
          :key="item.id"
          :id="item.id"
          :no="index + 1"
          :oleh="item.oleh"
          :pemesan="item.pemesan"
          :waktu="item.waktu"
          :marked="item.marked"
          :item="item"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
