export default {

    primaryEnergyData () {
        return {
            title: 'Primary Energy Data',
            caption: 'This chart displays the electricity generation per production type, forecasted and actual load, the electricity spot price and the net position.',
            bullets: [
                'All data (including the load forecast) is fetched from the EntsoE',
                'The net position is calculated as the difference between total generation and total actual load',
                'The electricity price is the approximated spot price for an entire country to reflect intraday development and does not necessarily represent actual prices'
            ]
        }
    },

    secondaryEnergyData () {
        return {
            title: 'Commercial & Physical Exchange',
            caption: 'This chart shows the sum of traded and physical electricity flow. The exchange of certain border crossings can be viewed by going to the respective border view (click on nationwide in the upper right corner and select a crossing)',
            bullets: [
                'The commercial exchange is the sum of all traded electricity',
                'The physical flow represents the sum of the actual exchanged electricity load',
                'All data is fetched from the EntsoE'
            ]
        }
    },

    weatherOverview () {
        return {
            title: 'Relative weather deviation',
            caption: 'Shows the percentual deviation of five weather indicators from their overall mean values. Lower values ([-10%, 10%]) indicate a regular weather conditions while higher values (<-10%, >10%) indicate extraordinary weather conditions.',
            bullets: [
                'All data is fetched from OpenWeatherMap',
                'Current and future values are forecasted'
            ]
        }
    },

    clouds () {
        return {
            title: 'Relative cloudiness',
            caption: 'This chart displays the relative amount of clouds on the sky. The higher the amount, the less solar radiation reaches the surface.',
            bullets: [
                'All data is fetched from OpenWeatherMap',
                'Current and future values are forecasted',
                'The scatter plot shows an entry for each location per time step, while the line shows the overall mean'
            ]
        }
    },

    temperature () {
        return {
            title: 'Temperature',
            caption: 'Shows the absolute temperature in °C per location and time step.',
            bullets: [
                'All data is fetched from OpenWeatherMap',
                'Current and future values are forecasted',
                'The scatter plot shows an entry for each location per time step, while the line shows the overall mean'
            ]
        }
    },

    wind () {
        return {
            title: 'Wind',
            caption: 'Displays the absolute wind speed in m/s per location and time step.',
            bullets: [
                'All data is fetched from OpenWeatherMap',
                'Current and future values are forecasted',
                'The scatter plot shows an entry for each location per time step, while the line shows the overall mean'
            ]
        }
    },

    rain () {
        return {
            title: 'Rain',
            caption: 'This chart shows the absolute rain precipitation intensity in mm/hour per location and time step.',
            bullets: [
                'All data is fetched from OpenWeatherMap',
                'Current and future values are forecasted',
                'The scatter plot shows an entry for each location per time step, while the line shows the overall mean',
                'Snow amounts are displayed in a separate diagram'
            ]
        }
    },

    snow () {
        return {
            title: 'Snow',
            caption: 'This chart displays the absolute snow precipitation intensity in mm/hour per location and time step.',
            bullets: [
                'All data is fetched from OpenWeatherMap',
                'Current and future values are forecasted',
                'The scatter plot shows an entry for each location per time step, while the line shows the overall mean',
            ]
        }
    },

    primaryBorderCrossingData () {
        return {
            title: 'Border Crossing Data',
            caption: 'This chart shows data of a certain border relation.',
            bullets: [
                'The commercial flow is the sum of electrity traded over this border crossing',
                'The physical flow represents the actual exchanged load',
                'The net transfer capacity (NTC) shows the calculated limit of physical flow being exchanged over this border crossing',
                'All data is fetched from the EntsoE'
            ]
        }
    },

    reversedBorderCrossingData () {
        return this.primaryBorderCrossingData();
    }

}