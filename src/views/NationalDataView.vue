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
        :previousUrl="previousStepUrl"
        :nextUrl="nextStepUrl" />

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
import SupportModal from '@/components/SupportModal.vue'
import'tooltipper/tooltipper'
import chartExplanations from '@/services/chartExplanations'

export default {
    name: 'NationalDataView',
    metaInfo: 'Start',

    data () {
        return {
            periodDisplayName: '',
            previousStepUrl: '',
            nextStepDate: '',
            electricityData: null,
            weatherData: null,
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
                    console.log(`Data retrieved in ${Date.now() - start} milliseconds`);
                    $this.handleApiResponse(data);
                })
                .catch((e) => { console.log(e); $this.showError('An Error occurred while fetching data!') });
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
            this.$refs.primaryEnergyChart.render(this.electricityData);
            this.$refs.secondaryEnergyChart.render(this.electricityData);
            this.$refs.weatherChartTabs.render(this.weatherData)
            console.log(`Completed rendering in ${Date.now() - start} milliseconds`);
        },


        showError (message) {
            this.error = message;
        },


        showSupportModal (chartId) {
            this.$refs.supportModal.show(chartExplanations[chartId]());
        },


        handleApiResponse (data) {
            const isValidMetaData = data[0].country && data[0].time_period && data[0].previous_step && data[0].next_step;
            const isValidChartData = data[0].data && data[1].data;
            if (isValidMetaData && isValidChartData) {
                this.storeResponseData(data);
                this.render();
                this.viewLoaded = true;
            }
            else {
                this.showError('Received invalid response from server!')
            }
        },


        storeResponseData (data) {
            this.periodDisplayName = data[0].time_period;
            this.previousStepUrl = this.siblingViewUrl(data[0].previous_step);
            this.nextStepUrl = this.siblingViewUrl(data[0].next_step);
            this.electricityData = data[0].data;
            this.weatherData = data[1].data;
        },


        siblingViewUrl (date) {
            return urlBuilder.getDataUrl(
                [this.$route.params.countryCode],
                this.$route.params.timePeriodName,
                date
            );
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