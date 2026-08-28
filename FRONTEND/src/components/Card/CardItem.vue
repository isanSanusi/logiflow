<script setup>
import { useProductStore } from "@/stores/productStore";
import { useCardStore } from "@/stores/CardStore";
import { useRouter } from "vue-router";
import { computed } from "vue";
import {
  mdiCashMinus,
  mdiCashPlus,
  mdiReceipt,
  mdiCogClockwise,
  mdiCreditCardOutline,
  mdiMenu,
} from "@mdi/js";

import PillTagTrend from "@/components/PillTagTrend.vue";
import IconRounded from "@/components/IconRounded.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import PillTag from "@/components/PillTag.vue";
import CardBox from "@/components/CardBox.vue";
import timeAgo from "@/plugin/TimeAgo.js";

const productStore = useProductStore();
const cardStore = useCardStore();
const router = useRouter();

const props = defineProps({
  id: String,
  no: Number,
  waktu: String,
  pemesan: String,
  oleh: String,
  data: Object,
  marked: Boolean,
  item: Object,
});

const toggleEdit = async (id) => {
  await productStore.deleteProduct(id);
  await productStore.fetchProduct();
};

function onCardClick(item, id) {
  cardStore.setItem(item);
  productStore.markedData(id);
  router.push({ name: "Detail page", query: { id } });
}
</script>

<template>
  <CardBox>
    <div
      class="relative rounded-xl shadow-lg cursor-pointer transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
    >
      <div @click="onCardClick(item, item.id)">
        <div class="flex justify-between items-center w-full">
          <h3 class="text-lg leading-tight text-gray-500 dark:text-slate-400 pb-2">
            <PillTagTrend :trend="oleh" small />
          </h3>
          <p class="text-sm text-gray-500">
            {{ timeAgo(waktu) }}
          </p>
        </div>

        <h1 class="text-2xl leading-tight font-semibold mt-3">
          {{ pemesan }}
        </h1>
      </div>
      <div class="absolute -bottom-3 -right-4">
        <BaseButton
          :icon="mdiMenu"
          color="none"
          class="border-none"
          iconSize="35"
          @click="toggleEdit(id)"
        />
      </div>
      <div
        v-if="!item.marked"
        class="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-green-500 animate-pulse"
      ></div>
    </div>
  </CardBox>
</template>
