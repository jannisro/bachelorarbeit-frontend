<template>
    <HeaderNavigation :countrySelectionVisible="false" active="start" />
    <StartMap />
</template>

<script>
import HeaderNavigation from '@/components/HeaderNavigation.vue'
import StartMap from '@/components/StartMap.vue'

export default {
    name: 'StartView',
    metaInfo: 'Start',

    components: {
        HeaderNavigation,
        StartMap,
    }
}
</script>