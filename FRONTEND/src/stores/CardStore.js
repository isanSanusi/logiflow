import { defineStore } from "pinia";
import { ref } from "vue";

export const useCardStore = defineStore("card", () => {
  const selectedItem = ref(null); // menyimpan card yang dipilih

  function setItem(item) {
    selectedItem.value = item;
  }

  return { selectedItem, setItem };
});
