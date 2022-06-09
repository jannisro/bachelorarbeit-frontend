<template>
    <div id="mapContainer"></div>
    <div id="popup">
        <p>{{countryName }}</p>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import geoJson from "@/assets/countries.geo.json"
import urlBuilder from "@/services/urlBuilder"

export default {
    name: 'StartMap',

    data() {
        return{
            center: [49.56, 12.261],
            initialZoom: 5,
            countryName: ''
    }},

    methods: {

        setupLeafletMap: function () {
            const map = L.map("mapContainer").setView(this.center, this.initialZoom);
            this.loadMapTiles(map);
            this.loadGeoJson(map);
        },


        loadMapTiles(map) {
            L.tileLayer('https://api.mapbox.com/styles/v1/jnnsro/cl260qlqq000414p12nf0gupa/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoiam5uc3JvIiwiYSI6ImNsMjYwbTE5MzAxN3MzZW5xamZmN2tya3IifQ.j8QdVH5b2Y2IK-tKroAvuA', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
        },


        loadGeoJson(map) {
            L.geoJSON(geoJson, {
                style: this.getMapStyle,
                onEachFeature: this.onEachFeature
            }).addTo(map);
        },


        getMapStyle() {
            return {
                fillColor: "#2196F3",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.3
            };
        },


        onEachFeature(feature, layer) {
            layer.on({
                mouseover: this.mouseOverCountry,
                mouseout: this.mouseOutCountry,
                click: this.countryClicked
            });
        },


        mouseOverCountry(e) {
            this.countryName = e.target.feature.properties.name || '';
            this.togglePopup()
            e.target.setStyle({
                weight: 2,
                fillOpacity: 0.6
            });
        },


        mouseOutCountry(e) {
            this.togglePopup()
            e.target.setStyle({
                weight: 1,
                fillOpacity: 0.3
            });
        },


        countryClicked(e) {
            const code = e.target.feature.properties.code;
            if (code) {
                window.removeEventListener('mousemove', this.onMouseMove);
                let date = new Date();
                date.setDate(date.getDate() - 1);
                this.$router.push(urlBuilder.getDataUrl([code], 'day', date));
            }
        },


        togglePopup() {
            document.querySelector('#popup').classList.toggle('visible');
            window.addEventListener('mousemove', this.onMouseMove);
        },


        onMouseMove(e) {
            document.querySelector('#popup').style.marginTop = e.pageY + 'px';
            document.querySelector('#popup').style.marginLeft = e.pageX + 'px';
        }
    },

    mounted() {
        this.setupLeafletMap();
    }

}
</script>

<style lang="less">
#mapContainer { 
    width: 100%;
    height: 100vh; 
}

#popup {
    display: none;
    background: #fff;
    padding: 0.9rem 2rem;
    border-radius: 10px;
    box-shadow: 2px 2px 20px 0.3px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100000;
    color: #000;

    &.visible {
        display: block;
    }
}
</style>