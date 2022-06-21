export default {

    primaryEnergyData () {
        return {
            title: 'Primary Energy Data',
            caption: 'This chart displays the electricity generation, forecasted and actual load, the electricity spot price and the net position.',
            bullets: [
                'All data (including the load forecast) is fetched from the EntsoE',
                'The net position is calculated as the difference between total generation and total actual load',
                'The electricity price is the approximated spot price for an entire country to reflect intraday development and does not necessarily represent actual prices'
            ]
        }
    },

    generationChart () {
        return {
            title: 'Generation per Production type',
            caption: 'Shows the electricity generation per production type. ',
            bullets: [
                'All data is fetched from the EntsoE'
            ]
        }
    },

    secondaryEnergyData () {
        return {
            title: 'Commercial & Physical Exchange',
            caption: 'This chart shows the sum of traded and physical electricity flow. The exchange of certain border crossings can be viewed by selecting the respective border relation in the upper right corner.',
            bullets: [
                'Each result is calculated by summing up all exports and subtracting all imports',
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
    },


    energyIndicators () {
        return {
            title: 'Energy Indicators',
            caption: 'These numbers are displaying the percentual deviation of energy datapoints from the mean value.',
            bullets: [
                'Base value is the sum of an energy datapoint of the current time period',
                'Compared value is the mean of this datapoint over the last 30 days'
            ]
        }
    },


    searchForm () {
        return {
            title: 'Historic Value Search',
            caption: 'Search for past days by specifying a set of attribute values to be matched. Additionally, you can define the country and a time period to be searched for.',
            bullets: [
                'Search results are days which contain the passed values',
                'The commercial/physical flow and NTC are matched when an outgoing value matches the search',
                'You can click on each search result to view all data of the respective day',
                'Only the first 30 results are returned'
            ]
        }
    },


    startMap () {
        return {
            title: 'Geographical Overview',
            caption: 'This map shows all available countries and an overview of their current weather and electricity situation.',
            bullets: [
                'Click on a country to view all detailed data',
                'The green/red number on each country represents the electricity net position (difference between generation and load)',
                'The wind rotor indicates the wind average wind speed of each country',
                'The sun/cloud icon indicates the average cloudiness of each country',
                'Scroll in to view the weather icons and net positions of all countries'
            ]
        }
    }

}