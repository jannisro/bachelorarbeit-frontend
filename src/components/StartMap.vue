<template>
    <div id="mapContainer"></div>

    <div id="popup">
        <p><b>{{countryName }}</b></p>
        <div v-if="current && current.data[countryCode]">
            <p v-if="currentValue(countryCode, 'net_position')">
                <small>Net Position: {{ currentValue(countryCode, 'net_position') }} MW</small>
            </p>
            <p v-if="currentValue(countryCode, 'wind')">
                <small>Wind Speed: {{ currentValue(countryCode, 'wind') }} m/s</small>
            </p>
            <p v-if="currentValue(countryCode, 'clouds')">
                <small>Cloudiness: {{ currentValue(countryCode, 'clouds') }}%</small>
            </p>
            <p v-if="currentValue(countryCode, 'temperature')">
                <small>Temperature: {{ currentValue(countryCode, 'temperature') }}°C</small>
            </p>
        </div>
    </div>

    <div class="bottom-box">
        <SupportButton @supportButtonClicked="showSupportModal" />
        <div id="currentDate">
            <span v-if="current && 'datetime' in current">
                Today, {{ utcToLocalTime(current.datetime) }}
            </span>
            <span v-else>
                Loading...
            </span>
        </div>
    </div>

    <SupportModal ref="supportModal" />
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import geoJson from "@/assets/countries.geo.json"
import countryCoords from '@/assets/countries.coords.json'
import urlBuilder from "@/services/urlBuilder"
import SupportButton from "@/components/SupportButton.vue"
import SupportModal from "@/components/SupportModal.vue"
import chartExplanations from "@/services/chartExplanations"

