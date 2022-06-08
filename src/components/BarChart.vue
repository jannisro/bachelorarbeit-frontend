<template>
    <div class="chart" :class="{ 'invisible': !viewLoaded }">
        <h2 class="chart-headline" v-if="viewLoaded && headline">{{ headline }}</h2>
        <canvas :id="id" :height="chartHeight" data-chart-canvas></canvas>
    </div>
</template>


<script>
import chartData from '@/services/chartData';
import chartOptions from '@/services/chartOptions';
import Chart from 'chart.js/dist/chart';
import { useApiDataStore } from '@/stores/apiDataStore'

export default {
    name: 'BarChart',

    setup () {
        const store = useApiDataStore();
        return {
            store
        }
    },

    data () {
        return {
            chart: null,
            chartHeight: null
        }
    },

    props: {
        headline: String,
        id: String,
        viewLoaded: Boolean
    },
    
    methods: {


        render () {
            if (this.chart) this.chart.destroy();
            let app = this;
            this.chart = new Chart(document.getElementById(this.id), {
                data: chartData[app.id](useApiDataStore),
                options: chartOptions[app.id]()
            });
            this.resizeCharts();
        },
    

        resizeCharts () {
            this.chartHeight = window.innerHeight*0.7;
        },


        getTimeLabels () {
            let res = [];
            for (let i = 0; i < 24; i++) {
                res.push(`${i.toString().padStart(2, '0')}:00`)
            }
            return res;
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
.chart {
    width: 94%;
    margin: 0 0 4rem 3%;
    background: rgba(255,255,255,0.06);
    padding: 2rem 1.2rem;
    border-radius: 20px;

    &.invisible {
        visibility: hidden;
    }

    canvas {
        width: 100%;
        max-height: 70vh;
    }

    &-headline {
        margin-bottom: 1rem;
        text-align: center;
    }
}
</style>