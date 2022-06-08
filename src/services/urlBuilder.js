export default {

    getDataUrl (countryCodes, periodName, date) {
        const dateSegment = (typeof date === 'string') ? date : this.getFormattedDate(date);
        if (countryCodes.length === 1) {
            return `/data/national/${countryCodes[0]}/${periodName}/${dateSegment}`;
        }
        else if (countryCodes.length > 1) {
            return `/data/international/${countryCodes[0]}/${countryCodes[1]}/${periodName}/${dateSegment}`;
        }
    },

    nationalElectricityApi(routeParams) {
        const base = `${process.env.VUE_APP_API_URL}/electricity/national`;
        return `${base}/${routeParams.countryCode}/${routeParams.timePeriodName}/${routeParams.date}`
    },


    internationalElectricityApi(routeParams) {
        const base = `${process.env.VUE_APP_API_URL}/electricity/international`;
        return `${base}/${routeParams.startCountryCode}/${routeParams.endCountryCode}/${routeParams.timePeriodName}/${routeParams.date}`
    },


    weatherDataApi(routeParams) {
        const base = `${process.env.VUE_APP_API_URL}/weather/national`;
        return `${base}/${routeParams.countryCode}/${routeParams.timePeriodName}/${routeParams.date}`
    },


    getFormattedDate (date) {
        if (!(date instanceof Date)) date = new Date(date);
        const month = (date.getMonth()+1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

}