import { defineStore } from 'pinia'

export const useApiDataStore = defineStore('apiDataStore', {
    state: () => {
        return {
            electricityData: null,
            weatherData: null
        }
    },
})
