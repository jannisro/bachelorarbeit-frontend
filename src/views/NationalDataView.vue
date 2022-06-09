<template>

    <HeaderNavigation 
        :countrySelectionVisible="true" 
        :selectedCountry="$route.params.countryCode" />

    <div v-if="error" class="flex-column align-items-center">
        <h1 class="mt-5 mb-2">{{ error }}</h1>
        <a href="" class="button">Retry</a>
    </div>
        
    <LoadingSpinner v-if="!viewLoaded && !error" />

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
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal" />

    <BarChart
        headline="Commercial/Physical Exchange" 
        id="secondaryEnergyData"
        ref="secondaryEnergyChart"
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal" />

    <!--<IndicatorElement :items="[]" />-->

    <ChartTabs ref="weatherChartTabs" @supportButtonClicked="showSupportModal" :viewLoaded="viewLoaded" :items="[
        {id: 'weatherOverview', title: 'Overall Deviation', headline: 'Relative deviation from overall mean'}, 
        {id: 'clouds', title: 'Clouds', headline: 'Relative cloudiness per weather station'}, 
        {id: 'temperature', title: 'Temperature', headline: 'Temperature per weather station'}, 
        {id: 'wind', title: 'Wind', headline: 'Wind per weather station'}, 
        {id: 'rain', title: 'Rain', headline: 'Rain per weather station'}, 
        {id: 'snow', title: 'Snow', headline: 'Snow per weather station'}
    ]" />

    <SupportModal ref="supportModal" />

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
import SupportModal from '@/components/SupportModal.vue'
import'tooltipper/tooltipper'
import chartExplanations from '@/services/chartExplanations'

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
            error: false
        }
    },

    components: {
        HeaderNavigation,
        DataNavigation,
        BarChart,
        //IndicatorElement,
        ChartTabs,
        LoadingSpinner,
        SupportModal
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
                        $this.showError('Received invalid response from server!')
                    }
                })
                .catch(() => { $this.showError('An Error occurred while fetching data!') });
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
        },


        showError (message) {
            this.error = message;
        },


        showSupportModal (chartId) {
            this.$refs.supportModal.show(chartExplanations[chartId]());
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
            this.viewLoaded = this.error = false;
            this.validateAndRender()
        }
    }

}
</script>

<style lang="less">
@import '@/assets/less/setup';
@import '@/assets/less/utils';
@import '@/assets/less/button';
@import '@/assets/less/tooltip';
</style>