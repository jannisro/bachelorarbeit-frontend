<template>

    <HeaderNavigation 
        :countrySelectionVisible="true" 
        :selectedCountry="$route.params.countryCode1" />

    <h1 v-if="error">
        {{ error }}
    </h1>

    <LoadingSpinner v-if="!viewLoaded" />

    <DataNavigation 
        v-if="viewLoaded"
        :countryCodes="[$route.params.startCountryCode, $route.params.endCountryCode]" 
        :periodName="$route.params.timePeriodName"
        :date="$route.params.date"
        :periodDisplayName="periodDisplayName"
        :previousUrl="`/data/international/${$route.params.countryCode1}/${$route.params.countryCode2}/${$route.params.timePeriodName}/${previousStepDate}`"
        :nextUrl="`/data/international/${$route.params.countryCode1}/${$route.params.countryCode2}/${$route.params.timePeriodName}/${nextStepDate}`" />

    <BarChart
        :headline="`Border Crossing ${startCountryCode} &#129042; ${endCountryCode}`" 
        id="primaryBorderCrossingData"
        ref="primaryBorderCrossingData"
        :viewLoaded="viewLoaded" />

    <BarChart
        :headline="`Border Crossing ${endCountryCode} &#129042; ${startCountryCode}`" 
        id="reversedBorderCrossingData"
        ref="reversedBorderCrossingData"
        :viewLoaded="viewLoaded" />

    <!--<IndicatorElement :items="[]" />-->

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import validation from '@/services/validation'
import DataNavigation from '@/components/DataNavigation.vue'
import BarChart from '@/components/BarChart.vue'
//import IndicatorElement from '@/components/IndicatorElement.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import axios from 'axios/dist/axios'
import urlBuilder from '@/services/urlBuilder'
import { useApiDataStore } from '@/stores/apiDataStore'

export default {
    name: 'InternationalDataView',
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
            viewLoaded: false,
            error: null,
            startCountryCode: null,
            endCountryCode: null
        }
    },

    components: {
        HeaderNavigation,
        DataNavigation,
        BarChart,
        //IndicatorElement,
        LoadingSpinner
    },

    methods: {


        validateAndRender () {
            const validCountry1 = validation.isValidCountry(this.$route.params.startCountryCode);
            const validCountry2 = validation.isValidCountry(this.$route.params.endCountryCode);
            const validPeriodName = validation.isValidPeriodName(this.$route.params.timePeriodName);
            const validDate = validation.isValidDate(this.$route.params.date);
            (validCountry1 && validCountry2 && validPeriodName && validDate) ? this.fetchAndOutputData() : this.$router.push('/');
        },


        fetchAndOutputData () {
            this.startCountryCode = this.$route.params.startCountryCode;
            this.endCountryCode = this.$route.params.endCountryCode;
            let $this = this;
            const start = Date.now();
            Promise.all([this.fetchMainDirectionData(), this.fetchReversedDirectionData()])
                .then(data => {
                    if (data[0].start_country && data[0].end_country && data[0].time_period && data[0].data && data[1].data) {
                        console.log(`Data retrieved in ${Date.now() - start} milliseconds`);
                        // Store meta data locally
                        $this.periodDisplayName = data[0].time_period;
                        $this.previousStepDate = data[0].previous_step;
                        $this.nextStepDate = data[0].next_step;
                        // Store response in pinia
                        useApiDataStore.mainDirectionData = data[0].data;
                        useApiDataStore.reverseDirectionData = data[1].data;
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


        async fetchMainDirectionData () {
            let response = await axios.get(urlBuilder.internationalElectricityApi(this.$route.params));
            return response.data;
        },


        async fetchReversedDirectionData () {
            const params = {
                startCountryCode: this.$route.params.endCountryCode,
                endCountryCode: this.$route.params.startCountryCode,
                timePeriodName: this.$route.params.timePeriodName,
                date: this.$route.params.date
            };
            let response = await axios.get(urlBuilder.internationalElectricityApi(params));
            return response.data;
        },


        render () {
            const start = Date.now();
            this.$refs.primaryBorderCrossingData.render();
            this.$refs.reversedBorderCrossingData.render();
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