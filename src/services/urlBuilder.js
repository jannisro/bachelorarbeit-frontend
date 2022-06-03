export default {

    nationalDataUrl (countryCode, periodName, date) {
        return `/data/national/${countryCode}/${periodName}/${this.getFormattedDate(date)}`;
    },

    
    internationalDataUrl (countryCodes, periodName, date) {
        return `/data/international/${countryCodes[0]}/${countryCodes[1]}/${periodName}/${this.getFormattedDate(date)}`;
    },


    nationalElectricityApi(routeParams) {
        const base = `${process.env.VUE_APP_API_URL}/electricity/national`;
        return `${base}/${routeParams.countryCode}/${routeParams.timePeriodName}/${routeParams.date}`
    },


    internationalElectricityApi(routeParams) {
        const base = `${process.env.VUE_APP_API_URL}/electricity/international`;
        return `${base}/${routeParams.startCountry}/${routeParams.endCountry}/${routeParams.timePeriodName}/${routeParams.date}`
    },


    weatherDataApi(routeParams) {
        const base = `${process.env.VUE_APP_API_URL}/weather/national`;
        return `${base}/${routeParams.countryCode}/${routeParams.timePeriodName}/${routeParams.date}`
    },


    getFormattedDate (date) {
        const month = (date.getMonth()+1).toString().padStart(2, '0');
        const day = date.getDay().toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

}