<template>
    <div class="indicator__wrapper">
        <div class="indicator" v-for="(item, index) in items" :key="`indicator-${index}`">
            <p class="indicator__number">
                {{ item.value }}
            </p>
            <p class="indicator__name">
                {{ item.name }}
            </p>
        </div>
    </div>
</template>


<script>
import { useApiDataStore } from '@/stores/apiDataStore';

export default {
    name: 'IndicatorList',

    setup () {
        const store = useApiDataStore();
        return {
            store
        }
    },

    data () {
        return {
            items: []
        }
    },

    props: {
        indicators: Array
    }
}
</script>


<style lang="less">
@import '@/assets/less/setup';


.indicator {
    width: 19%;
    background: fade(@primary, 20%);
    padding: 1.1rem;
    border-radius: 5px;
    text-align: center;
    margin: 0.7rem 1rem;
    border: solid 2px @primary;

    &-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        width: 94%;
        margin: 4rem 3% 6rem 3%;
    }

    &__number {
        font-size: 1.8rem;

        &.green {
            color: @green;
        }

        &.red {
            color: @red;
        }

        &.yellow {
            color: @amber;
        }
    }

    &__name {
        font-size: 0.96rem;
    }
}
</style>