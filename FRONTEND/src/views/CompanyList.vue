<script setup>
import { mdiTableBorder, mdiPlusCircle, mdiTableOff, mdiMonitorCellphone } from "@mdi/js";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import ModalBoxCompanyForm from "@/components/ModalForm/ModalBoxCompanyForm.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import TableCompanyList from "@/components/Tables/TableCompanyList.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CompanyForm from "@/components/Form/CompanyForm.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import CardBox from "@/components/CardBox.vue";

import { useCompanyStore } from "@/stores/companyStore";
import { useAuthStore } from "@/stores/authStore.js";
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";

const companyStore = useCompanyStore();
const authStore = useAuthStore();

const items = computed(() => companyStore.companies);

const formInput = ref(null);
const clientDatas = ref(null);

const isInfoUpdateActive = ref(false);
const isInfoCreateActive = ref(false);
const isDangerActive = ref(false);
const isModalActive = ref(false);
const isUpdate = ref(false);

const handleSubmit = async (id, payload) => {
  if (isUpdate.value === true) {
    await companyStore.updateCompany(id, payload);
    isInfoUpdateActive.value = true;
    setTimeout(() => {
      isInfoUpdateActive.value = false;
    }, 2500);
  } else if (isUpdate.value === false) {
    await companyStore.createCompany(payload);
    isInfoCreateActive.value = true;
    setTimeout(() => {
      isInfoCreateActive.value = false;
    }, 2500);
  }
  await companyStore.fetchCompanies();
};

onMounted(() => {
  authStore.initializeAuth();
  companyStore.fetchCompanies();
});
</script>

<template>
  <LayoutAuthenticated>
    <NotificationBar v-if="isInfoUpdateActive" color="info" :icon="mdiMonitorCellphone">
      <b>{{ clientDatas.name }}</b> Updated successfully.
    </NotificationBar>
    <NotificationBar v-if="isInfoCreateActive" color="info" :icon="mdiMonitorCellphone">
      <b>New User was Created.</b>
    </NotificationBar>
    <NotificationBar v-if="isDangerActive" color="danger" :icon="mdiTableOff">
      <b>{{ clientDatas.name }}</b> Deleted Successfully.
    </NotificationBar>

    <ModalBoxCompanyForm
      v-model="isModalActive"
      v-model:update="isUpdate"
      :buttonLabel="
        isUpdate
          ? companyStore.loading
            ? 'Updating...'
            : 'Update'
          : companyStore.loading
          ? 'Submitting..'
          : 'Submit'
      "
      :title="isUpdate ? 'Update Company' : 'Add New Company'"
      has-cancel
      :childRef="formInput"
      @submit="handleSubmit"
    >
      <CompanyForm
        v-if="isUpdate"
        ref="formInput"
        :update="isUpdate"
        :data="clientDatas"
      />
      <CompanyForm v-else :update="isUpdate" ref="formInput" />
    </ModalBoxCompanyForm>
    <SectionMain v-if="!items">
      <SectionTitleLineWithButton :icon="mdiTableOff" title="Datas Empty" />
      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
    <SectionMain v-else>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Company List" main>
        <BaseButton
          :icon="mdiPlusCircle"
          label="Add New"
          color="info"
          @click="isModalActive = true"
        />
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableCompanyList
          v-model:fromupdate="isModalActive"
          v-model:update="isUpdate"
          v-model:danger="isDangerActive"
          v-model:datas="clientDatas"
          checkable
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
