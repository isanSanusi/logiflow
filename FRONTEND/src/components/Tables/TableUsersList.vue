<script setup>
import { mdiHumanEdit, mdiTrashCan, mdiMonitorCellphone, mdiTableOff } from "@mdi/js";
import { useUserStore } from "@/stores/userStore";
import { useMainStore } from "@/stores/main";
import { computed, ref } from "vue";

import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import timeAgo from "@/plugin/TimeAgo.js";

const props = defineProps({
  checkable: Boolean,
  fromupdate: Boolean,
  update: Boolean,
  username: String,
  fullname: String,
  danger: Boolean,
  id: [String, Number],
});

const userStore = useUserStore();
const items = computed(() => userStore.users);

const emit = defineEmits([
  "update:fromupdate",
  "update:update",
  "update:username",
  "update:fullname",
  "update:id",
  "update:danger",
]);

const clientFullName = ref("");
const clientId = ref("");
const isModalDangerActive = ref(false);
const isInfoActive = ref(false);

const checkedRows = ref([]);
const currentPage = ref(0);
const perPage = ref(5);

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

const handleDelete = async (id) => {
  await userStore.deleteUsers(id);
  await userStore.fetchUsers();
  emit("update:danger", true);
  setTimeout(() => {
    emit("update:danger", false);
  }, 2500);
};

const openConfirmBoxDelete = (client) => {
  clientId.value = client.id;
  clientFullName.value = client.fullName;
  isModalDangerActive.value = true;
};

const handleEdit = async (client) => {
  emit("update:username", client.username);
  emit("update:fullname", client.fullName);
  emit("update:id", client.id);
  emit("update:fromupdate", true);
  emit("update:update", true);
};
</script>

<template>
  <CardBoxModal
    v-model:danger="props.danger"
    v-model="isModalDangerActive"
    v-model:clientId="clientId"
    title="Please confirm"
    button="danger"
    has-cancel
    @delete="handleDelete"
  >
    <p>
      Sure Delete <b>{{ clientFullName }}</b>
    </p>
    <p>Data will be removed from database</p>
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th class="text-center uppercase">Name</th>
        <th class="text-center uppercase">Username</th>
        <th class="text-center uppercase">role</th>
        <th class="text-center uppercase">Created</th>
        <th class="text-center uppercase">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <td class="text-center font-bold">
          {{ client.fullName }}
        </td>
        <td class="text-center">
          {{ client.username }}
        </td>
        <td class="text-center">
          {{ client.role }}
        </td>
        <td class="text-center whitespace-nowrap">
          {{ timeAgo(client.createdAt) }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiHumanEdit"
              small
              @click="handleEdit(client)"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="openConfirmBoxDelete(client)"
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
