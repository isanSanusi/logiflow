<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan, mdiMonitorCellphone, mdiTableOff } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";

import NotificationBar from "@/components/NotificationBar.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";

import ModalFormCompany from "@/components/Form/CompanyForm.vue";

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

const items = computed(() => mainStore.clients);

const clientName = ref("");
const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const isInfoActive = ref(false);
const isDangerActive = ref(false);
const perPage = ref(5);
const currentPage = ref(0);
const checkedRows = ref([]);
const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const handleDelete = (client) => {
  clientName.value = client.name;
  isModalDangerActive.value = true;
};

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === client.id);
  }
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Add New or Update">
    <ModalFormCompany />
  </CardBoxModal>

  <CardBoxModal
    v-model:info="isInfoActive"
    v-model:danger="isDangerActive"
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>
      Sure Delete <b>{{ clientName }}</b>
    </p>
    <p>Data will be removed from database</p>
  </CardBoxModal>

  <NotificationBar v-if="isInfoActive" color="info" :icon="mdiMonitorCellphone">
    Canceled to delete<b>{{ clientName }}.</b>
  </NotificationBar>
  <NotificationBar v-if="isDangerActive" color="danger" :icon="mdiTableOff">
    <b>{{ clientName }}</b> Deleted Successfully.
  </NotificationBar>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th>Name</th>
        <th>Company</th>
        <th>City</th>
        <th>Progress</th>
        <th>Created</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, client)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :username="client.name" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
        </td>
        <td data-label="Name">
          {{ client.name }}
        </td>
        <td data-label="Company">
          {{ client.company }}
        </td>
        <td data-label="City">
          {{ client.city }}
        </td>
        <td data-label="Progress" class="lg:w-32">
          <progress
            class="flex w-2/5 self-center lg:w-full"
            max="100"
            :value="client.progress"
          >
            {{ client.progress }}
          </progress>
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small class="text-gray-500 dark:text-slate-400" :title="client.created">{{
            client.created
          }}</small>
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="handleDelete(client)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
