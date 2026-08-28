<template>
  <FormField label="Username" :help="errors.fullName ? errors.fullName : ''">
    <FormControl
      v-model="form.fullName"
      type="text"
      autocomplete="username"
      :aria-invalid="Boolean(errors.fullName) || undefined"
      :disabled="isLoading"
      :icon="mdiAccount"
      placeholder="Jhon Doe"
    />
  </FormField>

  <FormField label="Nickname" :help="errors.username ? errors.username : ''">
    <FormControl
      v-model="form.username"
      type="text"
      autocomplete="username"
      :aria-invalid="Boolean(errors.username) || undefined"
      :disabled="isLoading"
      :icon="mdiMail"
      placeholder="Jhon_123"
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
import { mdiMail, mdiAccount, mdiFormTextboxPassword, mdiEye, mdiEyeLock } from "@mdi/js";
import FormControl from "@/components/FormControl.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/FormField.vue";

const showPassword = ref(false);
const showConfPassword = ref(false);
const isLoading = ref(false);
const userId = ref(null);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [] }),
  },
  id: {
    type: [String, Number, Boolean],
    default: null,
  },
  username: String,
  fullname: String,
  update: Boolean,
});

const emit = defineEmits(["update:data"]);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
const toggleConfPassword = () => {
  showConfPassword.value = !showConfPassword.value;
};

const form = reactive({
  fullName: "",
  username: "",
  password: "",
  confPassword: "",
  remember: false,
});

watchEffect(() => {
  if (props.update) {
    userId.value = props.id;
    form.fullName = props.fullname;
    form.username = props.username;
  } else {
    form.fullName = "";
    form.username = "";
  }
});

const errors = reactive({
  fullName: "",
  username: "",
  password: "",
  confPassword: "",
});

const validate = () => {
  errors.fullName = "";
  errors.username = "";
  errors.password = "";
  errors.confPassword = "";

  // PR BUAT VALIDASI NAME DAN USERNAME
  if (!form.fullName) {
    errors.fullName = "Name is required";
  }

  if (!form.username) {
    errors.username = "Username is required";
  }

  if (!props.update) {
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 3) {
      errors.password = "Use at least 8 characters.";
    } else if (form.password.length > 32) {
      errors.password = "Must be more less than 32 characters.";
    }

    if (!form.confPassword) {
      errors.confPassword = "Confirm Password is required";
    } else if (form.confPassword !== form.password) {
      errors.confPassword = "Password & Confirm Password do not Match";
    }
  }

  return !errors.fullName && !errors.username && !errors.password && !errors.confPassword;
};

defineExpose({ form, validate, userId });
</script>
