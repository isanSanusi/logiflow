<template>
  <div>
    <div class="grid grid-cols-1 gap-3 lg:grid-cols-4 mb-6">
      <CardBoxWidget
        trend="total logs"
        trend-type="up"
        color="text-emerald-500"
        :icon="mdiChartTimelineVariant"
        :number="totalLogs"
        label="Logs"
      />
      <CardBoxWidget
        trend="total volume"
        trend-type="down"
        color="text-red-500"
        :icon="mdiChartPie"
        :number="totalVol"
        suffix=".00m³"
        label="Volume"
      />
      <CardBoxWidget
        trend="total amount"
        trend-type=""
        color="text-blue-500"
        :icon="mdiCartOutline"
        :number="totalAmount"
        label="Amount IDR"
      />
      <CardBoxWidget
        trend="Overflow"
        trend-type="alert"
        color="text-red-500"
        :icon="mdiChartTimelineVariant"
        :number="256"
        suffix="%"
        label="Performance"
      />
    </div>

    <div
      v-if="productStore.loading"
      class="flex justity-center w-full min-h-[76vh] items-center text-gray-500"
    >
      <svg class="animate-spin h-20 w-20 mr-2" viewBox="0 0 24 24" fill="none">
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
        /></svg
      >Loading...
    </div>
    <CardBox v-else>
      <div class="w-full shadow-md rounded-lg p-4">
        <div class="flex justify-between items-center">
          <div class="mb-4">
            <h3 class="text-lg font-semibold">
              Buyer : <span class="dark:text-slate-200">{{ data.pemesan || "-" }}</span>
            </h3>
            <p class="text-sm dark:text-gray-100">
              Sender: <span class="font-medium">{{ data.oleh || "-" }}</span>
            </p>
            <p class="text-sm dark:text-gray-100">
              {{ formatTanggal(data?.waktu) }} - {{ formatJam(data?.waktu) }}
            </p>
          </div>
          <BaseButtons>
            <BaseButton
              :icon="mdiCurrencyBtc"
              label="Set Pricing"
              color="success"
              @click="$emit('bukaModalHarga')"
            />
            <BaseButton
              :icon="mdiPrinter"
              label="Print Invoice"
              color="info"
              @click="$emit('cetakInvoice', i)"
            />
          </BaseButtons>
        </div>

        <!-- Table per kategori -->
        <div v-if="data?.items?.length" class="space-y-6">
          <div class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th class="px-3 py-2 text-center">Category</th>
                  <th class="px-3 py-2 text-center">Size</th>
                  <th class="px-3 py-2 text-center">Diameter</th>
                  <th class="px-3 py-2 text-center">Qty(logs)</th>
                  <th class="px-3 py-2 text-center">Volume (m³)</th>
                  <th class="px-3 py-2 text-center">Price /m³</th>
                  <th class="px-3 py-2 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in invoice.rows" :key="i" class="transition-colors">
                  <td class="px-3 py-2 text-center">{{ row.kategori }}</td>
                  <td class="px-3 py-2 text-center">{{ row.ukuran }}</td>
                  <td class="px-3 py-2 text-center">{{ row.diameter }}</td>
                  <td class="px-3 py-2 text-center">{{ row.jumlah }}</td>
                  <td class="px-3 py-2 text-center">{{ row.volume.toFixed(2) }}</td>
                  <td class="px-3 py-2">Rp {{ row.harga.toLocaleString() }}/m³</td>
                  <td class="px-3 py-2">Rp {{ row.subtotal.toLocaleString() }}</td>
                </tr>
              </tbody>
              <tfoot class="">
                <tr class="font-semibold">
                  <td class="px-2 py-2" colspan="7"></td>
                </tr>
                <tr class="font-semibold">
                  <td class="px-2 py-2" colspan="5"></td>

                  <td class="px-2 py-2 font-semibold uppercase">Sub Total</td>
                  <td class="px-2 py-2">Rp {{ invoice.totalHarga.toLocaleString() }}</td>
                </tr>
                <tr>
                  <td colspan="5"></td>

                  <td class="px-2 py-2 font-semibold uppercase">Unloading Fee</td>
                  <td class="px-2 py-2 font-semibold">
                    Rp {{ invoice.bongkar.toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td colspan="5"></td>

                  <td class="px-2 py-2 font-semibold uppercase">Grand Total</td>
                  <td class="px-2 py-2 font-semibold">
                    Rp {{ invoice.grandTotal.toLocaleString() }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div v-else class="text-gray-400 italic">Belum ada data kategori</div>
      </div>
    </CardBox>
  </div>
</template>

<script setup>
import { useProductStore } from "@/stores/productStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CardBox from "@/components/CardBox.vue";
import {
  mdiCurrencyBtc,
  mdiPrinter,
  mdiCubeOutline,
  mdiChartTimelineVariant,
  mdiCartOutline,
  mdiChartPie,
} from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";

const router = useRouter;
const productStore = useProductStore();

const hargaPerKelompok = ref({});

const totalLogs = ref(null);
const totalVol = ref(null);
const totalAmount = ref(null);

const props = defineProps({
  data: Object,
  hargaPerKelompok: Object,
});

// ====================================================================
const invoice = computed(() => {
  if (!props.data) return null;

  let totalVolume = 0;
  let totalJumlah = 0;
  let totalHarga = 0;
  let totalPerm3 = 0;
  let bongkar = props.hargaPerKelompok?.bongkar || 0;

  const rows = props.data.items.map((item) => {
    const kategoriKey = item.kategori.toLowerCase();
    const kelompok = cariKelompok(kategoriKey, item.ukuran, item.diameter);
    const keyHarga = `${kategoriKey}-${item.ukuran}-${kelompok}`;

    const harga = props.hargaPerKelompok[keyHarga] || 0;
    const volRow = item.volume * item.jumlah;
    const hargaRow = volRow * harga;

    totalJumlah += item.jumlah;
    totalVolume += volRow;
    totalHarga += hargaRow;
    totalPerm3 = harga * totalJumlah;

    totalLogs.value = totalJumlah;
    totalVol.value = totalVolume;

    return {
      deskripsi: `${item.kategori} ${item.ukuran} ${item.diameter}cm`,
      kategori: item.kategori,
      ukuran: item.ukuran,
      diameter: item.diameter,
      jumlah: item.jumlah,
      volume: volRow,
      harga,
      subtotal: hargaRow,
    };
  });

  const finalPrice = totalHarga - bongkar;
  const grandTotal = roundTotal(finalPrice);
  totalAmount.value = grandTotal;

  return {
    buyer: props.data.pemesan,
    shiper: props.data.oleh,
    tanggal: new Date().toISOString().slice(0, 10),
    rows,
    totalJumlah,
    totalVolume,
    totalPerm3,
    totalHarga,
    bongkar,
    grandTotal,
  };
});

function cariKelompok(kategori, ukuran, diameter) {
  if (kategori === "standard" || kategori === "reject") {
    if (diameter <= 9) return "9";
    if (diameter <= 14) return "10-14";
    return "15-55";
  }
  if (kategori === "super") {
    if (ukuran == "100") {
      if (diameter <= 24) return "20-24";
      return "25-55";
    }
    if (ukuran == "130") {
      if (diameter <= 19) return "15-19";
      if (diameter <= 24) return "20-24";
      if (diameter <= 29) return "25-29";
      return "30-55";
    }
    if (ukuran == "200") {
      if (diameter <= 29) return "25-29";
      if (diameter <= 39) return "30-39";
      if (diameter <= 49) return "40-49";
      return "50-80";
    }
    if (ukuran == "260") {
      if (diameter <= 29) return "25-29";
      if (diameter <= 39) return "30-39";
      return "40-80";
    }
  }
  return "";
}

function roundTotal(num) {
  if (num === 0) return 0;
  if (num < 1000) return 0; // Jika kurang dari 1000, dibulatkan ke 0
  return Math.floor(num / 1000) * 1000;
}
// ====================================================================

// format tanggal
function formatTanggal(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleDateString();
}

// format jam
function formatJam(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleTimeString().slice(0, 5);
}
</script>
