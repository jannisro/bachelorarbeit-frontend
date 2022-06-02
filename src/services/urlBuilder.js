export default {

    nationalDataUrl (countryCode, periodName, date) {
        return `/data/national/${countryCode}/${periodName}/${this.getFormattedDate(date)}`;
    },

    
    internationalDataUrl (countryCodes, periodName, date) {
        return `/data/international/${countryCodes[0]}/${countryCodes[1]}/${periodName}/${this.getFormattedDate(date)}`;
    },


    getFormattedDate (date) {
        const month = (date.getMonth()+1).toString().padStart(2, '0');
        const day = date.getDay().toString().padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

}