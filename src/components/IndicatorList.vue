<template>
    <div class="indicator-head" v-if="viewLoaded">
        <h2>{{ headline }}</h2>
        <SupportButton @supportButtonClicked="$emit('supportButtonClicked')" />
    </div>
    <div class="indicator-wrapper" v-if="viewLoaded">
        <div class="indicator" v-for="(item, index) in items" :key="`indicator-${index}`">
            <p class="indicator__number" :class="getNumberColor(item.value)">
                {{ parseFloat(item.value) >= 0 ? '+' : '' }}{{ item.value }}{{ prefix }}
            </p>
            <p class="indicator__name">
                {{ item.name }}
            </p>
        </div>
    </div>
</template>


<script>
import SupportButton from '@/components/SupportButton.vue';

export default {
    name: 'IndicatorList',
    emits: ['supportButtonClicked'],

    props: {
        prefix: String, // Unit to attach to each value
        viewLoaded: Boolean, // Boolean to indicate when to show content
        colorThresholds: Array, // Thresholds where the color of indicators should change
        headline: String
    },

    data () {
        return {
            items: []
        }
    },

    components: {
        SupportButton
    },

    methods: {

        render (items) {
            this.items = items;
        },


        getNumberColor (number) {
            if (this.colorThresholds.length === 2) {
                if (Math.abs(number) < this.colorThresholds[0]) {
                    return 'green';
                }
                else if (Math.abs(number) < this.colorThresholds[1]) {
                    return 'yellow'
                }
                else {
                    return 'red'
                }
            }
            return '';
        }

    }
}
</script>


<style lang="less">
@import '@/assets/less/setup';


.indicator {
    width: 23%;
    background: fade(@primary, 20%);
    padding: 1.1rem;
    border-radius: 10px;
    text-align: center;
    margin: 0.7rem 1%;
    border: solid 2px @primary;

    &-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        width: 94%;
        margin: 0 3% 7rem 3%;
    }

    &-head {
        width: 96%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4rem 3% 1rem 3%;
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