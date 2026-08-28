<script setup>
import { computed, ref } from "vue";
import { mdiClose } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";

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
    const id = props.childRef?.userId;
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
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      class="shadow-lg w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50"
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
      <form class="mt-6 space-y-5" @submit.prevent="onSubmit" novalidate>
        <div>
          <div class="space-y-3">
            <slot />
          </div>

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
      </form>
    </CardBox>
  </OverlayLayer>
</template>
