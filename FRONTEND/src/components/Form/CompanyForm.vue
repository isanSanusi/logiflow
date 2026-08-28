<template>
  <FormField label="Owner Name" :help="errors.ownerName ? errors.ownerName : ''">
    <FormControl
      v-model="form.ownerName"
      type="text"
      autocomplete="username"
      :aria-invalid="Boolean(errors.ownerName) || undefined"
      :disabled="isLoading"
      :icon="mdiAccount"
      placeholder="Jhon Doe"
    />
  </FormField>

  <FormField label="Company Name" :help="errors.companyName ? errors.companyName : ''">
    <FormControl
      v-model="form.companyName"
      type="text"
      autocomplete="company-name"
      :aria-invalid="Boolean(errors.companyName) || undefined"
      :disabled="isLoading"
      :icon="mdiMail"
      placeholder="E-Corp"
    />
  </FormField>

  <FormField label="Email" :help="errors.email ? errors.email : ''">
    <FormControl
      v-model="form.email"
      type="text"
      autocomplete="email"
      :aria-invalid="Boolean(errors.email) || undefined"
      :disabled="isLoading"
      :icon="mdiEmail"
      placeholder="example@gmail.com"
    />
  </FormField>

  <FormField label="Phone" :help="errors.phone ? errors.phone : ''">
    <FormControl
      v-model="form.phone"
      type="text"
      autocomplete="phone"
      :aria-invalid="Boolean(errors.phone) || undefined"
      :disabled="isLoading"
      :icon="mdiPhone"
      placeholder="022345678"
    />
  </FormField>

  <FormField label="Address" :help="errors.address ? errors.address : ''">
    <FormControl
      v-model="form.address"
      type="text"
      autocomplete="address"
      :aria-invalid="Boolean(errors.address) || undefined"
      :disabled="isLoading"
      :icon="mdiOfficeBuilding"
      placeholder="St.Cihampelas No.666"
    />
  </FormField>

  <FormField
    v-if="!update"
    label="Password"
    :help="errors.password ? errors.password : ''"
    help-button
    v-model:show="showPassword"
    @show="togglePassword"
  >
    <FormControl
      v-model="form.password"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="current-password"
      :aria-invalid="Boolean(errors.password) || undefined"
      :disabled="isLoading"
      :icon="mdiFormTextboxPassword"
    />
  </FormField>

  <FormField
    v-if="!update"
    label="Confirm Password"
    :help="errors.confPassword ? errors.confPassword : ''"
    help-button
    v-model:show="showConfPassword"
    @show="toggleConfPassword"
  >
    <FormControl
      v-model="form.confPassword"
      :type="showConfPassword ? 'text' : 'password'"
      autocomplete="current-password"
      :aria-invalid="Boolean(errors.confPassword) || undefined"
      :disabled="isLoading"
      :icon="mdiFormTextboxPassword"
    />
  </FormField>
</template>

<script setup>
import { reactive, ref, watchEffect } from "vue";
import {
  mdiAccount,
  mdiEmail,
  mdiPhone,
  mdiOfficeBuilding,
  mdiMail,
  mdiFormTextboxPassword,
  mdiEye,
  mdiEyeLock,
} from "@mdi/js";
import FormControl from "@/components/FormControl.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/FormField.vue";

const showPassword = ref(false);
const showConfPassword = ref(false);
const isLoading = ref(false);
const companyId = ref(null);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [] }),
  },
  update: Boolean,
});

const form = reactive({
  companyName: "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confPassword: "",
  remember: false,
});

watchEffect(() => {
  if (props.data && props.update) {
    console.log(props.data);
    companyId.value = props.data.id;
    form.companyName = props.data.name || "";
    form.ownerName = props.data.ownerName || "";
    form.email = props.data.email || "";
    form.phone = props.data.phone || "";
    form.address = props.data.address || "";
  } else {
    form.companyName = "";
    form.ownerName = "";
    form.email = "";
    form.phone = "";
    form.address = "";
  }
});

const errors = reactive({
  companyName: "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confPassword: "",
});

/** Methods */
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
const toggleConfPassword = () => {
  showConfPassword.value = !showConfPassword.value;
};

const validate = () => {
  errors.companyName = "";
  errors.ownerName = "";
  errors.email = "";
  errors.phone = "";
  errors.address = "";
  errors.password = "";
  errors.confPassword = "";

  if (!form.companyName) errors.companyName = "Company Name is required";
  if (!form.ownerName) errors.ownerName = "Name is required";
  if (!form.address) errors.address = "Address is required";

  if (!form.phone) {
    errors.phone = "Phone number is required";
  } else if (isNaN(form.phone)) {
    errors.phone = "Phone required a Number";
  }

  if (!form.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!props.update) {
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 8) {
      errors.password = "Use at least 8 characters.";
    } else if (form.password.length > 32) {
      errors.password = "Must be less than 32 characters.";
    }

    if (!form.confPassword) {
      errors.confPassword = "Confirm Password is required";
    } else if (form.confPassword !== form.password) {
      errors.confPassword = "Password & Confirm Password do not Match";
    }
  }

  return (
    !errors.companyName &&
    !errors.ownerName &&
    !errors.email &&
    !errors.address &&
    !errors.phone &&
    !errors.password &&
    !errors.confPassword
  );
};

defineExpose({ form, validate, companyId });
</script>
