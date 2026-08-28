<script setup>
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useProductStore } from "@/stores/productStore.js";
import { mdiChartTimelineVariant, mdiAccountMultiple, mdiCartOutline } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";

import CardBox from "@/components/CardBox.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBoxClient from "@/components/CardBoxClient.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

const productStore = useProductStore();
const mainStore = useMainStore();

const chartData = ref(null);

const orders = computed(() => productStore.products.slice(0, 4));
const clientBarItems = computed(() => mainStore.clients.slice(0, 4));
const transactionBarItems = computed(() => mainStore.history);
const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(() => {
  fillChartData();
  productStore.fetchProduct();
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trend="12%"
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiAccountMultiple"
          :number="512"
          label="Clients"
        />
        <CardBoxWidget
          trend="12%"
          trend-type="down"
          color="text-blue-500"
          :icon="mdiCartOutline"
          :number="7770"
          prefix="$"
          label="Sales"
        />
        <CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="256"
          suffix="%"
          label="Performance"
        />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        <div class="flex flex-col justify-between">
          <CardBoxTransaction
            v-for="(transaction, index) in transactionBarItems"
            :key="index"
            :amount="transaction.amount"
            :date="transaction.date"
            :business="transaction.business"
            :type="transaction.type"
            :name="transaction.name"
            :account="transaction.account"
          />
        </div>
        <div class="flex flex-col justify-between">
          <CardBoxClient
            v-for="(order, index) in orders"
            :key="order.id"
            :name="order.pemesan"
            :login="order.oleh"
            :date="order.waktu"
            :no="index + 1"
          />
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
