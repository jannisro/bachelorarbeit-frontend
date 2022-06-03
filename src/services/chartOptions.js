export default {

    primaryEnergyData () {
        return {
            scales: {
                xAxis: {
                    stacked: true,
                    title: {    
                        display: true,
                        text: 'Time'
                    }
                },
                yAxis: {
                    stacked: false,
                    min: -10000,
                    max: 80000,
                    title: {
                        text: 'MW',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' MW';
                        }
                    }
                },
                stackedYAxis: {
                    type: 'linear',
                    stacked: true,
                    position: 'left',
                    min: -10000,
                    max: 80000,
                    display: false
                },
                priceYAxis: {
                    type: 'linear',
                    stacked: false,
                    position: 'right',
                    min: 0,
                    title: {
                        text: 'Price / MWh',
                        display: true
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '€';
                        }
                    }
                }
            }
        }
    }

}