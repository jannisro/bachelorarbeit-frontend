<template>
    <nav class="tabs" v-if="viewLoaded">
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
        <BarChart 
                :ref="item.id" 
                :id="item.id" 
                :headline="item.headline ? item.headline : ''" 
                :viewLoaded="viewLoaded"
                @supportButtonClicked="$emit('supportButtonClicked', item.id)" />
    </div>
</template>

<script>
import BarChart from '@/components/BarChart.vue'

export default {
    name: 'ChartTabs',
    emits: ['supportButtonClicked'],

    data () {
        return {
            activeTab: null
        }
    },

    components: {
        BarChart
    },

    props: {
        items: Array,
        viewLoaded: Boolean
    },

    methods: {

        tabClicked (id) {
            this.activeTab = id;
        },


        render (chartData) {
            this.items.forEach(item => {
                this.$refs[item.id][0].render(chartData)
            });
        },


        setTimeOffset (offset) {
            this.items.forEach(item => {
                this.$refs[item.id][0].setTimeOffset(offset)
            });
        }
    },

    mounted () {
        this.activeTab = this.items[0].id;
    }
}
</script>

<style lang="less">
@import '@/assets/less/setup';

.tabs {
    width: 94%;
    margin: 0 0 0 3%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 3rem 0 0rem 4%;

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
        min-height: 90vh;

        &.active {
            display: block;
        }
    }
}
</style>