import { defineStore } from 'pinia'

const useMainStore = defineStore('main', {
  state: () => {
    return {
      theme: 'light'
    }
  }
})

export { useMainStore }
