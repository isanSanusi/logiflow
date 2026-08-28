<script setup>
import { computed, useSlots } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiEye, mdiEyeOff } from "@mdi/js";

defineProps({
  label: {
    type: String,
    default: null,
  },
  labelFor: {
    type: String,
    default: null,
  },
  help: {
    type: String,
    default: null,
  },
  helpButton: Boolean,
  show: Boolean,
});

const slots = useSlots();

const emit = defineEmits(["show"]);

const emitToggle = () => {
  emit("show");
};

const wrapperClass = computed(() => {
  const base = [];
  const slotsLength = slots.default().length;

  if (slotsLength > 1) {
    base.push("grid grid-cols-1 gap-3");
  }

  if (slotsLength === 2) {
    base.push("md:grid-cols-2");
  }

  return base;
});
</script>

<template>
  <div class="mb-6 last:mb-0">
    <div class="flex justify-between items-center pb-2">
      <label v-if="label" :for="labelFor" class="block font-bold mb-2">{{ label }}</label>
      <BaseButton
        icon-size="27"
        v-if="helpButton"
        :icon="show ? mdiEye : mdiEyeOff"
        @click="emitToggle"
        color="none"
        class="border-none focus:border-none focus:outline-hidden hover:text-blue-400"
        :class="show ? 'text-blue-400' : ''"
      />
    </div>

    <div :class="wrapperClass">
      <slot />
    </div>
    <div v-if="help" class="text-xs text-red-600 dark:text-red-600 mt-1">
      {{ help }}
    </div>
  </div>
</template>
