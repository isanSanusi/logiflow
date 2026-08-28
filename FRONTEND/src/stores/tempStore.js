import { defineStore } from "pinia";
import { ref } from "vue";

export const useTempStore = defineStore("tempDatas", () => {
  const selectedData = ref(null); // menyimpan card yang dipilih

  function setData(item) {
    selectedData.value = item;
  }

  return { selectedData, setData };
});
