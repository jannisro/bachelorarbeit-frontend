<template>
    <header class="header">

        <nav>
            <router-link to="/" class="header__link">
                Start
            </router-link>
            <router-link to="/help" class="header__link">
                Help
            </router-link>
        </nav>

        <nav class="header__nav"> 
            <router-link to="/search" class="button header__search" :class="{ active: active === 'search' }">
                <img src="@/assets/img/search.svg" alt="Search icon">
                Search
            </router-link>
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

export default {
    name: 'HeaderNavigation',

    data () {
        return {
            countries: [],
            selectedCountryCode: ''
        }
    },

    props: {
        countrySelectionVisible: Boolean,
        active: String,
        selectedCountry: String
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
        }

    },

    mounted() {
        this.selectedCountryCode = this.selectedCountry
        fetch(`${process.env.VUE_APP_API_URL}/country`)
            .then(response => response.json())
            .then(data => { this.countries = data.countries })
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
    background: transparent;

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

        &--active {
            border-bottom: solid 1px;
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
        option {
            background: @dark;
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
