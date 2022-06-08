<template>

    <HeaderNavigation 
        :countrySelectionVisible="true" 
        :selectedCountry="$route.params.countryCode" />

    <h1 v-if="error">
        {{ error }}
    </h1>
        
    <LoadingSpinner v-if="!viewLoaded" />

    <DataNavigation 
        v-if="viewLoaded"
        :countryCodes="[$route.params.countryCode]" 
        :periodName="$route.params.timePeriodName"
        :date="$route.params.date"
        :periodDisplayName="periodDisplayName"
        :previousUrl="`/data/national/${$route.params.countryCode}/${$route.params.timePeriodName}/${previousStepDate}`"
        :nextUrl="`/data/national/${$route.params.countryCode}/${$route.params.timePeriodName}/${nextStepDate}`" />

    <BarChart
        headline="Primary Energy Data" 
        id="primaryEnergyData"
        ref="primaryEnergyChart"
        :viewLoaded="viewLoaded" />

    <BarChart
        headline="Commercial/Physical Exchange" 
        id="secondaryEnergyData"
        ref="secondaryEnergyChart"
        :viewLoaded="viewLoaded" />

    <!--<IndicatorElement :items="[]" />-->

    <ChartTabs ref="weatherChartTabs" :viewLoaded="viewLoaded" :items="[
        {id: 'weatherOverview', title: 'Overall Deviation'}, 
        {id: 'clouds', title: 'Clouds'}, 
        {id: 'temperature', title: 'Temperature'}, 
        {id: 'wind', title: 'Wind'}, 
        {id: 'rain', title: 'Rain'}, 
        {id: 'snow', title: 'Snow'}
    ]" />

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import validation from '@/services/validation'
import DataNavigation from '@/components/DataNavigation.vue'
import BarChart from '@/components/BarChart.vue'
//import IndicatorElement from '@/components/IndicatorElement.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ChartTabs from '@/components/ChartTabs.vue'
import axios from 'axios/dist/axios'
import urlBuilder from '@/services/urlBuilder'
import { useApiDataStore } from '@/stores/apiDataStore'

export default {
    name: 'NationalDataView',
    metaInfo: 'Start',

    setup() {
        const store = useApiDataStore()
        return {
            store
        }
    },

    data () {
        return {
            periodDisplayName: '',
            previousStepDate: '1',
            nextStepDate: '1',
            electricityData: false,
            weatherData: false,
            viewLoaded: false,
            error: null
        }
    },

    components: {
        HeaderNavigation,
        DataNavigation,
        BarChart,
        //IndicatorElement,
        ChartTabs,
        LoadingSpinner
    },

    methods: {


        validateAndRender () {
            const validCountry = validation.isValidCountry(this.$route.params.countryCode);
            const validPeriodName = validation.isValidPeriodName(this.$route.params.timePeriodName);
            const validDate = validation.isValidDate(this.$route.params.date);
            (validCountry && validPeriodName && validDate) ? this.fetchAndOutputData() : this.$router.push('/');
        },


        fetchAndOutputData () {
            let $this = this;
            const start = Date.now();
            Promise.all([this.fetchElectricityData(), this.fetchWeatherData()])
                .then(data => {
                    if (data[0].country && data[0].time_period && data[0].data && data[1].data) {
                        console.log(`Data retrieved in ${Date.now() - start} milliseconds`);
                        // Store meta data locally
                        $this.periodDisplayName = data[0].time_period;
                        $this.previousStepDate = data[0].previous_step;
                        $this.nextStepDate = data[0].next_step;
                        // Store response in pinia
                        useApiDataStore.electricityData = data[0].data;
                        useApiDataStore.weatherData = data[1].data;
                        // Trigger chart rendering
                        $this.render();
                        $this.viewLoaded = true;
                    }
                    else {
                        this.error = "Received invalid response from server!";
                        this.viewLoaded = true;
                    }
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


        render () {
            const start = Date.now();
            this.$refs.primaryEnergyChart.render();
            this.$refs.secondaryEnergyChart.render();
            this.$refs.weatherChartTabs.render()
            console.log(`Completed rendering in ${Date.now() - start} milliseconds`);
        }

    },


    /**
     * Initial rendering after component mount
     */
    mounted () {
        this.validateAndRender()
    },


    /**
     * React on page transition
     */
    watch: {
        $route () {
            window.scrollTo(0, 0);
            this.viewLoaded = false;
            this.validateAndRender()
        }
    }

}
</script>

<style lang="less" scoped>

</style>