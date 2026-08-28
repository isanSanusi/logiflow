<script setup>
import { computed } from "vue";
import { useCSV } from "@/stores/ExportCsv.js";
import { useAuthStore } from "@/stores/authStore";
import { mdiClose, mdiPrinter, mdiDownload } from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";

const { exportToCSV } = useCSV();

const props = defineProps({
  data: Object,
  hargaPerKelompok: Object,
  visible: Boolean,
});

const authStore = useAuthStore();
const emit = defineEmits(["close"]);

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

    return {
      deskripsi: `${item.kategori} ${item.ukuran} ${item.diameter}cm`,
      jumlah: item.jumlah,
      volume: volRow,
      harga,
      subtotal: hargaRow,
    };
  });

  const finalPrice = totalHarga - bongkar;
  const grandTotal = roundTotal(finalPrice);

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

function downloadCSV() {
  if (!invoice.value) return;

  const dataArray = [
    ["Category Size-Dia", "Qty (Logs)", "Volume (m³)", "Price", "Amount"],
    ...invoice.value.rows.map((row) => [
      row.deskripsi,
      row.jumlah,
      row.volume.toFixed(2),
      row.harga,
      row.subtotal,
    ]),
    [],
    ["TOTAL QUANTITY", invoice.value.totalJumlah],
    ["TOTAL VOLUME", invoice.value.totalVolume.toFixed(2)],
    ["SUB TOTAL", invoice.value.totalHarga],
    ["UNLOADING FEE", invoice.value.bongkar],
    ["GRAND TOTAL", invoice.value.grandTotal],
  ];

  exportToCSV(dataArray, `invoice_${invoice.value.tanggal}.csv`);
}

function printInvoice() {
  window.print();
}
</script>

<template>
  <div
    v-if="visible && invoice"
    class="flex justify-center items-start p-6 overflow-y-auto"
  >
    <CardBox is-modal>
      <div
        class="w-full max-w-3xl rounded-lg shadow-lg p-8 print:justify-center print:items-center print:w-full print:shadow-none print:p-0"
      >
        <!-- Header -->
        <div class="text-center border-b pb-4 mb-4">
          <div v-for="me in authStore.me" :key="me.id" class="text-2xl font-bold">
            <h1>{{ me.company.name }}</h1>
          </div>
          <p class="text-sm">Invoice Date: {{ invoice.tanggal }}</p>
        </div>

        <!-- Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><span class="font-semibold">Customer:</span> {{ invoice.buyer }}</p>
            <p><span class="font-semibold">Shiper:</span> {{ invoice.shiper }}</p>
          </div>
        </div>

        <!-- Tabel -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border text-sm">
            <thead>
              <tr class="">
                <th class="border px-2 py-1 text-left">Category Size-Dia</th>
                <th class="border px-2 py-1">Qty (Logs)</th>
                <th class="border px-2 py-1">Volume (m³)</th>
                <th class="border px-2 py-1">Price</th>
                <th class="border px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in invoice.rows" :key="i">
                <td class="border px-2 py-1">{{ row.deskripsi }}</td>
                <td class="border px-2 py-1 text-center">{{ row.jumlah }}</td>
                <td class="border px-2 py-1 text-right">
                  {{ row.volume.toFixed(2) }}
                </td>
                <td class="border px-2 py-1 text-right">
                  Rp {{ row.harga.toLocaleString() }}/m³
                </td>
                <td class="border px-2 py-1 text-right">
                  Rp {{ row.subtotal.toLocaleString() }}
                </td>
              </tr>
            </tbody>
            <tfoot class="font-semibold">
              <tr>
                <td class="border px-2 py-1 text-right">TOTAL</td>
                <td class="border px-2 py-1 text-center">
                  {{ invoice.totalJumlah }}
                </td>
                <td class="border px-2 py-1 text-right">
                  {{ invoice.totalVolume.toFixed(2) }}m³
                </td>
                <td class="border px-2 py-1 text-right">
                  Rp {{ invoice.totalPerm3.toLocaleString() }}
                </td>
                <td class="border px-2 py-1 text-right">
                  Rp {{ invoice.totalHarga.toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td class="border px-2 py-1 text-right" colspan="4">Unloading Fee</td>
                <td class="border px-2 py-1 text-right">
                  Rp {{ invoice.bongkar.toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td class="border px-2 py-1 text-right" colspan="4">Grand Total</td>
                <td class="border px-2 py-1 text-right">
                  Rp {{ invoice.grandTotal.toLocaleString() }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6 no-print">
          <BaseButton
            :icon="mdiPrinter"
            label="Print"
            color="info"
            @click="printInvoice"
          />
          <BaseButton
            :icon="mdiDownload"
            label="Download CSV"
            color="success"
            @click="downloadCSV"
          />
          <BaseButton
            :icon="mdiClose"
            label="Close"
            color="danger"
            outline
            @click="$emit('close')"
          />
        </div>
      </div>
    </CardBox>
  </div>
</template>
