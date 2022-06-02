<template>
    <h2 class="chart-headline">
        {{ headline }}
    </h2>

    <nav class="tabs">
        <button 
                class="tabs__trigger" 
                v-for="item in items" 
                :class="{ active: activeTab === item.id }" 
                :key="item.id" 
                @click="tabClicked(item.id)">
            {{ item.title }}
        </button>
    </nav>

    <div class="tabs__content" v-for="item in items" :class="{ active: activeTab === item.id }" :key="item.id">
        {{ item.id }}
        <BarChart :headline="false" :id="item.id" />
    </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue'

export default {
    name: 'ChartTabs',

    data () {
        return {
            activeTab: null
        }
    },

    components: {
        BarChart
    },

    props: {
        items: Array
    },

    methods: {

        tabClicked (id) {
            this.activeTab = id;
        }
    },

    mounted () {
        this.activeTab = this.items[0].id;
    }
}
</script>

<style lang="less" scoped>
@import '@/assets/less/setup';

.tabs {
    width: 94%;
    margin: 0 0 0 3%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;

    &__trigger {
        background: transparent;
        border: none;
        padding: 0.6rem 1rem;
        color: @light;
        border-bottom: solid 2px @light;
        font-size: 1.05rem;
        
        &:not(.active):hover {
            border-bottom: solid 2px @primary;
            background: fade(@primary, 20%);
        }

        &.active {
            background: @primary;
            border-bottom: solid 2px @primary
        }
    }

    &__content {
        display: none;

        &.active {
            display: block;
        }
    }
}
</style>