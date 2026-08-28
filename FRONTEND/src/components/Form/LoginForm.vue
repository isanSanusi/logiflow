<template>
  <div class="w-full max-w-sm">
    <!-- Card -->
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-white/10 shadow-sm rounded-2xl p-8"
    >
      <!-- Title & Subtitle -->
      <div class="mt-6 text-center">
        <h1 class="text-xl font-semibold tracking-tight">Sign in</h1>
        <p
          v-if="globalError"
          class="mt-2 inline-block px-6 py-3 text-red-500 font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out animate-pulse"
        >
          {{ globalError }}
        </p>
      </div>

      <form class="mt-3 space-y-5" @submit.prevent="onSubmit" novalidate>
        <FormField
          label="Email or Username"
          :help="errors.identity ? errors.identity : ''"
        >
          <FormControl
            v-model="form.identity"
            type="text"
            autocomplete="username"
            :aria-invalid="Boolean(errors.identity) || undefined"
            :disabled="isLoading"
            :icon="mdiAccount"
          />
        </FormField>

        <FormField
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

        <!-- Remember + Forgot -->
        <div class="flex items-center justify-between">
          <label class="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              v-model="form.remember"
              class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Remember me
          </label>
          <button
            type="button"
            class="text-sm text-blue-600 hover:underline"
            @click="$emit('forgot')"
          >
            Forgot password?
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full inline-flex items-center cursor-pointer justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-white font-medium shadow-sm transition"
          :disabled="isLoading"
        >
          <svg
            v-if="isLoading"
            class="animate-spin h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {{ isLoading ? "Signing in…" : "Sign in" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
  mdiEmail,
  mdiAccount,
  mdiFormTextboxPassword,
  mdiEye,
  mdiEyeLock,
} from "@mdi/js";
import FormControl from "@/components/FormControl.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/FormField.vue";
import BaseIcon from "@/components/BaseIcon.vue";

const emit = defineEmits(["submit", "forgot"]);

const props = defineProps({
  globalError: String,
  isLoading: Boolean,
});

const form = reactive({
  identity: "",
  password: "",
  remember: false,
});

const errors = reactive({
  identity: "",
  password: "",
});

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validate = () => {
  errors.identity = "";
  errors.password = "";

  if (!form.identity) {
    errors.identity = "Username or Email is required.";
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@].[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.identity
    );
    if (!isEmail && form.identity.length < 3) {
      errors.identity = "Enter a valid email or username.";
    }
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  return !errors.identity && !errors.password;
};

const onSubmit = async () => {
  if (!validate()) return;
  await emit("submit", { ...form });
};
</script>
