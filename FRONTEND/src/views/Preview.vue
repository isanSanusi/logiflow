<script setup>
import {
  mdiTableBorder,
  mdiTableOff,
  mdiPlus,
  mdiMinus,
  mdiSend,
  mdiTrashCan,
  mdiHumanEdit,
  mdiMonitorCellphone,
} from "@mdi/js";
import { onMounted, ref, reactive, watchEffect } from "vue";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore.js";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/FormField.vue";
import CardBox from "@/components/CardBox.vue";

const productStore = useProductStore();
const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const isModalDangerActive = ref(false);
const isDeleteActive = ref(false);
const isSendActive = ref(false);
const isMinus = ref(false);
const confirmMinus = ref(false);
const datasProduct = ref(null);
const customer = ref("");
const datasPre = ref([]);
const send = ref(false);
const form = ref({});

const loadDatas = async () => {
  let getData = JSON.parse(localStorage.getItem("savedData")) || [];
  if (!getData) {
    router.push("/Welcome");
  }
  datasPre.value = getData;
};

const handleSend = async (datas) => {
  customer.value = datas.customer;
  const newData = {
    id: datas.id,
    oleh: authStore.user?.name || null,
    waktu: datas.Date ? new Date(datas.Date).toISOString() : new Date().toISOString(),
    pemesan: datas.customer || null,
    data: datas.data,
  };

  await productStore.inputProduct(newData);
  let sentDatas = JSON.parse(localStorage.getItem("sentData")) || [];
  sentDatas.push(newData);
  localStorage.setItem("sentData", JSON.stringify(sentDatas));
  datasPre.value = datasPre.value.filter((d) => d.id !== datas.id);
  save();
  isSendActive.value = true;
  setTimeout(() => {
    isSendActive.value = false;
  }, 2500);
};

const handleDelete = async (datas) => {
  customer.value = datas.customer;
  datasPre.value = datasPre.value.filter((d) => d.id !== datas.id);
  isDeleteActive.value = true;
  save();
  setTimeout(() => {
    isDeleteActive.value = false;
  }, 2500);
};

const plus = (data) => {
  data.jumlah++;
  save();
};

const min = (datas, index) => {
  datas.data[index].jumlah--;
  if (datas.data[index].jumlah <= 1) {
    isModalDangerActive.value = true;
    if (!confirmMinus) {
      datas.data.splice(index, 1);
    } else {
      return;
    }
  }
  if (datas.data.length === 0) {
    datasPre.value = datasPre.value.filter((d) => d !== datas);
  }
  save();
};

const openModalConfirmDelete = (datas) => {
  datasProduct.value = datas;
  isModalDangerActive.value = true;
  customer.value = datas.customer;
};

const openModalConfirmSend = (datas) => {
  datasProduct.value = datas;
  isModalDangerActive.value = true;
  customer.value = datas.customer;
  send.value = true;
};

const save = () => {
  localStorage.setItem("savedData", JSON.stringify(datasPre.value));
};

onMounted(() => {
  loadDatas();
  authStore.initializeAuth();
});
</script>

<template>
  <LayoutAuthenticated>
    <NotificationBar v-if="isSendActive" color="info" :icon="mdiMonitorCellphone">
      <b>{{ customer }}</b> Order was Sent.
    </NotificationBar>
    <NotificationBar v-if="isDeleteActive" color="danger" :icon="mdiTableOff">
      Order <b>{{ customer }}</b> Deleted Successfully.
    </NotificationBar>
    <CardBoxModal
      v-model="isModalDangerActive"
      title="Please confirm"
      v-model:send="send"
      v-model:minus="isMinus"
      :button="send ? 'info' : 'danger'"
      :datas="datasProduct"
      @delete="handleDelete"
      @send="handleSend"
      @delminus="confirmMinus = true"
      has-cancel
    >
      <p>
        Order for <b>{{ customer }}</b> will be {{ send ? "Sent" : "Deleted" }}.
      </p>
    </CardBoxModal>

    <SectionMain v-if="datasPre.length === 0">
      <SectionTitleLineWithButton :icon="mdiTableOff" title="Datas Empty" main>
        <BaseButton
          :icon="mdiPlus"
          iconSize="20"
          label="Add New"
          color="info"
          to="/input"
        />
      </SectionTitleLineWithButton>
      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
    <SectionMain v-else>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Preview Datas" main>
        <BaseButton
          :icon="mdiPlus"
          iconSize="24"
          label="Add New"
          color="success"
          to="/input"
        />
      </SectionTitleLineWithButton>
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
        <div v-for="datas in datasPre" :key="datas.id" class="py-7">
          <CardBox has-table>
            <div class="flex justify-between items-center p-5">
              <div>
                <FormField
                  label="Customer"
                  class="flex justify-center gap-2 items-end md:gap-0 md:flex-col md:items-start"
                >
                  <FormControl
                    v-model.trim="datas.customer"
                    type="text"
                    autocomplete="username"
                  />
                </FormField>
                <p class="text-sm">Date : {{ new Date(datas.Date).toLocaleString() }}</p>
              </div>
              <div class="flex flex-col md:flex-row justify-center items-center gap-1">
                <BaseButton
                  color="danger"
                  label="Delete"
                  :icon="mdiTrashCan"
                  @click="openModalConfirmDelete(datas)"
                />

                <BaseButton
                  color="info"
                  label="Send"
                  :icon="mdiSend"
                  @click="openModalConfirmSend(datas)"
                />
              </div>
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
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold uppercase text-center"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(data, idx) in datas.data" :key="idx" class="">
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
                  <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                      <BaseButton
                        color="danger"
                        :icon="mdiMinus"
                        iconSize="20"
                        small
                        @click="min(datas, idx)"
                      />
                      <BaseButton
                        color="info"
                        iconSize="20"
                        :icon="mdiPlus"
                        small
                        @click="plus(data)"
                      />
                    </BaseButtons>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardBox>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
