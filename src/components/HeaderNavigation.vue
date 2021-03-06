<template>
    <header class="header">

        <!-- Back to Start -->
        <nav>
            <router-link to="/" class="header__link">
                &larr;
                Back to Map
            </router-link>
        </nav>

        
        <!-- Page Sections -->
        <div>
            <button v-for="item in navigationSteps" :key="item.url" class="header__section-link" @click="scrollToSection(item.url)">
                {{ item.name }}
            </button>
        </div>


        <!-- Search and country selection -->
        <nav class="header__nav"> 

            <ButtonElement href="/search">
                <img src="@/assets/img/search.svg" alt="Search icon">
                Search
            </ButtonElement>

            <select 
                    class="button header__country" 
                    v-if="countrySelectionVisible" 
                    v-model="selectedCountryCode"
                    @change="redirectCountry">
                <option 
                        v-for="country in countries" 
                        :key="country.code" 
                        :value="country.code">
                        {{ country.short_name }}
                </option>
            </select>

        </nav>

    </header>
</template>

<script>
import urlBuilder from '@/services/urlBuilder.js';
import ButtonElement from '@/components/ButtonElement.vue';

export default {
    name: 'HeaderNavigation',

    components: {
        ButtonElement
    },

    data () {
        return {
            countries: [],
            selectedCountryCode: ''
        }
    },

    props: {
        countrySelectionVisible: Boolean,
        selectedCountry: String,
        navigationSteps: Array // [ {name: X, url: Y}, ... ]
    },

    methods: {


        redirectCountry () {
            let date = new Date();
            let periodName = 'day';
            if (this.$route.params.timePeriodName && this.$route.params.date) {
                date = this.$route.params.date
                periodName = this.$route.params.timePeriodName
            }
            this.$router.push(urlBuilder.getDataUrl([this.selectedCountryCode], periodName, date))
        },


        scrollToSection (url) {
            window.scrollTo(0, parseInt(document.querySelector(`[name="${url}"]`).offsetTop))
        }

    },

    mounted() {
        this.selectedCountryCode = this.selectedCountry

        fetch(`${process.env.VUE_APP_API_URL}/country`)
            .then(response => response.json())
            .then(data => { this.countries = data.countries });
    }

}
</script>

<style lang="less">
@import '@/assets/less/setup';

.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 1rem;
    background: @dark;
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: 1px 1px 14px 0 fade(#000, 60%);
    z-index: 10000;

    &--fixed {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100000;
    }

    &__link {
        text-decoration: none;
        color: @light;
        padding-bottom: 0.2rem;
        margin-right: 1rem;
        transition: all 250ms;
        font-size: 1.1rem;

        &:hover, &.router-link-active {
            color: @primary;
        }
    }

    &__nav {
        display: flex;
        align-items: center;
    }

    &__search {
        display: flex;
        align-items: center;
        margin-right: 1.3rem;
    }

    &__country {
        margin-left: 0.8rem;
        
        option {
            background: @dark;
        }
    }
    
    &__section-link {
        background: none;
        border: none;
        cursor: pointer;
        color: #fff;
        padding: 0.3rem 0.7rem;
        transition: all 250ms;
        border-bottom: solid 2px @light;
        font-size: 0.98rem;

        &:hover, &.active {
            color: @primary;
            border-bottom: solid 2px @primary;
        }
    }
}


html.light .header {
    &__link {
        color: #000;
    }
    &__country {
        option {
            background: @light;
        }
    }
}
</style>