export default {
    name: 'StartMap',

    data() {
        return{
            center: [49.56, 12.261],
            initialZoom: 5,
            countryName: '',
            countryCode: '',
            current: null
    }},

    components: {
        SupportButton,
        SupportModal
    },

    methods: {

        setupLeafletMap: function () {
            const map = L.map("mapContainer").setView(this.center, this.initialZoom);
            this.loadMapTiles(map);
            this.loadGeoJson(map);
            this.loadCurrentData(map);
        },


        loadMapTiles (map) {
            L.tileLayer('https://api.mapbox.com/styles/v1/jnnsro/cl260qlqq000414p12nf0gupa/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiam5uc3JvIiwiYSI6ImNsMjYwbTE5MzAxN3MzZW5xamZmN2tya3IifQ.j8QdVH5b2Y2IK-tKroAvuA', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
        },


        loadGeoJson (map) {
            L.geoJSON(geoJson, {
                style: this.getMapStyle,
                onEachFeature: this.onEachFeature
            }).addTo(map);
        },


        loadCurrentData (map) {
            const app = this;
            fetch(`${process.env.VUE_APP_API_URL}/current`)
                .then(response => response.json())
                .then(data => { 
                    app.current = data;
                    app.displayCurrentData(map, data.data); 
                })
            map.on('zoomend', () => { app.manageTextLabels(map) });
        },


        displayCurrentData (map, data) {
            for (let code in countryCoords) {
                if (code in data) {
                    let html = '';
                    if (!isNaN(Math.round(data[code].net_position))) {
                        html += `<p class="${this.netPosClass(data[code].net_position)}">${Math.round(data[code].net_position)}</p>`;
                    }
                    if (!isNaN(data[code].wind) && !isNaN(data[code].clouds)) {
                        html += `<div class="flex align-items-center">
                            <img src='/weather-icons/${this.windIconName(code)}' class="wind-icon">
                            <img src='/weather-icons/${this.cloudIconName(code)}' class="cloud-icon">
                        </div>`;
                    }
                    this.displayMapOverlay(countryCoords[code], html, map);
                    this.manageTextLabels(map);
                }
            }
        },


        netPosClass (netPos) {
            return netPos >= 0 ? 'number-pos' : 'number-neg';
        },


        windIconName (countryCode) {
            if (this.currentValue(countryCode, 'wind') <= 1.5) {
                return 'windmill-1.svg';
            }
            else if (this.currentValue(countryCode, 'wind') <= 3.5) {
                return 'windmill-2.svg';
            }
            else if (this.currentValue(countryCode, 'wind') <= 5.5) {
                return 'windmill-3.svg';
            }
            else {
                return 'windmill-4.svg';
            }
        },


        cloudIconName (countryCode) {
            if (this.currentValue(countryCode, 'clouds') <= 25) {
                return 'sunny.svg';
            }
            else if (this.currentValue(countryCode, 'clouds') <= 50) {
                return 'partly_sunny.svg';
            }
            else if (this.currentValue(countryCode, 'clouds') <= 75) {
                return 'partly_cloudy.svg';
            }
            else {
                return 'cloudy.svg';
            }
        },


        displayMapOverlay (countryCoordProps, html, map) {
            L.marker(countryCoordProps.latLng, {
                icon: L.divIcon({
                    className: `text-labels level-${countryCoordProps.level}`,
                    html: html
                }),
                zIndexOffset: 1000
            }).addTo(map);
        },


        manageTextLabels (map) {
            if (map.getZoom() >= 7) {
                document.querySelectorAll('.text-labels').forEach(item => { item.style.display = 'block'; })
            }
            else if (map.getZoom() >= 5) {
                document.querySelectorAll('.text-labels.level-3').forEach(item => { item.style.display = 'none'; })
                document.querySelectorAll('.text-labels.level-1, .text-labels.level-2').forEach(item => { item.style.display = 'block'; })
            }
            else {
                document.querySelectorAll('.text-labels.level-2,.text-labels.level-3').forEach(item => { item.style.display = 'none'; })
                document.querySelectorAll('.text-labels.level-1').forEach(item => { item.style.display = 'block'; })
            }
        },
        

        getMapStyle () {
            return {
                fillColor: "#2196F3",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.3
            };
        },


        onEachFeature (feature, layer) {
            layer.on({
                mouseover: this.mouseOverCountry,
                mouseout: this.mouseOutCountry,
                click: this.countryClicked
            });
        },


        mouseOverCountry (e) {
            this.countryCode = e.target.feature.properties.code || '';
            this.countryName = e.target.feature.properties.name || '';
            this.togglePopup()
            e.target.setStyle({
                weight: 2,
                fillOpacity: 0.6
            });
        },


        mouseOutCountry (e) {
            this.togglePopup()
            e.target.setStyle({
                weight: 1,
                fillOpacity: 0.3
            });
        },


        countryClicked (e) {
            const code = e.target.feature.properties.code;
            if (code) {
                window.removeEventListener('mousemove', this.onMouseMove);
                let date = new Date();
                date.setDate(date.getDate() - 1);
                this.$router.push(urlBuilder.getDataUrl([code], 'day', date));
            }
        },


        togglePopup () {
            document.querySelector('#popup').classList.toggle('visible');
            window.addEventListener('mousemove', this.onMouseMove);
        },


        onMouseMove (e) {
            document.querySelector('#popup').style.marginTop = e.pageY + 'px';
            document.querySelector('#popup').style.marginLeft = e.pageX + 'px';
        },


        showSupportModal () {
            this.$refs.supportModal.show(chartExplanations.startMap())
        },


        currentValue (countryCode, fieldName) {
            if (this.current && 'data' in this.current && countryCode in this.current.data) {
                return Math.round(this.current.data[countryCode][fieldName]);
            }
            return false;
        },


        utcToLocalTime (utcDate) {
            let local = (new Date(utcDate));
            local.setHours(local.getHours() - local.getTimezoneOffset() / 60);
            return local.getHours() + ':' + local.getMinutes().toString().padStart(2, '0');
        }
    },

    mounted() {
        this.setupLeafletMap();
    }

}
</script>

<style lang="less">
@import '@/assets/less/setup';

#mapContainer { 
    width: 100%;
    height: 100vh; 
}

#popup {
    display: none;
    background: #fff;
    padding: 0.9rem 2rem;
    border-radius: 10px;
    box-shadow: 2px 2px 20px 0.3px fade(#000, 30%);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100000;
    color: #000;

    &.visible {
        display: block;
    }
}

.text-labels {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
}


.number-pos {
    color: #2E7D32;
}

.number-neg {
    color: #F44336;
}

.wind-icon {
    width: 1.4rem !important;
    margin-right: 0.3rem;
}

.cloud-icon {
    width: 1.6rem !important;
}

.bottom-box {
    bottom: 0;
    left: 0;
    margin: 0 0 1.5rem 1.5rem;
    z-index: 10000;
    position: fixed;
}

#currentDate {
    background: @primary;
    padding: 0.9rem 1.7rem;
    border-radius: 10px;
    font-size: 1.2rem;
    color: #fff;
    margin-top: 1.4rem;
}

</style>