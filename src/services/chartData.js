export default {

    primaryEnergyChart (electricityData) {
        let result = [];
        if (electricityData.generation && electricityData.load && electricityData.net_position && electricityData.price) {
            // Generation
            electricityData.generation.forEach(generationItem => {
                result.push({
                    name: generationItem.psr_type,
                    data: generationItem.hourly.map(item => { return item.value })
                })
            });
            // Load and Load forecast
            result.push({
                label: 'Actual Load',
                data: electricityData.load.map(item => { return item.value })
            });
            result.push({
                label: 'Forecasted Load',
                data: electricityData.load_forecast.map(item => { return item.value })
            });
            // Net Position
            result.push({
                label: 'Net Position',
                data: electricityData.net_position.map(item => { return item.value })
            });
            // Electricity Price
            result.push({
                label: 'Electricity Price',
                data: electricityData.price.map(item => { return item.value })
            });
        }
        return result;
    },

}