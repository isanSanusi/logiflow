<script setup>
import {
  mdiMemory,
  mdiListBox,
  mdiAutoMode,
  mdiLockReset,
  mdiMonitorCellphone,
} from "@mdi/js";
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useMainStore } from "@/stores/main.js";
import { storeToRefs } from "pinia";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";

const authStore = useAuthStore();
const mainStore = useMainStore();

const user = authStore.user.name;

const subkategoriTerpilih = ref(null);
const isConfirmModal = ref(false);
const kategoriTerpilih = ref("");
const isEditMode = ref(false);
const officerName = ref(user);
const inputFocus = ref(null);
const page = ref("kategori");
const isNotify = ref(false);
const noDatas = ref(false);
const isDatas = ref(false);
const dataTercatat = [];
const buyer = ref("");

const jumlahPerKategori = reactive({
  SUPER: { 100: {}, 130: {}, 200: {}, 260: {} },
  STANDARD: { 100: {}, 130: {} },
  REJECT: { 100: {}, 130: {} },
});

const subkategoriList = computed(() => {
  if (kategoriTerpilih.value === "SUPER") return [100, 130, 200, 260];
  if (["STANDARD", "REJECT"].includes(kategoriTerpilih.value)) return [100, 130];
  return [];
});

const presetList = computed(() => {
  if (!kategoriTerpilih.value || !subkategoriTerpilih.value) return [];
  const arr = [];
  let min = 9,
    max = 55;
  if (kategoriTerpilih.value === "SUPER") {
    if (subkategoriTerpilih.value === 100) min = 20;
    if (subkategoriTerpilih.value === 130) min = 15;
  }
  if ([200, 260].includes(subkategoriTerpilih.value)) {
    min = 25;
    max = 80;
  }
  const jumlahMap = jumlahPerKategori[kategoriTerpilih.value][subkategoriTerpilih.value];
  for (let d = min; d <= max; d++) {
    if (!jumlahMap[d]) jumlahMap[d] = 0;
    arr.push({
      diameter: d,
      volume: hitungVolume(subkategoriTerpilih.value, d),
      jumlah: jumlahMap[d],
    });
  }
  return arr;
});

const totalKayuSubkategori = computed(() => {
  if (!kategoriTerpilih.value || !subkategoriTerpilih.value) return 0;
  return Object.values(
    jumlahPerKategori[kategoriTerpilih.value][subkategoriTerpilih.value]
  ).reduce((s, v) => s + v, 0);
});

const totalKayuKategori = computed(() => {
  if (!kategoriTerpilih.value) return 0;
  let total = 0;
  for (const sub in jumlahPerKategori[kategoriTerpilih.value]) {
    total += Object.values(jumlahPerKategori[kategoriTerpilih.value][sub]).reduce(
      (s, v) => s + v,
      0
    );
  }
  return total;
});

function hitungVolume(panjang, diameter) {
  const formula = 0.785;
  const volumeCm3 = panjang * diameter * diameter * formula;
  const volDecimal = volumeCm3 / 1000;
  const dec = Math.floor(volDecimal);
  return volDecimal - dec >= 0.9 ? dec + 1 : dec;
}

function pilihKategori(kat) {
  kategoriTerpilih.value = kat;
  page.value = "input";
}

function pilihUkuran(sub) {
  subkategoriTerpilih.value = sub;
}

function tambahKayu(d) {
  jumlahPerKategori[kategoriTerpilih.value][subkategoriTerpilih.value][d.diameter]++;

  const existing = dataTercatat.find(
    (x) =>
      x.kategori === kategoriTerpilih.value &&
      x.ukuran === subkategoriTerpilih.value &&
      x.diameter === d.diameter
  );

  if (existing) {
    existing.jumlah++;
  } else
    dataTercatat.push({
      kategori: kategoriTerpilih.value,
      ukuran: subkategoriTerpilih.value,
      diameter: d.diameter,
      volume: d.volume,
      jumlah: 1,
    });
}

function kurangiKayu(d) {
  jumlahPerKategori[kategoriTerpilih.value][subkategoriTerpilih.value][d.diameter]--;

  const existing = dataTercatat.find(
    (x) =>
      x.kategori === kategoriTerpilih.value &&
      x.ukuran === subkategoriTerpilih.value &&
      x.diameter === d.diameter
  );

  if (existing) {
    existing.jumlah--;
  } else
    dataTercatat.push({
      kategori: kategoriTerpilih.value,
      ukuran: subkategoriTerpilih.value,
      diameter: d.diameter,
      volume: d.volume,
      jumlah: 1,
    });
}

function generateId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return "id_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

const openModalConfirm = () => {
  if (dataTercatat.length === 0) {
    noDatas.value = true;
  } else if (dataTercatat.length >= 1) {
    noDatas.value = false;
    isDatas.value = true;
  }
  isConfirmModal.value = true;
};

async function simpanData() {
  let savedData = JSON.parse(localStorage.getItem("savedData")) || [];
  const dataInput = {
    id: generateId(),
    name: officerName.value,
    customer: buyer.value || "anonim",
    Date: new Date().toISOString(),
    data: [...dataTercatat],
  };
  savedData.push(dataInput);
  localStorage.setItem("savedData", JSON.stringify(savedData));

  resetJumlah();
  onBack();
  buyer.value = "";
  isNotify.value = true;
  setTimeout(() => {
    isNotify.value = false;
  }, 3000);
}

function resetJumlah() {
  Object.keys(jumlahPerKategori).forEach((k) => {
    Object.keys(jumlahPerKategori[k]).forEach((s) => {
      jumlahPerKategori[k][s] = {};
    });
  });
}

function resetData() {
  if (confirm("Reset semua data?")) {
    dataTercatat.splice(0);
    resetJumlah();
    onBack();
  }
}

