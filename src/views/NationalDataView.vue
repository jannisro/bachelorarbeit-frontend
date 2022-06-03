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

    <BarChart 
        v-if="electricityData && weatherData"
        headline="Primary Enery Data" 
        id="primaryEnergyData" 
        :datasets="primaryEnergyChartData" 
        :options="primaryEnergyOptions()" />

    <!--<IndicatorElement :items="[]" />

    <ChartTabs :items="[{id: 'tab1', title: 'Test 1'}, {id: 'tab2', title: 'Test 2'}]" />-->

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import validation from '@/services/validation'
import DataNavigation from '@/components/DataNavigation.vue'
import BarChart from '@/components/BarChart.vue'
/*import IndicatorElement from '@/components/IndicatorElement.vue'
import ChartTabs from '@/components/ChartTabs.vue'*/
import axios from 'axios/dist/axios'
import urlBuilder from '@/services/urlBuilder'
import chartOptions from '@/services/chartOptions'
import chartData from '@/services/chartData'

export default {
    name: 'NationalDataView',
    metaInfo: 'Start',

    data () {
        return {
            periodDisplayName: '',
            previousUrl: '',
            nextUrl: '',
            electricityData: false,
            weatherData: false,
            primaryEnergyChartData: {}
        }
    },

    components: {
        HeaderNavigation,
        DataNavigation,
        BarChart,
        /*IndicatorElement,
        ChartTabs*/
    },

    methods: {

        fetchAndOutputData () {
            Promise.all([this.fetchElectricityData(), this.fetchWeatherData()])
                .then(data => {
                    this.electricityData = data[0];
                    this.weatherData = data[1];
                    this.primaryEnergyChartData = chartData.primaryEnergyChart(data[0].data);
                });
        },


        async fetchElectricityData () {
            let response = await axios.get(urlBuilder.nationalElectricityApi(this.$route.params));
            return response.data;
        },


        async fetchWeatherData () {
            let response = await axios.get(urlBuilder.weatherDataApi(this.$route.params));
            return response.data;
        },


        primaryEnergyOptions () {
            return chartOptions.primaryEnergyData();
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