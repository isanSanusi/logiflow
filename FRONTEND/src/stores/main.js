import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  const userName = ref()
  const userEmail = ref('doe.doe.doe@example.com')

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-',
      )}`,
  )

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])
  const userList = ref([])
  const companyList = ref([])
  const productList = ref([])
  const authMe = ref([])

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchUserList() {
    axios
      .get(`data-sources/userlist.json?v=3`)
      .then((result) => {
        userList.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchCompanyList() {
    axios
      .get(`data-sources/companylist.json`)
      .then((result) => {
        companyList.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchProductList() {
    axios
      .get(`data-sources/productlist.json`)
      .then((result) => {
        productList.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchAuthMe() {
    axios
      .get(`data-sources/authme.json`)
      .then((result) => {
        authMe.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    setUser,
    userList,
    productList,
    companyList,
    authMe,
    fetchSampleClients,
    fetchSampleHistory,
    fetchUserList,
    fetchCompanyList,
    fetchProductList,
    fetchAuthMe
  }
})
