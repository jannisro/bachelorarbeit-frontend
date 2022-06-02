<template>

    <HeaderNavigation 
        :countrySelectionVisible="true" 
        :selectedCountry="$route.params.countryCode" />

    <DataNavigation 
        :countryCodes="[$route.params.countryCode]" 
        :periodName="$route.params.timePeriodName"
        :date="$route.params.date"
        area="national"
        :periodDisplayName="periodDisplayName"
        :previousUrl="previousUrl"
        :nextUrl="nextUrl" />

    <BarChart headline="Primary Enery Data" id="primaryEnergyData" :datasets="primaryEnergyData()" :options="primaryEnergyOptions()" />
    <!--<BarChart headline="Commercial/Physical Exchange" id="secondaryEnergyData" />-->

    <IndicatorElement :items="[]" />

    <ChartTabs :items="[{id: 'tab1', title: 'Test 1'}, {id: 'tab2', title: 'Test 2'}]" />

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import validation from '@/services/validation.js'
import DataNavigation from '@/components/DataNavigation.vue'
import BarChart from '@/components/BarChart.vue'
import IndicatorElement from '@/components/IndicatorElement.vue'
import ChartTabs from '@/components/ChartTabs.vue'
//import chartjs from 'chart.js/dist/chart.esm'

export default {
    name: 'NationalDataView',
    metaInfo: 'Start',

    data () {
        return {
            periodDisplayName: '',
            previousUrl: '',
            nextUrl: '',
            electricityData: null,
            weatherData: null
        }
    },

    components: {
        HeaderNavigation,
        DataNavigation,
        BarChart,
        IndicatorElement,
        ChartTabs
    },

    methods: {

        async fetchAndOutputData () {
            await this.fetchData();
        },


        fetchData () {
            const apiBase = `${process.env.VUE_APP_URL}`
            const p = this.$route.params;
            fetch(`${apiBase}/electricity/national/${p.countryCode}/${p.timePeriodName}/${p.date}`)
                .then(response => response.json)
                .then(data => { 
                    this.periodDisplayName = data.time_period;
                    this.electricityData = data.data;
                });
                
            fetch(`${apiBase}/weather/national/${p.countryCode}/${p.timePeriodName}/${p.date}`)
                .then(response => response.json)
                .then(data => { 
                    this.weatherData = data.data;
                });
        },


        primaryEnergyData () {
            return [
                {
                    label: 'Biomass',
                    data: this.generationData.biomass.map(function (item) {return item.value}) // TODO
                }
            ];
        },


        primaryEnergyOptions () {

        }

    },

    mounted () {
        if (
            validation.isValidCountry(this.$route.params.countryCode) 
            && validation.isValidPeriodName(this.$route.params.timePeriodName)
            && validation.isValidDate(this.$route.params.date)
        ) {
            this.fetchAndOutputData()
        }
        else {
            this.$router.push('/');
        }
    }

}
</script>

<style lang="less" scoped>

</style>