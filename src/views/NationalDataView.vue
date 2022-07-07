<template>

    <HeaderNavigation 
        :countrySelectionVisible="true" 
        :selectedCountry="$route.params.countryCode"
        :navigationSteps="[
            { name: 'Generation', url: 'generation' },
            { name: 'Electricity Exchange', url: 'exchange' },
            { name: 'Electricity Indicators', url: 'indicators' },
            { name: 'Weather Data', url: 'weather' },
            { name: 'Export', url: 'export' }
        ]" 
    />

    <div style="margin-top: 6.5rem"></div>

    <div v-if="error" class="flex-column align-items-center">
        <h1 class="mt-5 mb-2">{{ error }}</h1>
        <ButtonElement href="">
            Retry
        </ButtonElement>
    </div>
        
    <LoadingSpinner v-if="!viewLoaded && !error" />

    <DataNavigation 
        v-if="viewLoaded"
        :countryCodes="[$route.params.countryCode]" 
        :periodName="$route.params.timePeriodName"
        :date="$route.params.date"
        :periodDisplayName="periodDisplayName"
        :previousUrl="previousStepUrl"
        :nextUrl="nextStepUrl"
        @timezoneChanged="changeTimezone" 
    />

    <BarChart
        headline="Primary Energy Data" 
        id="primaryEnergyData"
        ref="primaryEnergyChart"
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal" 
    />


    <a name="generation"></a>
    <BarChart
        headline="Generation per Production Type" 
        id="generationChart"
        ref="generationChart"
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal"
        v-if="$route.params.timePeriodName === 'day'" 
    />


    <a name="exchange"></a>
    <BarChart
        headline="Commercial/Physical Exchange" 
        id="secondaryEnergyData"
        ref="secondaryEnergyChart"
        :viewLoaded="viewLoaded"
        @supportButtonClicked="showSupportModal" 
    />

    
    <a name="indicators"></a>
    <IndicatorList 
        prefix="%" 
        :colorThresholds="[10, 30]" 
        ref="indicators" 
        :viewLoaded="viewLoaded"
        headline="Electricity Indicators"
        @supportButtonClicked="showSupportModal('energyIndicators')" 
    />

    
    <a name="weather"></a>
    <ChartTabs 
        ref="weatherChartTabs" 
        @supportButtonClicked="showSupportModal" 
        :viewLoaded="viewLoaded" :items="[
            {id: 'weatherOverview', title: 'Overall Deviation', headline: 'Relative deviation from average'}, 
            {id: 'clouds', title: 'Clouds', headline: 'Relative cloudiness per weather station'}, 
            {id: 'temperature', title: 'Temperature', headline: 'Temperature per weather station'}, 
            {id: 'wind', title: 'Wind', headline: 'Wind per weather station'}, 
            {id: 'rain', title: 'Rain', headline: 'Rain per weather station'}, 
            {id: 'snow', title: 'Snow', headline: 'Snow per weather station'}
            ]" 
    />
        

    
    <a name="export"></a>
    <div v-if="viewLoaded" class="flex justify-content-center mt-3 mb-3">
        <ButtonElement :large="true" :rawHref="exportUrl('electricity')">
            Export Energy Data
        </ButtonElement>
        
        <ButtonElement :large="true" class="ml-2" :rawHref="exportUrl('electricity')">
            Export Weather Data
        </ButtonElement>
    </div>
    

    <SupportModal ref="supportModal" />

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import validation from '@/services/validation'
import DataNavigation from '@/components/DataNavigation.vue'
import BarChart from '@/components/BarChart.vue'
import IndicatorList from '@/components/IndicatorList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ChartTabs from '@/components/ChartTabs.vue'
import urlBuilder from '@/services/urlBuilder'
import SupportModal from '@/components/SupportModal.vue'
import'tooltipper/tooltipper'
import chartExplanations from '@/services/chartExplanations'
import ButtonElement from '@/components/ButtonElement.vue'

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
        IndicatorList,
        ChartTabs,
        LoadingSpinner,
        SupportModal,
        ButtonElement
    },

    methods: {


        validateAndRender () {
            this.viewLoaded = false;
            const validCountry = validation.isValidCountry(this.$route.params.countryCode);
            const validPeriodName = validation.isValidPeriodName(this.$route.params.timePeriodName);
            const validDate = validation.isValidDate(this.$route.params.date);
            (validCountry && validPeriodName && validDate) ? this.fetchAndOutputData() : this.viewLoaded=true;
        },


        fetchAndOutputData () {
            let $this = this;
            const start = Date.now();
            Promise.all([this.fetchElectricityData(), this.fetchWeatherData()])
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(data => {
                    console.log(`Data retrieved in ${Date.now() - start} milliseconds`);
                    $this.handleApiResponse(data);
                })
                .catch(e => { $this.showError('An Error occurred while fetching data!', e) });
        },


        async fetchElectricityData () {
            return await fetch(urlBuilder.nationalElectricityApi(this.$route.params));
        },


        async fetchWeatherData () {
            return await fetch(urlBuilder.weatherDataApi(this.$route.params));
        },


        render () {
            const start = Date.now();
            this.$refs.primaryEnergyChart.render(this.electricityData);
            if (this.$route.params.timePeriodName === 'day') {
                this.$refs.generationChart.render(this.electricityData);
            } 
            this.$refs.secondaryEnergyChart.render(this.electricityData);
            this.$refs.weatherChartTabs.render(this.weatherData);
            this.$refs.indicators.render(this.electricityData.mean_values);
            console.log(`Completed rendering in ${Date.now() - start} milliseconds`);
        },


        showError (message, exception) {
            this.error = message;
            exception ? console.log(exception) : null;
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
        },


        changeTimezone (hourOffset) {
            document.querySelector('#app').style.visibility = 'hidden';
            const charts = ['primaryEnergyChart', 'secondaryEnergyChart', 'generationChart', 'weatherChartTabs'];
            charts.forEach(chart => {
                if (this.$refs[chart]) {
                    this.$refs[chart].setTimeOffset(hourOffset);
                } 
            });
            window.setTimeout(() => { document.querySelector('#app').style.visibility = 'visible'; }, 300)
        },


        exportUrl (domain) {
            const countryAndDate = `${this.$route.params.countryCode}/${this.$route.params.date}`;
            return domain === 'electricity'
                ? `${process.env.VUE_APP_API_URL}/electricity/export/national/${countryAndDate}`
                : `${process.env.VUE_APP_API_URL}/weather/export/${countryAndDate}`;
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
@import '@/assets/less/tooltip';
</style>