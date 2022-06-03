<template>
    <div class="chart">
        HALLOOOOO
        <h2 class="chart-headline" v-if="headline">{{ headline }}</h2>
        <canvas :id="id" data-chart-canvas></canvas>
    </div>
</template>


<script>
import Chart from 'chart.js/dist/chart.esm';

export default {
    name: 'BarChart',

    data () {
        return {
            currentChartColor: 0,
            colors: {
                red: '#F44336',
                yellow: '#FFC107', 
                green: '#2E7D32',
                amber: '#FF9800',
                blue: '#1E88E5'
            }
        }
    },

    props: {
        headline: String,
        id: String,
        datasets: Array,
        options: Object
    },
    
    methods: {
        renderChartData () {
            // Add color and chart type to passed dataset
            let preparedDatasets = [];
            let $this = this;
            this.datasets.forEach(function (dataset) {
                dataset.type = 'bar';
                dataset.backgroundColor = $this.nextChartColor();
                dataset.borderColor = $this.nextChartColor();
                preparedDatasets.push(dataset);
            });
            // Create chart
            new Chart(document.getElementById(this.id), {
                data: {
                    datasets: preparedDatasets,
                    labels: $this.getTimeLabels()
                },
                options: $this.options
            });
        }
    },
    
    resizeCharts () {
        document.querySelectorAll('[data-chart-canvas]').forEach(function (elem) {
            elem.setAttribute('height', window.innerHeight*0.7)
        });
    },


    getTimeLabels() {
        let res = [];
        for (let i = 0; i < 25; i++) {
            res.push(`${i.toString().padStart(2, '0')}:00`)
        }
        return res;
    },

    nextChartColor() {
        const chartColors = [
            '#E8F5E9', 
            '#A5D6A7', 
            '#66BB6A', 
            '#43A047', 
            '#2E7D32', 
            '#00E676', 
            '#DCE775', 
            '#CDDC39', 
            '#AFB42B', 
            '#827717', 
            '#C6FF00', 
            '#80CBC4', 
            '#26A69A', 
            '#00897B', 
            '#00695C', 
            '#00BFA5',
            '#FFF9C4',
            '#FFF176',
            '#FFEB3B',
            '#FBC02D'
        ];
        if (this.currentChartColor === chartColors.length-1) this.currentChartColor = 0;
        return chartColors[this.currentChartColor++];
    },


    tooltipLabelSuffix (context, suffix) {
        let label = context.dataset.label || '';
        if (label) {
            label += ': ';
        }
        if (context.parsed.y !== null) {
            label += context.parsed.y + suffix;
        }
        return label;
    },


    mounted () {
        console.log('mounted')
        window.addEventListener('resize', function() {
            this.resizeCharts();
        });
        this.renderChartData();
        this.resizeCharts();
    }

}
</script>


<style lang="less" scoped>
.chart {
    width: 94%;
    margin: 0 0 4rem 3%;

    canvas {
        width: 100%;
        max-height: 80vh;
    }

    &-headline {
        margin-bottom: 1rem;
        text-align: center;
    }
}
</style>