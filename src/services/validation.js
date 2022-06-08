export default {

    isValidCountry (countryCode) {
        return fetch(`${process.env.VUE_APP_API_URL}/country/${countryCode}`)
            .then(response => response.json())
            .then(data => { return data.valid_country });
    },


    isValidPeriodName (periodName) {
        const validValues = ['day', 'week', 'month', 'year'];
        return validValues.includes(periodName);
    },


    isValidDate (dateString) {
        return dateString ? dateString.match(/\d\d\d\d-\d\d-\d\d/gi) : false;
    }

}