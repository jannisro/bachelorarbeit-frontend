<template>
    <HeaderNavigation :countrySelectionVisible="true" :selectedCountry="$route.params.startCountryCode" />
</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
//import chartjs from 'chart.js/dist/chart.esm'

export default {
    name: 'NationalDataView',
    metaInfo: 'Start',

    components: {
        HeaderNavigation
    },

}
</script>

<style lang="less" scoped>

</style>