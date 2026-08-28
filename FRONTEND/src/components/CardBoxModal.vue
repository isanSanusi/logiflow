<script setup>
import { computed } from "vue";
import { mdiClose } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

const props = defineProps({
  datas: {
    type: Object,
    default: null,
  },
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
    default: "Confirm",
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  clientId: [String, Number],
  hasCancel: Boolean,
  send: Boolean,
  minus: Boolean,
  isData: Boolean,
});

const emit = defineEmits([
  "update:modelValue",
  "update:isDelete",
  "update:send",
  "update:minus",
  "update:isData",
  "cancel",
  "confirm",
  "delete",
  "send",
  "delminus",
  "saved",
]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const onConfirm = async (mode) => {
  const id = props.clientId;
  const datas = props.datas;
  if (mode === "confirm") {
    if (props.send) {
      emit("send", datas);
    } else if (props.minus) {
      emit("delminus");
    } else if (props.isData) {
      emit("saved");
    } else {
      emit("delete", id || datas);
    }
  }
  value.value = false;
  emit("update:send", false);
  emit("update:minus", false);
  emit("update:isData", false);
  emit(mode);
};

const confirm = () => onConfirm("confirm");

const cancel = () => onConfirm("cancel");

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

      <div class="space-y-3">
        <slot />
      </div>

      <template #footer>
        <BaseButtons>
          <BaseButton :label="buttonLabel" :color="button" @click="confirm" />
          <BaseButton
            v-if="hasCancel"
            label="Cancel"
            :color="button"
            outline
            @click="cancel"
          />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
