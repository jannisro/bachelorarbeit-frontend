<template>

    <HeaderNavigation :countrySelectionVisible="true" :selectedCountry="$route.params.startCountryCode" />

    <div v-if="error" class="flex-column align-items-center">
        <h1 class="mt-5 mb-2">{{ error }}</h1>
        <ButtonElement href="">
            Retry
        </ButtonElement>
    </div>

    <LoadingSpinner v-if="!viewLoaded && !error" />

    <DataNavigation 
        v-if="viewLoaded"
        :countryCodes="[$route.params.startCountryCode, $route.params.endCountryCode]" 
        :periodName="$route.params.timePeriodName"
        :date="$route.params.date"
        :periodDisplayName="periodDisplayName"
        :previousUrl="previousStepUrl"
        :nextUrl="nextStepUrl"
        :navigationSteps="[
            { name: 'Outgoing Flow', url: 'outgoing'},
            { name: 'Incoming Flow', url: 'incoming'},
            { name: 'Export', url: 'export'}
        ]"
        @timezoneChanged="changeTimezone" />

    <a name="outgoing"></a>
    <BarChart
        :headline="`Border Crossing ${startCountryCode} &#129042; ${endCountryCode}`" 
        id="primaryBorderCrossingData"
        ref="primaryBorderCrossingData"
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal" />

    <a name="incoming"></a>
    <BarChart
        :headline="`Border Crossing ${endCountryCode} &#129042; ${startCountryCode}`" 
        id="reversedBorderCrossingData"
        ref="reversedBorderCrossingData"
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal" />

    <a name="export"></a>
    <div v-if="viewLoaded" class="flex justify-content-center mt-3 mb-3">
        <ButtonElement :large="true" :rawHref="exportUrl()">
            Export Energy Data
        </ButtonElement>
    </div>

    <!--<IndicatorElement :items="[]" />-->

    <SupportModal ref="supportModal" />

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import validation from '@/services/validation'
import DataNavigation from '@/components/DataNavigation.vue'
import BarChart from '@/components/BarChart.vue'
//import IndicatorElement from '@/components/IndicatorElement.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import urlBuilder from '@/services/urlBuilder'
import SupportModal from '@/components/SupportModal.vue'
import chartExplanations from '@/services/chartExplanations'
import ButtonElement from '@/components/ButtonElement.vue'

export default {
    name: 'InternationalDataView',
    metaInfo: 'Start',

    data () {
        return {
            periodDisplayName: '',
            previousStepUrl: '',
            nextStepUrl: '',
            viewLoaded: false,
            error: false,
            startCountryCode: null,
            endCountryCode: null,
            mainDirectionData: null,
            reverseDirectionData: null
        }
    },

    components: {
        HeaderNavigation,
        DataNavigation,
        BarChart,
        //IndicatorElement,
        LoadingSpinner,
        SupportModal,
        ButtonElement
    },

    methods: {


        validateAndRender () {
            this.viewLoaded = false;
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
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(data => {
                    console.log(`Data retrieved in ${Date.now() - start} milliseconds`);
                    $this.handleApiResponse(data);
                })
                .catch(e => { $this.showError('An Error occurred while fetching data!', e) });
        },


        async fetchMainDirectionData () {
            return await fetch(urlBuilder.internationalElectricityApi(this.$route.params));
        },


        async fetchReversedDirectionData () {
            const params = {
                startCountryCode: this.$route.params.endCountryCode,
                endCountryCode: this.$route.params.startCountryCode,
                timePeriodName: this.$route.params.timePeriodName,
                date: this.$route.params.date
            };
            return await fetch(urlBuilder.internationalElectricityApi(params));
        },


        render () {
            const start = Date.now();
            this.$refs.primaryBorderCrossingData.render(this.mainDirectionData);
            this.$refs.reversedBorderCrossingData.render(this.reverseDirectionData);
            console.log(`Completed rendering in ${Date.now() - start} milliseconds`);
        },


        showError (message, exception) {
            this.error = message;
            if (exception) {
                console.log(exception);
            }
        },


        showSupportModal (chartId) {
            this.$refs.supportModal.show(chartExplanations[chartId]());
        },


        handleApiResponse (response) {
            const isValidMetaData = response[0].start_country && response[0].end_country && response[0].time_period;
            const isValidChartData = response[0].data && response[1].data;
            if (isValidMetaData && isValidChartData) {
                this.storeResponseData(response);
                this.render();
                this.viewLoaded = true;
            }
            else {
                this.showError('Received invalid response from server!')
            }
        },


        storeResponseData (response) {
            this.periodDisplayName = response[0].time_period;
            this.previousStepUrl = this.siblingViewUrl(response[0].previous_step);
            this.nextStepUrl = this.siblingViewUrl(response[0].next_step);
            this.mainDirectionData = response[0].data;
            this.reverseDirectionData = response[1].data;
        },


        siblingViewUrl (date) {
            return urlBuilder.getDataUrl(
                [this.$route.params.startCountryCode, this.$route.params.endCountryCode],
                this.$route.params.timePeriodName,
                date
            );
        },


        changeTimezone (hourOffset) {
            const charts = ['primaryBorderCrossingData', 'reversedBorderCrossingData'];
            charts.forEach(chart => {
                this.$refs[chart].setTimeOffset(hourOffset);
            });
        },

        
        exportUrl () {
            const countryAndDate = `${this.$route.params.startCountryCode}/${this.$route.params.date}`;
            return `${process.env.VUE_APP_API_URL}/electricity/export/international/${countryAndDate}`;
        }

    },


    mounted () {
        this.$watch(
            () => this.$route.params,
            () => { this.validateAndRender() },
            { immediate: true }
        )
    }

}
</script>

<style lang="less">
@import '@/assets/less/setup';
</style>