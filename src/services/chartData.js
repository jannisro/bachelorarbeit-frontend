export default {

    mainColors: {
        red: '#F44336',
        yellow: '#FFC107', 
        green: '#2E7D32',
        amber: '#FF9800',
        blue: '#1E88E5'
    },

    secondaryColors: [
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
    ],


    primaryEnergyData (apiDataStore) {
        const electricityData = apiDataStore.electricityData;
        let datasets = [];
        let labels = []
        if (electricityData.generation && electricityData.load && electricityData.net_position && electricityData.price) {
            // Generation
            let index = 0;
            for (let psrType in electricityData.generation) {
                datasets.push({
                    label: electricityData.generation[psrType].name,
                    data: electricityData.generation[psrType].hourly.map(item => { return item.value }),
                    type: 'bar',
                    backgroundColor: this.secondaryColors[index],
                    borderColor: this.secondaryColors[index],
                    order: 2
                })
                ++index;
                if (index > this.secondaryColors.length) index = 0
            }
        }
        if (electricityData.load && electricityData.net_position && electricityData.price && electricityData.total_generation) {
            // Load and Load forecast
            datasets.push({
                label: 'Actual Load',
                type: 'line',
                data: electricityData.load.map(item => { 
                    labels.push(item.dt); 
                    return item.value 
                }),
                backgroundColor: this.mainColors.red,
                borderColor: this.mainColors.red,
                order: 1
            });
            datasets.push({
                label: 'Forecasted Load',
                type: 'line',
                data: electricityData.load_forecast.map(item => { return item.value }),
                backgroundColor: this.mainColors.yellow,
                borderColor: this.mainColors.yellow,
                order: 1
            });
            // Net Position
            datasets.push({
                label: 'Net Position',
                type: 'line',
                data: electricityData.net_position.map(item => { return item.value }),
                backgroundColor: this.mainColors.green,
                borderColor: this.mainColors.green,
                order: 1
            });
            // Electricity Price
            datasets.push({
                label: 'Electricity Price',
                type: 'line',
                data: electricityData.price.map(item => { return item.value }),
                backgroundColor: this.mainColors.amber,
                borderColor: this.mainColors.amber,
                yAxisID: 'priceYAxis',
                order: 1
            });
            // Total generation
            datasets.push({
                label: 'Total Generation',
                type: 'line',
                data: electricityData.total_generation.map(item => { return item.value }),
                backgroundColor: this.mainColors.blue,
                borderColor: this.mainColors.blue,
                order: 1
            });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    secondaryEnergyData (apiDataStore) {
        const electricityData = apiDataStore.electricityData;
        let datasets = [];
        let labels = []
        if (electricityData.physical_flow && electricityData.commercial_flow) {
            // Commercial Flow
            datasets.push({
                label: 'Scheduled commercial exchange (Sum)',
                type: 'line',
                data: electricityData.commercial_flow.map(item => { 
                    labels.push(item.dt);
                    return item.value 
                }),
                backgroundColor: this.mainColors.green,
                borderColor: this.mainColors.green
            });
            // Physcial Flow
            datasets.push({
                label: 'Physical flow (Sum)',
                type: 'line',
                data: electricityData.physical_flow.map(item => { return item.value }),
                backgroundColor: this.mainColors.amber,
                borderColor: this.mainColors.amber
            });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    weatherOverview (apiDataStore) {
        const weatherData = apiDataStore.weatherData;
        let datasets = [];
        let labels = [];
        if (weatherData.stations && weatherData.overall) {
            // Wind
            datasets.push({
                label: 'Wind',
                type: 'line',
                data: weatherData.overall.wind.map(item => { 
                    labels.push(item.dt);
                    return item.value 
                }),
                backgroundColor: this.mainColors.blue,
                borderColor: this.mainColors.blue
            })
            // Clouds
            datasets.push({
                label: 'Clouds',
                type: 'line',
                data: weatherData.overall.clouds.map(item => { return item.value }),
                backgroundColor: this.mainColors.red,
                borderColor: this.mainColors.red
            })
            // Temperature
            datasets.push({
                label: 'Temperature',
                type: 'line',
                data: weatherData.overall.temperature.map(item => { return item.value }),
                backgroundColor: this.mainColors.yellow,
                borderColor: this.mainColors.yellow
            })
            // Rain
            datasets.push({
                label: 'Rain',
                type: 'line',
                data: weatherData.overall.rain.map(item => { return item.value }),
                backgroundColor: this.mainColors.green,
                borderColor: this.mainColors.green
            })
            // Snow
            datasets.push({
                label: 'Snow',
                type: 'line',
                data: weatherData.overall.snow.map(item => { return item.value }),
                backgroundColor: this.mainColors.amber,
                borderColor: this.mainColors.amber
            })
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    clouds (apiDataStore) {
        const weatherData = apiDataStore.weatherData;
        let datasets = [];
        let labels = [];
        let $this = this;
        let totalClouds = new Array(24).fill(0);
        if (weatherData.stations && weatherData.stations.length > 0) {
            weatherData.stations.forEach((station, index) => {
                datasets.push({
                    label: station.name,
                    type: 'line',
                    showLine: false,
                    data: station.clouds.map((item, index) => { 
                        labels.push(item.dt);
                        totalClouds[index] += parseFloat(item.value);
                        return item.value 
                    }),
                    backgroundColor: $this.secondaryColors[index],
                    borderColor: $this.secondaryColors[index]
                });
            });
            datasets.push({
                label: 'Mean',
                type: 'line',
                data: totalClouds.map(item => { return (item/weatherData.stations.length).toFixed(2) }),
                backgroundColor: this.mainColors.red,
                borderColor: this.mainColors.red
            });
            labels = weatherData.stations[0].wind.map(item => { return item.dt });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    temperature (apiDataStore) {
        const weatherData = apiDataStore.weatherData;
        let datasets = [];
        let labels = [];
        let $this = this;
        let totalTemp = new Array(24).fill(0);
        if (weatherData.stations && weatherData.stations.length > 0) {
            weatherData.stations.forEach((station, index) => {
                datasets.push({
                    label: station.name,
                    type: 'line',
                    showLine: false,
                    data: station.temperature.map((item, index) => { 
                        totalTemp[index] += parseFloat(item.value); 
                        labels.push(item.dt);
                        return item.value 
                    }),
                    backgroundColor: $this.secondaryColors[index],
                    borderColor: $this.secondaryColors[index]
                });
            });
            datasets.push({
                label: 'Mean',
                type: 'line',
                data: totalTemp.map(item => { return (item/weatherData.stations.length).toFixed(2) }),
                backgroundColor: this.mainColors.yellow,
                borderColor: this.mainColors.yellow
            });
            labels = weatherData.stations[0].wind.map(item => { return item.dt });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    wind (apiDataStore) {
        const weatherData = apiDataStore.weatherData;
        let datasets = [];
        let labels = [];
        let $this = this;
        let totalWind = new Array(24).fill(0);
        if (weatherData.stations && weatherData.stations.length > 0) {
            weatherData.stations.forEach((station, index) => {
                datasets.push({
                    label: station.name,
                    type: 'line',
                    showLine: false,
                    data: station.wind.map((item, index) => { 
                        totalWind[index] += parseFloat(item.value); 
                        labels.push(item.dt);
                        return item.value 
                    }),
                    backgroundColor: $this.secondaryColors[index],
                    borderColor: $this.secondaryColors[index]
                });
            });
            datasets.push({
                label: 'Mean',
                type: 'line',
                data: totalWind.map(item => { return (item/weatherData.stations.length).toFixed(2) }),
                backgroundColor: this.mainColors.blue,
                borderColor: this.mainColors.blue
            });
            labels = weatherData.stations[0].wind.map(item => { return item.dt });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    rain (apiDataStore) {
        const weatherData = apiDataStore.weatherData;
        let datasets = [];
        let labels = [];
        let $this = this;
        let totalRain = new Array(24).fill(0);
        if (weatherData.stations && weatherData.stations.length > 0) {
            weatherData.stations.forEach((station, index) => {
                datasets.push({
                    label: station.name,
                    type: 'line',
                    showLine: false,
                    data: station.rain.map((item, index) => { 
                        totalRain[index] += parseFloat(item.value); 
                        labels.push(item.dt);
                        return item.value 
                    }),
                    backgroundColor: $this.secondaryColors[index],
                    borderColor: $this.secondaryColors[index]
                });
            });
            datasets.push({
                label: 'Mean',
                type: 'line',
                data: totalRain.map(item => { return (item/weatherData.stations.length).toFixed(2) }),
                backgroundColor: this.mainColors.green,
                borderColor: this.mainColors.green
            });
            labels = weatherData.stations[0].wind.map(item => { return item.dt });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    },


    snow (apiDataStore) {
        const weatherData = apiDataStore.weatherData;
        let datasets = [];
        let labels = [];
        let $this = this;
        let totalSnow = new Array(24).fill(0);
        if (weatherData.stations && weatherData.stations.length > 0) {
            weatherData.stations.forEach((station, index) => {
                datasets.push({
                    label: station.name,
                    type: 'line',
                    showLine: false,
                    data: station.snow.map((item, index) => { 
                        totalSnow[index] += parseFloat(item.value); 
                        labels.push(item.dt);
                        return item.value 
                    }),
                    backgroundColor: $this.secondaryColors[index],
                    borderColor: $this.secondaryColors[index]
                });
            });
            datasets.push({
                label: 'Mean',
                type: 'line',
                data: totalSnow.map(item => { return (item/weatherData.stations.length).toFixed(2) }),
                backgroundColor: this.mainColors.green,
                borderColor: this.mainColors.green
            });
            labels = weatherData.stations[0].wind.map(item => { return item.dt });
        }
        return {
            datasets: datasets,
            labels: labels
        };
    }

}