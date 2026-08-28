<script setup>
import { mdiTableBorder, mdiPlusCircle, mdiTableOff, mdiMonitorCellphone } from "@mdi/js";
import { useUserStore } from "@/stores/userStore";
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import ModalBoxUserForm from "@/components/ModalForm/ModalBoxUserForm.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import TableUserList from "@/components/Tables/TableUsersList.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import SectionMain from "@/components/SectionMain.vue";
import UserForm from "@/components/Form/UserForm.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";

const userStore = useUserStore();
const items = computed(() => userStore.users);

const clientFullName = ref("");
const clientUserName = ref("");
const formInput = ref(null);
const clientId = ref("");

const isInfoUpdateActive = ref(false);
const isInfoCreateActive = ref(false);
const isDangerActive = ref(false);
const isModalActive = ref(false);
const isUpdate = ref(false);

const handleSubmit = async (id, payload) => {
  if (isUpdate.value === true) {
    await userStore.updateUsers(id, payload);
    isInfoUpdateActive.value = true;
    setTimeout(() => {
      isInfoUpdateActive.value = false;
    }, 2500);
  } else if (isUpdate.value === false) {
    await userStore.createUsers(payload);
    isInfoCreateActive.value = true;
    setTimeout(() => {
      isInfoCreateActive.value = false;
    }, 2500);
  }
  await userStore.fetchUsers();
};

onMounted(() => {
  userStore.fetchUsers();
});
</script>

<template>
  <LayoutAuthenticated>
    <NotificationBar v-if="isInfoUpdateActive" color="info" :icon="mdiMonitorCellphone">
      <b>{{ clientFullName }}</b> Updated successfully.
    </NotificationBar>
    <NotificationBar v-if="isInfoCreateActive" color="info" :icon="mdiMonitorCellphone">
      <b>New User was Created.</b>
    </NotificationBar>
    <NotificationBar v-if="isDangerActive" color="danger" :icon="mdiTableOff">
      <b>{{ clientFullName }}</b> Deleted Successfully.
    </NotificationBar>

    <ModalBoxUserForm
      v-model="isModalActive"
      v-model:update="isUpdate"
      :buttonLabel="
        isUpdate
          ? userStore.loading
            ? 'Updating...'
            : 'Update'
          : userStore.loading
          ? 'Submitting..'
          : 'Submit'
      "
      :title="isUpdate ? 'Update User' : 'Add New User'"
      has-cancel
      :childRef="formInput"
      @submit="handleSubmit"
    >
      <UserForm
        v-if="isUpdate"
        ref="formInput"
        :update="isUpdate"
        :username="clientUserName"
        :fullname="clientFullName"
        :id="clientId"
      />
      <userForm v-else :update="isUpdate" ref="formInput" />
    </ModalBoxUserForm>
    <SectionMain v-if="!items">
      <SectionTitleLineWithButton :icon="mdiTableOff" title="Datas Empty" />
      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
    <SectionMain v-else>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Users List" main>
        <BaseButton
          :icon="mdiPlusCircle"
          label="Add New"
          color="info"
          @click="isModalActive = true"
        />
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableUserList
          v-model:fromupdate="isModalActive"
          v-model:danger="isDangerActive"
          v-model:update="isUpdate"
          v-model:username="clientUserName"
          v-model:fullname="clientFullName"
          v-model:id="clientId"
          checkable
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
