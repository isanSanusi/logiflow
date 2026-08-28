<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiZipBox" title="Detail Order" />

      <CardTransaksi
        v-if="selectedItem"
        :data="selectedItem"
        :hargaPerKelompok="hargaPerKelompok"
        @bukaModalHarga="handleModal"
        @cetakInvoice="cetakInvoice"
        @tandaiLunas="tandaiLunas"
      />

      <div
        class="flex justify-center items-center px-4 fixed inset-0 z-50 bg-black/60 transform transition-all duration-300 ease-in-out"
        :class="
          modalPriceOpen ? 'translate-y-0 opacity-full' : 'opacity-0 -translate-y-full'
        "
        @click.self="uiStore.toggleModalPrice()"
      >
        <div
          class="w-full max-w-md rounded-lg shadow-xl p-6 overflow-y-auto max-h-[80vh] transform transition-transform duration-500 ease-in-out"
          :class="modalPriceOpen ? '-translate-y-0' : '-translate-y-full'"
        >
          <ModalHarga
            @close="uiStore.toggleModalPrice()"
            :data="selectedItem"
            :hargaPerKelompok="hargaPerKelompok"
            @saved="handleHargaSaved"
          />
        </div>
      </div>

      <!-- Invoice -->

      <div
        class="flex justify-center items-center px-4 fixed inset-0 z-50 bg-black/60 transform transition-all duration-300 ease-in-out"
        :class="modalInvoiceOpen ? 'translate-y-0' : 'translate-y-full'"
        @click.self="uiStore.toggleModalInvoice()"
      >
        <div
          class="w-full rounded-lg shadow-xl p-6 overflow-y-auto max-h-[80vh] transform transition-all duration-300 ease-in-out"
        >
          <InvoicePreview
            :data="selectedItem"
            :hargaPerKelompok="hargaPerKelompok"
            :visible="modalInvoiceOpen"
            @close="uiStore.toggleModalInvoice()"
          />
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import CardTransaksi from "./TabelTransaction.vue";
import InvoicePreview from "./InvoicePreview.vue";
import ModalHarga from "./ModalHarga.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

import ModalBoxPrice from "@/components/ModalForm/ModalBoxPrice.vue";

import { mdiZipBox } from "@mdi/js";
import { useProductStore } from "@/stores/productStore";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useUiStore } from "@/stores/uiStore";
import { storeToRefs } from "pinia";

const productStore = useProductStore();
const uiStore = useUiStore();
const router = useRouter();
const route = useRoute();

const selectedItem = computed(() => {
  return productStore.product;
});

const { modalPriceOpen, modalInvoiceOpen } = storeToRefs(uiStore);

let hargaPerKelompoknya = {};
const hargaPerKelompok = ref({});
const selectedData = ref(null);

function handleModal() {
  uiStore.toggleModalPrice();
}

function handleGetPrice() {
  const savedHarga = JSON.parse(localStorage.getItem("kelompokHarga") || "{}");
  hargaPerKelompok.value = savedHarga;
}

const handleNullDatas = async () => {
  const id = route.query.id;
  await productStore.fetchProductId(id);
};

const handleHargaSaved = async (newHarga) => {
  Object.entries(newHarga).forEach(([key, val]) => {
    const harga = parseFloat(val) || 0;

    if (key.startsWith("standardReject-")) {
      const range = key.replace("standardReject-", "");
      ["standard", "reject"].forEach((kat) => {
        ["100", "130"].forEach((ukuran) => {
          hargaPerKelompoknya[`${kat}-${ukuran}-${range}`] = harga;
        });
      });
    } else {
      hargaPerKelompoknya[key] = harga;
    }
  });
  Object.keys(hargaPerKelompoknya).forEach((k) => {
    if (k.startsWith("standardReject-")) delete hargaPerKelompoknya[k];
  });

  localStorage.setItem("kelompokHarga", JSON.stringify(hargaPerKelompoknya));
  handleGetPrice();
  uiStore.toggleModalPrice();
};

function tandaiLunas() {
  alert("Tandai lunas: " + item.pemesan);
}

function cetakInvoice(i) {
  selectedData.value = selectedItem.value[i];
  uiStore.toggleModalInvoice();
}

onMounted(() => {
  handleNullDatas();
  handleGetPrice();
});
</script>
