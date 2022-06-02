<template>
 <nav class="data-control">
    <div class="data-control__element">
        <router-link :to="previousUrl" class="data-control__arrow">
            <img src="@/assets/img/left.svg" alt="Previous">
        </router-link>
        <p class="data-control__text">
            {{ periodDisplayName }}
        </p>
        <router-link :to="nextUrl" class="data-control__arrow">
            <img src="@/assets/img/right.svg" alt="Next">
        </router-link>
    </div>
    <div>

        <select class="data-control__select" v-model="countryUrlSegment">
            <option :value="startCountry">
                <router-link :to="'/data/national/' + startCountry + '/' + periodName + '/' + date">
                    Nationwide
                </router-link>
            </option>
            <option v-for="border in borders" :key="border.code" :value="startCountry + '/' + border.code">
                <router-link :to="'/data/international/' + startCountry + '/' + border.code + '/' + periodName + '/' + date">
                    {{ startCountry }} &#129046; {{ border.name }}
                </router-link>
            </option>
        </select>

        <select class="data-control__select" v-model="periodNameModel">
            <option value="day">
                <router-link :to="'/data/' + area + '/' + countryUrlSegment + '/day/' + date">
                    Daily
                </router-link>
            </option>
            <option value="week">
                <router-link :to="'/data/' + area + '/' + countryUrlSegment + '/week/' + date">
                    Weekly
                </router-link>
            </option>
            <option value="month">
                <router-link :to="'/data/' + area + '/' + countryUrlSegment + '/month/' + date">
                    Monthly
                </router-link>
            </option>
            <option value="year">
                <router-link :to="'/data/' + area + '/' + countryUrlSegment + '/year/' + date">
                    Yearly
                </router-link>
            </option>
        </select>

    </div>
</nav>
</template>

<script>
export default {
    name: 'DataNavigation',
    data () {
        return {
            borders: [], // Available border relations, taken from API
            startCountry: null, // Code of the origin country
            endCountry: null, // Code of the target country if existing
            countryUrlSegment: null, // startCountry or 'startCountry/endCountry'
            periodNameModel: '' // same as props.periodName
        };
    },
    props: {
        countryCodes: Array, // [DE], [FR], [AT, IT],  ...
        periodName: String, // day, week, month or year
        date: String, // 2022-01-01, ...
        area: String, // national or international
        periodDisplayName: String, // January 2022, Week 42/2022, ...
        previousUrl: String, // http://localhost/...
        nextUrl: String // http://localhost/...
    },
    mounted () {
        this.periodNameModel = this.periodName;
        if (this.countryCodes.length === 1) {
            this.startCountry = this.countryUrlSegment = this.countryCodes[0];
        }
        else if(this.countryCodes.length === 2) {
            this.startCountry = this.countryCodes[0];
            this.endCountry = this.countryCodes[1];
            this.countryUrlSegment = `${this.countryCodes[0]}/${this.countryCodes[1]}`;
        }

        fetch(`${process.env.VUE_APP_API_URL}/country/${this.countryCodes[0]}/borders`)
            .then(response => response.json())
            .then(data => { this.borders = data.borders });
    }
}
</script>

<style lang="less" scoped>
@import '@/assets/less/setup.less';

.data-control {
    width: 94%;
    padding: 0.7rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    color: @light;
    margin: 2.3rem 0 2.3rem 3%;

    &__element {
        display: flex;
        align-items: flex-end;
    }

    &__arrow {
        background: none;
        border: none;
        margin: 0 1rem;
        transition: all 250ms;
        cursor: pointer;
        
        img {
            width: 0.6rem;
        }

        &:hover {
            opacity: 0.8;
        }
    }

    &__text {
        font-size: 1.4rem;
    }

    &__select {
        background: transparent;
        border: none;
        border-bottom: solid 1px @light;
        color: @light;
        font-size: 1.1rem;
        padding: 0.5rem 1rem;
        transition: all 250ms;

        option {
            background: @dark;
        }

        &:focus, &:hover {
            border-bottom: solid 1px @primary;
            background: fade(@light, 5%);
        }
    }
}
</style>