function onBack() {
  page.value = "kategori";
  subkategoriTerpilih.value = null;
}

function onEdit() {
  isEditMode.value = !isEditMode.value;
}

onMounted(() => {
  inputFocus.value.focus();
});
</script>
<template>
  <LayoutAuthenticated>
    <NotificationBar v-if="isNotify" color="info" :icon="mdiMonitorCellphone">
      Saved successfully.
    </NotificationBar>
    <CardBoxModal
      v-model="isConfirmModal"
      v-model:isData="isDatas"
      :title="noDatas ? 'No datas saved!' : 'Save Data?'"
      :button="noDatas ? 'danger' : 'info'"
      :has-cancel="noDatas ? false : true"
      @saved="simpanData()"
    >
      <span v-if="noDatas">Try input some data.</span>
      <span v-else>
        <p>You can modify this data on <b>Review page</b></p>
        <p>Before sent to admin.</p>
      </span>
    </CardBoxModal>
    <sectionMain>
      <!-- Halaman Kategori -->
      <div v-if="page === 'kategori'" class="space-y-6">
        <div
          class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h4 class="text-lg font-semibold">Hi, {{ user }}</h4>
          </div>
          <div class="w-full md:w-64">
            <label class="block text-sm mb-1">Enter Customer Name</label>
            <input
              ref="inputFocus"
              v-model.trim="buyer"
              type="text"
              placeholder="Name your customer"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
            />
          </div>
        </div>

        <h2 class="text-center text-xl font-semibold">Choose Category</h2>

        <div class="flex flex-wrap justify-center gap-4">
          <button
            v-for="cat in ['SUPER', 'STANDARD', 'REJECT']"
            :key="cat"
            class="px-6 py-3 rounded-lg cursor-pointer font-medium text-white shadow-md transform hover:-translate-y-0.5 transition"
            :class="{
              'bg-blue-600 hover:bg-blue-700': cat === 'SUPER',
              'bg-gray-600 hover:bg-gray-700': cat === 'STANDARD',
              'bg-red-600 hover:bg-red-700': cat === 'REJECT',
            }"
            @click="pilihKategori(cat)"
          >
            {{ cat }}
          </button>
          <router-link
            to="/"
            class="px-6 py-3 rounded-lg font-medium text-white shadow-md bg-green-600 hover:bg-green-700"
          >
            Dashboard
          </router-link>
        </div>

        <p class="text-center text-gray-500 text-sm mt-6">
          📘 Timber Calc<br />By Meong Coding &copy;2025
        </p>
      </div>

      <!-- Halaman Input -->
      <div v-else-if="page === 'input'" class="space-y-4">
        <CardBox>
          <div class="flex flex-wrap items-center justify-between">
            <span class="px-3 py-1 bg-blue-500 text-lg text-white rounded-sm">
              {{ kategoriTerpilih }}
            </span>

            <div class="flex flex-col justify-center items-center">
              <span class="text-slate-500">Size {{ subkategoriTerpilih }}: </span>
              <span class="text-xl text-bold">{{ totalKayuSubkategori }}</span>
            </div>

            <div class="flex flex-col justify-center items-center">
              <span class="text-slate-500"> Logs : </span>
              <span class="text-xl text-bold">{{ totalKayuKategori }}</span>
            </div>
          </div>
        </CardBox>

        <!-- Subkategori Buttons -->
        <div class="grid grid-cols-4 text-xs md:text-base border-y-2">
          <button
            v-for="sub in subkategoriList"
            :key="sub"
            class="px-4 py-3 rounded-none cursor-pointer font-medium"
            :class="sub === subkategoriTerpilih ? 'bg-blue-500' : ''"
            @click="pilihUkuran(sub)"
          >
            {{ sub }}cm
          </button>
        </div>

        <!-- Preset Buttons -->
        <div
          class="grid grid-cols-5 grid-center sm:grid-cols-6 md:gap-2 md:grid-cols-7 lg:grid-cols-8 gap-1"
        >
          <button
            v-for="d in presetList"
            :key="d.diameter"
            class="bg-slate-300 shadow-md"
            :disabled="isEditMode && d.jumlah === 0"
            :class="
              isEditMode && d.jumlah === 0 ? 'cursor-not-allowed' : 'cursor-pointer'
            "
            @click="isEditMode ? kurangiKayu(d) : tambahKayu(d)"
          >
            <div class="flex justify-between items-center w-full text-xs">
              <div class="flex flex-col flex-1 text-slate-800">
                <div class="text-md pb-1">{{ d.diameter }}<sup>cm</sup></div>
                <span class="whitespace-nowrap"
                  >{{ d.volume }} <sup class="text-slate-700">m³</sup></span
                >
              </div>
              <span
                class="flex-1 text-slate-800 text-lg font-bold py-2"
                :class="isEditMode ? 'bg-red-600 hover:bg-red-300' : ''"
                >{{ d.jumlah }}</span
              >
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="w-full flex justify-center items-center">
          <div class="grid grid-cols-4 text-xs md:text-base gap-3 py-2">
            <BaseButton
              label="Save"
              :icon="mdiMemory"
              color="success"
              @click="openModalConfirm"
            />
            <BaseButton
              label="Reset"
              :icon="mdiLockReset"
              color="info"
              @click="resetData"
            />
            <BaseButton
              label="Mode"
              :icon="mdiAutoMode"
              :color="isEditMode ? 'danger' : 'success'"
              @click="onEdit"
            />
            <BaseButton
              label="Category"
              :icon="mdiListBox"
              color="info"
              @click="onBack"
            />
          </div>
        </div>
      </div>
    </sectionMain>
  </LayoutAuthenticated>
</template>
