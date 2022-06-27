<template>
 <nav class="data-control">

    <!-- Datepicker and Timezone -->
    <div class="flex align-items-center">

        <!-- Datepicker -->
        <router-link :to="previousUrl" class="data-control__arrow" :tooltip="`Go to previous ${periodName}`">
            <img src="@/assets/img/left.svg" alt="Previous">
        </router-link>
        <div>
            <Datepicker 
                v-model="dateModel" 
                :enableTimePicker="false" 
                :placeholder="periodName" 
                format="yyyy-MM-dd" 
                :autoApply="true" 
                :hideInputIcon="true"
                inputClassName="data-control__datepicker"
                :dark="true"
                @update:modelValue="redirectDataView" />
        </div>
        <router-link :to="nextUrl" class="data-control__arrow" :tooltip="`Go to next ${periodName}`">
            <img src="@/assets/img/right.svg" alt="Next">
        </router-link>

        <!-- Timezone -->
        <div class="ml-2" v-if="periodName === 'day'">
            <span tooltip="All data is shown in this timezone">Timezone:</span>
            <select class="data-control__select timezone" v-model="selectedTimezoneIndex" @change="$emit('timezoneChanged', timezones[selectedTimezoneIndex].offset)">
                <option v-for="(timezone, index) in timezones" :value="index" :key="index">
                    {{ timezone.name }} ({{ localTime(currentTime, timezone.offset) }})
                </option>
            </select>
        </div>

    </div>


    <!-- Page Sections -->
    <div>
        <a v-for="item in navigationSteps" :key="item.url" :href="`#${item.url}`" class="data-control__section-link">
            {{ item.name }}
        </a>
    </div>


    <!-- Border relation and time period -->
    <div>

        <!-- Border relation -->
        <select class="data-control__select" v-model="borderRelationModel" @change="redirectBorderRelation">
            <option :value="startCountry">
                Nationwide
            </option>
            <option v-for="border in borders" :key="border.code" :value="border.code">
                {{ startCountry }} &#10231; {{ border.name }}
            </option>
        </select>

        <!-- Time period -->
        <select class="data-control__select" v-model="periodNameModel" @change="redirectDataView">
            <option value="day">
                Daily
            </option>
            <option value="month">
                Monthly
            </option>
            <option value="year">
                Yearly
            </option>
        </select>

    </div>
</nav>
</template>

<script>
import urlBuilder from '@/services/urlBuilder';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    name: 'DataNavigation',
    emits: ['timezoneChanged'],

    components: { Datepicker },

    data () {
        return {
            borders: [], // Available border relations, taken from API
            startCountry: null, // Code of the origin country
            endCountry: null, // Code of the target country if existing
            borderRelationModel: null, // targetCountry
            periodNameModel: '', // same as props.periodName
            dateModel: null, // same as props.date
            timezones: [
                { name: 'UTC/GMT', offset: 0 },
                { name: 'UTC+1', offset: 1 },
                { name: 'UTC+2', offset: 2 },
                { name: 'UTC+3', offset: 3 }
            ],
            selectedTimezoneIndex: 0, // UTC, CEST, CET, EEST, ...
            currentTime: new Date() // Refreshs every 15sec
        };
    },

    props: {
        countryCodes: Array, // [DE], [FR], [AT, IT],  ...
        periodName: String, // day, week, month or year
        date: String, // 2022-01-01, ...
        periodDisplayName: String, // January 2022, Week 42/2022, ...
        previousUrl: String, // http://localhost/...
        nextUrl: String, // http://localhost/...
        navigationSteps: Array // [ {name: X, url: Y}, ... ]
    },

    methods: {

        redirectDataView () {
            this.$router.push(urlBuilder.getDataUrl(this.countryCodes, this.periodNameModel, this.dateModel));
        },


        redirectBorderRelation () {
            // Switch to national mode
            if (this.borderRelationModel === this.startCountry) {
                this.$router.push(
                    urlBuilder.getDataUrl(
                        [this.startCountry], 
                        this.periodName, 
                        this.date
                    )
                );
            }
            // Switch to international mode
            else {
                this.$router.push(
                    urlBuilder.getDataUrl(
                        [this.startCountry, this.borderRelationModel], 
                        this.periodName, 
                        this.date
                    )
                );
            }
        },


        localTime (currentTime, offset) {
            // create Date object for current location
            let utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
            let localDate = new Date(utc + (3600000*offset));
            return `${localDate.getHours().toString().padStart(2, '0')}:${localDate.getMinutes().toString().padStart(2, '0')}`;
        }

    },

    mounted () {
        this.periodNameModel = this.periodName;
        this.dateModel = this.date;
        window.setInterval(() => { this.currentTime = new Date() }, 10000);

        if (this.countryCodes.length === 1) {
            this.startCountry = this.borderRelationModel = this.countryCodes[0];
        }
        else if(this.countryCodes.length === 2) {
            this.startCountry = this.countryCodes[0];
            this.endCountry = this.countryCodes[1];
            this.borderRelationModel = this.countryCodes[1];
        }
        
        fetch(`${process.env.VUE_APP_API_URL}/country/${this.countryCodes[0]}/borders`)
            .then(response => response.json())
            .then(data => { this.borders = data.borders });
    }

}
</script>

<style lang="less">
@import '@/assets/less/setup';

.data-control {
    width: 94%;
    padding: 0.7rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    color: @light;
    margin: 2.3rem 0 2.3rem 3%;

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

    &__datepicker {
        background-color: fade(@light, 6%) !important;
        font-size: 1.24rem !important;
        border: none !important;
        border-radius: 10px !important;
    }

    &__select {
        background: transparent;
        border: none;
        border-bottom: solid 1px @light;
        color: @light;
        font-size: 1.05rem;
        padding: 0.5rem 1rem;
        transition: all 250ms;

        option {
            background: @dark;
        }

        &.timezone {
            font-size: 0.95rem;
            padding: 0.4rem 0.5rem;
        }

        &:focus, &:hover {
            border-bottom: solid 1px @primary;
            background: fade(@light, 5%);
        }
    }

    &__section-link {
        text-decoration: none;
        color: #fff;
        padding: 0.3rem 0.7rem;
        transition: all 250ms;
        border-bottom: solid 2px @light;
        font-size: 0.98rem;

        &:hover {
            background: fade(@primary, 10%);
            border-bottom: solid 2px @primary;
        }
    }
}
</style>