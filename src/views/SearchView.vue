<template>
    <HeaderNavigation :country-selection-visible="false" />

    <div class="search">
        <SearchForm />
        
        <div class="search__result" v-if="results.length > 0">
            <h2 class="search__headline">Results</h2>
            <router-link 
                v-for="(result, index) in results" 
                :key="`result-${index}`" 
                :to="getResultUrl(result)" 
                class="search__result__item">
                {{ result.date }}, {{ result.countryName }}
            </router-link>
        </div>
    </div>

</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import SearchForm from '@/components/SearchForm.vue'

export default {
    name: 'SearchView',
    metaInfo: 'Search',

    components: {
        HeaderNavigation,
        SearchForm
    },

    data () {
        return {
            results: []
        }
    }
}
</script>

<style lang="less">
@import '@/assets/less/setup';

.search {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    &__result {
        margin: 2rem 2rem 2rem 4rem;
    }

    &__headline {
        text-align: center;
    }
}

</style>