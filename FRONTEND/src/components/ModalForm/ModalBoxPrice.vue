<script setup>
import { computed, ref } from "vue";
import { mdiClose } from "@mdi/js";

import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  button: {
    type: String,
    default: "info",
  },
  buttonLabel: {
    type: String,
    default: "Done",
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  info: Boolean,
  danger: Boolean,
  update: Boolean,
  childRef: Object,
});

const emit = defineEmits([
  "update:modelValue",
  "update:update",
  "cancel",
  "confirm",
  "submit",
]);
const userFormRef = ref(null);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function cancel() {
  value.value = false;
  emit("cancel");
  emit("update:update", false);
}

const onSubmit = async (e) => {
  e.preventDefault();
  if (!props.childRef?.validate()) return;
  try {
    const id = props.childRef?.companyId;
    const payload = props.childRef?.form;
    if (props.update) {
      if (!payload.password) delete payload.password;
      if (!payload.confPassword) delete payload.confPassword;
    }
    emit("submit", id, payload);
  } finally {
    value.value = false;
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && value.value) {
    cancel();
  }
});
</script>

<template>
  <!-- w-11/12 md:w-3/5 lg:w-1/5 xl:w-4/12 -->
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      class="shadow-lg w-11/12 md:w-8/12 lg:w-9/12 xl:w-5/12 z-50 overflow-y-auto"
      is-modal
    >
      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>
      <div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>

        <div class="pt-5">
          <BaseButtons>
            <BaseButton type="submit" :label="buttonLabel" :color="button" />
            <BaseButton
              v-if="hasCancel"
              label="Cancel"
              color="danger"
              outline
              @click="cancel"
            />
          </BaseButtons>
        </div>
      </div>
    </CardBox>
  </OverlayLayer>
</template>
