export default {

    primaryEnergyIndicators (electricityData) {
        const requiredKeys = ['load', 'total_generation', 'net_position', 'commercial_flow', 'physical_flow', 'mean_values'];
        if (this.validate(electricityData, requiredKeys)) {
            return [
                {
                    name: 'Load Deviation',
                    value: this.deviationFromMean(electricityData.load, electricityData.mean_values.load)
                },
                {
                    name: 'Generation Deviation',
                    value: this.deviationFromMean(electricityData.total_generation, electricityData.mean_values.generation)
                },
                {
                    name: 'Net Position Deviation',
                    value: this.deviationFromMean(electricityData.net_position, electricityData.mean_values.net_position)
                },
                {
                    name: 'Commercial Flow Deviation',
                    value: this.deviationFromMean(electricityData.commercial_flow, electricityData.mean_values.commercial_flow)
                },
                {
                    name: 'Physical Flow Deviation',
                    value: this.deviationFromMean(electricityData.physical_flow, electricityData.mean_values.physical_flow)
                },
                {
                    name: 'Electricity Price Deviation',
                    value: this.deviationFromMean(electricityData.price, electricityData.mean_values.price)
                }
            ]
        }
        return [];
    },


    validate(dataset, requiredKeys) {
        requiredKeys.forEach(key => {
            if (!Object.keys(dataset).includes(key)) {
                return false;
            }
        });
        return true;
    },


    deviationFromMean(datarow, mean) {
        if (mean === 0) mean = 0.001;
        const mappedRow = datarow.map(item => { return parseFloat(item.value) });
        const decimalResult = mappedRow.reduce((pv, cv) => pv + cv, 0) / parseFloat(mean);
        const percentualResult = (decimalResult - 1) * 100;
        return Math.round(percentualResult * 100) / 100;
    }

}