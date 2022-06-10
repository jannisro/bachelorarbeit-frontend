<template>
    <div class="chart" :class="{ 'invisible': !viewLoaded }">

        <div class="chart__head">
            <h2 class="chart__headline" v-if="viewLoaded && headline">{{ headline }}</h2>
            <SupportButton @supportButtonClicked="$emit('supportButtonClicked', id)" />
        </div>

        <div class="chart-control" v-if="viewLoaded && preparedChartData">
            <button class="button" @click="toggleAllDatarows">
                {{ allHidden ? 'Show all' : 'Hide all' }}
            </button>
        </div>

        <canvas :id="id" :height="chartHeight" data-chart-canvas></canvas>

    </div>
</template>


<script>
import chartData from '@/services/chartData';
import chartOptions from '@/services/chartOptions';
import Chart from 'chart.js/dist/chart';
import SupportButton from '@/components/SupportButton.vue';

export default {
    name: 'BarChart',
    emits: ['supportButtonClicked'],

    data () {
        return {
            chart: null,
            chartHeight: null,
            preparedChartData: {},
            allHidden: false,
            updateLocked: false
        }
    },

    props: {
        headline: String,
        id: String,
        viewLoaded: Boolean
    },

    components: {
        SupportButton
    },
    
    methods: {


        render (rawChartData) {
            if (this.chart) this.chart.destroy();
            this.preparedChartData = chartData[this.id](rawChartData);
            this.chart = new Chart(document.getElementById(this.id), {
                data: this.preparedChartData,
                options: chartOptions[this.id]()
            });
            this.resizeCharts();
        },
    

        resizeCharts () {
            this.chartHeight = window.innerHeight*0.7;
        },


        toggleAllDatarows () {
            if (!this.updateLocked) {
                for (let i = 0; i < this.preparedChartData.datasets.length; i++) {
                    this.preparedChartData.datasets[i].hidden = !this.allHidden;
                }
                this.allHidden = !this.allHidden;
                this.updateChart();
            }
        },


        updateChart () {
            // Lock update to prevent chartJS error due to too many canvas reloads
            if (!this.updateLocked) {
                this.updateLocked = true;
                this.chart.destroy();
                this.chart = new Chart(document.getElementById(this.id), {
                    data: this.preparedChartData,
                    options: chartOptions[this.id]()
                });
                window.setTimeout(() => {this.updateLocked = false;}, 1500)
            }
        }


    },


    mounted () {
        let app = this;
        window.addEventListener('resize', function() {
            app.resizeCharts();
        });
    }

}
</script>


<style lang="less">
@import '@/assets/less/setup';

.chart {
    width: 94%;
    margin: 0 0 4rem 3%;
    background: rgba(255,255,255,0.06);
    padding: 2.1rem 1.8rem;
    border-radius: 20px;

    &.invisible {
        visibility: hidden;
    }

    canvas {
        width: 100%;
        max-height: 70vh;
    }

    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__headline {
        margin-bottom: 1rem;
        text-align: center;
    }

    &-control {
        text-align: center;
    }
}
</style>