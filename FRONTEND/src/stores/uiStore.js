import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore("ui", () => {

  const isEditMode = ref(false)
  const modalPriceOpen = ref(false)
  const modalInvoiceOpen = ref(false)


    function toggleEditMode() {
      isEditMode.value = !isEditMode.value
    }

    function toggleModalInvoice() {
      modalInvoiceOpen.value = !modalInvoiceOpen.value
    }

    function toggleModalPrice() {
      modalPriceOpen.value = !modalPriceOpen.value
    }

    return {
      isEditMode,modalInvoiceOpen,modalPriceOpen,toggleEditMode, toggleModalInvoice, toggleModalPrice
    }
})