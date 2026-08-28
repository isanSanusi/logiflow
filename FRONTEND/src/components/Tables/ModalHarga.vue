<script setup>
import { useUiStore } from "@/stores/uiStore";
import { storeToRefs } from "pinia";
import { reactive, watch, toRefs } from "vue";
import { mdiContentSavePlus, mdiCloseBox } from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import FormControl from "@/components/FormControl.vue";

const uiStore = useUiStore();
const props = defineProps({
  visible: Boolean,
  data: Object,
  hargaPerKelompok: Object,
  open: Boolean,
});

const emit = defineEmits(["close", "saved"]);
const form = reactive({});
const { modalPriceOpen } = storeToRefs(uiStore);

function mergeKategori(data) {
  const result = {};
  for (const key in data) {
    if (key.startsWith("standard-") || key.startsWith("reject-")) {
      const kelompok = key.split("-").slice(2).join("-");
      const newKey = `standardReject-${kelompok}`;
      if (result[newKey] == null) {
        result[newKey] = data[key];
      }
    } else {
      result[key] = data[key];
    }
  }
  return result;
}

watch(
  () => props.hargaPerKelompok,
  (val) => {
    if (!val) return;
    const normalized = mergeKategori(val);
    Object.keys(form).forEach((k) => delete form[k]);
    Object.assign(form, normalized);
  },
  { immediate: true, deep: true }
);

function handleSave() {
  const newHarga = { ...form };
  emit("saved", newHarga);
}
</script>

<template>
  <CardBox is-modal>
    <h2 class="text-lg font-semibold mb-4">Input Harga /m³</h2>
    <div
      v-if="
        data?.items?.some((d) =>
          ['standard', 'reject'].includes(d.kategori.toLowerCase())
        )
      "
      class="mb-6"
    >
      <h3 class="text-sm font-medium mb-2">Standard & Reject (100 & 130)</h3>
      <div
        v-for="kelompok in ['9', '10-14', '15-55']"
        :key="kelompok"
        class="flex items-center mb-2 gap-3"
      >
        <div class="flex-1">{{ kelompok }}</div>
        <FormControl
          v-model.number="form[`standardReject-${kelompok}`]"
          type="text"
          placeholder="Rp"
        />
      </div>
    </div>

    <!-- kategori SUPER -->
    <div
      v-for="s in [
        { ukuran: '100', kelompok: ['20-24', '25-55'] },
        { ukuran: '130', kelompok: ['15-19', '20-24', '25-29', '30-55'] },
        { ukuran: '200', kelompok: ['25-29', '30-39', '40-49', '50-80'] },
        { ukuran: '260', kelompok: ['25-29', '30-39', '40-80'] },
      ]"
      :key="s.ukuran"
      class="mb-6"
    >
      <template
        v-if="
          data?.items?.some(
            (d) => d.kategori.toLowerCase() === 'super' && d.ukuran == s.ukuran
          )
        "
      >
        <h3 class="text-sm font-medium mb-2">Super {{ s.ukuran }}cm</h3>
        <div
          v-for="kelompok in s.kelompok"
          :key="kelompok"
          class="flex items-center mb-2 gap-3"
        >
          <div class="flex-1">{{ kelompok }}</div>
          <FormControl
            v-model.number="form[`super-${s.ukuran}-${kelompok}`]"
            type="text"
            placeholder="Rp"
          />
        </div>
      </template>
    </div>

    <!-- Bongkar -->
    <div class="flex items-center mb-6 gap-3">
      <div class="flex-1">Unloading Fee</div>
      <FormControl v-model.number="form.bongkar" type="text" placeholder="Rp" />
    </div>

    <!-- Buttons -->
    <BaseButtons>
      <BaseButton
        :icon="mdiContentSavePlus"
        label="Save"
        color="info"
        @click="handleSave"
      />
      <BaseButton
        :icon="mdiCloseBox"
        has-cancel
        outline
        label="Close"
        color="danger"
        @click="$emit('close')"
      />
    </BaseButtons>
  </CardBox>
</template>
