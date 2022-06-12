<template>
    <HeaderNavigation :country-selection-visible="false" />

    <div class="search">
        <SearchForm @searchStarted="startSearch" @resultsReceived="renderResults" />
        
        <div class="search__result" v-if="searchOngoing || results.length > 0 || error">


            <h2 class="search__headline" v-if="error">
                A server error occurred, please try to search again!
            </h2>

            <h2 class="search__headline">Results</h2>

            <LoadingSpinner v-if="searchOngoing" />

            <div class="search__result__list">
                <router-link 
                    v-for="(result, index) in results" 
                    :key="`result-${index}`" 
                    :to="getResultUrl(result)" 
                    class="search__result__item"
                >
                    {{ result.date }}, {{ result.countryName }}
                </router-link>
            </div>

        </div>
    </div>

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import SearchForm from '@/components/SearchForm.vue'
import urlBuilder from '@/services/urlBuilder';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
    name: 'SearchView',
    metaInfo: 'Search',

    components: {
        HeaderNavigation,
        SearchForm,
        LoadingSpinner
    },

    data () {
        return {
            results: [],
            error: false,
            searchOngoing: false
        }
    },

    methods: {

        renderResults (results, countries) {
            if (results && typeof results === typeof []) {
                for (let i = 0; i < results.length; i++) {
                    results[i].countryName = this.countryCodeToName(results[i].country, countries)
                }
                this.results = results;
            }
            else {
                this.error = true;
            }
            this.searchOngoing = false;
        },


        countryCodeToName (countryCode, countries) {
            for (let i = 0; i < countries.length; i++) {
                if (countries[i].code === countryCode) {
                    return countries[i].official_name;
                }
            }
            return countryCode;
        },


        startSearch () {
            this.searchOngoing = true;
        },


        getResultUrl(result) {
            return urlBuilder.getDataUrl([result.country], 'day', result.date);
        }

    }
}
</script>

<style lang="less">
@import '@/assets/less/setup';

.search {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    flex-wrap: wrap;

    &__result {
        margin: 2rem 2rem 2rem 4rem;
        width: 55%;
        min-width: 500px;
        max-width: 95%;

        &__list {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2rem;
        }

        &__item {
            width: 100%;
            background: fade(@light, 6%);
            color: #fff;
            text-decoration: none;
            padding: 0.8rem 1.2rem;
            margin: 0.3rem 0;
            border-radius: 5px;
            transition: all 250ms;

            &:hover {
                background: fade(@light, 20%);
            }
        }
    }

    &__headline {
        text-align: center;
    }
}

</style>