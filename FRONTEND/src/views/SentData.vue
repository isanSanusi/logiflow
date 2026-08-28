<script setup>
import { mdiTableBorder, mdiTrashCan, mdiTableOff, mdiMonitorCellphone } from "@mdi/js";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore.js";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";

const productStore = useProductStore();
const authStore = useAuthStore();
const uiStore = useUiStore();

const isModalConfirm = ref(false);
const isNotify = ref(false);
const datasSent = ref([]);
const isDatas = ref(null);
const client = ref("");

const loadDatas = async () => {
  let getData = JSON.parse(localStorage.getItem("sentData")) || [];
  datasSent.value = getData;
};

const openModalConfirm = (datas) => {
  isModalConfirm.value = true;
  isDatas.value = datas;
  client.value = datas.pemesan;
};

const handleDelete = async (datas) => {
  datasSent.value = datasSent.value.filter((d) => d.id !== datas.id);
  save();
  isNotify.value = true;
  setTimeout(() => {
    isNotify.value = false;
  }, 3000);
};

const save = () => {
  localStorage.setItem("sentData", JSON.stringify(datasSent.value));
};

onMounted(() => {
  authStore.initializeAuth();
  loadDatas();
});
</script>

<template>
  <LayoutAuthenticated>
    <NotificationBar v-if="isNotify" color="info" :icon="mdiMonitorCellphone">
      Data from <b>{{ client }}</b> deleted successfully.
    </NotificationBar>
    <CardBoxModal
      v-model="isModalConfirm"
      v-model:datas="isDatas"
      title="Remove Data?"
      button="danger"
      has-cancel
      @delete="handleDelete"
    >
      <span>
        <p>
          Datas from <b>{{ client }}</b>
        </p>
        <p>will be removed permanent from storage.</p>
      </span>
    </CardBoxModal>
    <SectionMain v-if="datasSent.length === 0">
      <SectionTitleLineWithButton :icon="mdiTableOff" title="Datas Empty" />
      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
    <sectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Sent Datas" main />
      <CardBox v-if="productStore.loading">
        <div class="text-gray-500">Loading...</div>
      </CardBox>

      <CardBox v-else-if="productStore.error">
        <div class="text-red-500">
          {{ productStore.error }}
        </div>
      </CardBox>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <div v-for="datas in datasSent" :key="datas.id" class="mb-10">
          <CardBox has-table>
            <div class="flex justify-between items-center p-5">
              <div>
                <h5 class="text-sm font-bold">Costumer : {{ datas.pemesan }}</h5>
                <p class="text-sm">Date : {{ new Date(datas.waktu).toLocaleString() }}</p>
              </div>
              <BaseButton
                color="danger"
                label="Delete"
                :icon="mdiTrashCan"
                small
                @click="openModalConfirm(datas)"
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Category
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Size
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Diameter
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Volume
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">
                    Qty (logs)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(data, idx) in datas.data" :key="idx" class="transition">
                  <td class="px-4 py-3 text-sm text-center">
                    {{ data.kategori }}
                  </td>
                  <td class="px-4 py-3 text-sm font-medium text-center">
                    {{ data.ukuran }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center">
                    {{ data.diameter }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center">
                    {{ data.volume }}
                  </td>
                  <td class="px-4 py-3 text-sm text-center">
                    {{ data.jumlah }}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBox>
        </div>
      </div>
    </sectionMain>
  </LayoutAuthenticated>
</template>
