<template>
    <div class="form">

        <div class="form__head">
            <span></span>
            <h2 class="form__headline">
                Search
            </h2>
            <SupportButton @supportButtonClicked="showSupportModal" />
        </div>

        <div class="form__segment">
            <p class="form__segment__headline" tooltip="Optionally limit the search to a specific country">
                Country:
            </p>
            <select id="country" class="form__control" v-model="countryModel">
                <option value="all">All</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">
                    {{ country.official_name }}
                </option>
            </select>
        </div>

        <div class="form__segment">
            <p class="form__segment__headline" tooltip="Optionally limit the search result to a specific time period">
                Time Period:
            </p>
            <div class="form__checkbox">
                <input type="checkbox" id="all_periods" v-model="allTimePeriods">
                <label for="all_periods" tooltip="Uncheck to select a certain time range">All</label>
            </div>
            <div class="form__group" v-if="!allTimePeriods">
                <Datepicker 
                    v-model="timePeriodModel" 
                    :enableTimePicker="false" 
                    :range="true"
                    format="yyyy-MM-dd" 
                    :autoApply="true" 
                    inputClassName="form__control"
                    :dark="true"
                    :hideInputIcon="true"
                    placeholder="Select Time Range"
                    id="period_start"
                />
            </div>
        </div>

        <div class="form__segment">
            <p class="form__segment__headline" tooltip="Select attributes to include in the search">
                Select attributes to search for:
            </p>
            <div class="form__group form__group--row">
                <button 
                    class="form__tag" 
                    v-for="field in getFieldsByActivity(false)" 
                    :key="`inactive-${field.code}`" 
                    @click="setFieldActivity(field.code, true)"
                >
                    <span class="form__tag__icon">+</span>
                    <span>{{ field.name }}</span>
                </button>
            </div>
            <div class="form__group">
                <div 
                    class="form__group form__group--row" 
                    v-for="field in getFieldsByActivity(true)" 
                    :key="`active-${field.name}`">
                    <button 
                        class="form__round-button" 
                        @click="setFieldActivity(field.code, false)" 
                        :tooltip="`Remove ${field.name} from your search`"
                    >
                        <img src="@/assets/img/close.svg" alt="Cross icon">
                    </button>
                    {{ field.name }}:
                    Between <input type="number" class="form__inline-control" v-model="fields[field.index].minRangeModel">{{ field.unit }}
                    and <input type="number" class="form__inline-control" v-model="fields[field.index].maxRangeModel">{{ field.unit }}
                </div>
            </div>
        </div>

        <div class="form__segment form__segment--center">
            <ButtonElement @click="fetchResults">
                Search
            </ButtonElement>
        </div>

    </div>

    <SupportModal ref="supportModal" />
</template>


<script>
import Datepicker from '@vuepic/vue-datepicker';
import SupportButton from '@/components/SupportButton.vue';
import SupportModal from '@/components/SupportModal.vue';
import'tooltipper/tooltipper';
import chartExplanations from '@/services/chartExplanations';
import ButtonElement from '@/components/ButtonElement.vue';

export default {
    name: 'SearchForm',
    emits: ['searchStarted', 'resultsReceived'],

    components: { 
        Datepicker,
        SupportButton,
        SupportModal,
        ButtonElement
    },

    data () {
        return {
            countries: [],
            countryModel: 'all',
            allTimePeriods: true,
            timePeriodModel: null,
            addFieldModel: 'generation',
            fields: [
                {
                    index: 0,
                    name: 'Generation',
                    code: 'total_generation',
                    unit: 'MW',
                    minRangeModel: 0,
                    maxRangeModel: 10000,
                    active: false
                },
                {
                    index: 1,
                    name: 'Load',
                    code: 'load',
                    unit: 'MW',
                    minRangeModel: 0,
                    maxRangeModel: 10000,
                    active: false
                },
                {
                    index: 2,
                    name: 'Load Forecast',
                    code: 'load_forecast',
                    unit: 'MW',
                    minRangeModel: 0,
                    maxRangeModel: 10000,
                    active: false
                },
                {
                    index: 3,
                    name: 'Electricity Price',
                    code: 'price',
                    unit: '€',
                    minRangeModel: 0,
                    maxRangeModel: 300,
                    active: false
                },
                {
                    index: 4,
                    name: 'Net Position',
                    code: 'net_position',
                    unit: 'MW',
                    minRangeModel: -1000,
                    maxRangeModel: 1000,
                    active: false
                },
                {
                    index: 5,
                    name: 'Commercial Flow',
                    code: 'commercial_flow',
                    unit: 'MW',
                    minRangeModel: 0,
                    maxRangeModel: 1000,
                    active: false
                },
                {
                    index: 6,
                    name: 'Physical Flow',
                    code: 'physical_flow',
                    unit: 'MW',
                    minRangeModel: 0,
                    maxRangeModel: 1000,
                    active: false
                },
                {
                    index: 7,
                    name: 'NTC',
                    code: 'net_transfer_capacity',
                    unit: 'MW',
                    minRangeModel: 0,
                    maxRangeModel: 1000,
                    active: false
                },
                {
                    index: 8,
                    name: 'Temperature',
                    code: 'temperature',
                    unit: '°C',
                    minRangeModel: 0,
                    maxRangeModel: 20,
                    active: false
                },
                {
                    index: 9,
                    name: 'Wind',
                    code: 'wind',
                    unit: 'm/s',
                    minRangeModel: 0,
                    maxRangeModel: 10,
                    active: false
                },
                {
                    index: 10,
                    name: 'Clouds',
                    code: 'clouds',
                    unit: '%',
                    minRangeModel: 0,
                    maxRangeModel: 100,
                    active: false
                },
                {
                    index: 11,
                    name: 'Rain',
                    code: 'rain',
                    unit: 'mm',
                    minRangeModel: 0,
                    maxRangeModel: 10,
                    active: false
                },
                {
                    index: 12,
                    name: 'Snow',
                    code: 'snow',
                    unit: 'mm',
                    minRangeModel: 0,
                    maxRangeModel: 10,
                    active: false
                }
            ]
        }
    },


    methods: {

        getFieldsByActivity (activity) {
            let result = []
            this.fields.forEach(field => { field.active === activity ? result.push(field) : null });
            return result;
        },

        addField () {
            console.log(this.addFieldModel)
            this.setFieldActivity(this.addFieldModel, true);
        },


        setFieldActivity (fieldCode, activity) {
            for (let i = 0; i < this.fields.length; i++) {
                if (this.fields[i].code === fieldCode) {
                    this.fields[i].active = activity;
                }
            }
        },


        showSupportModal () {
            this.$refs.supportModal.show(chartExplanations['searchForm']());
        },


        fetchResults () {
            this.$emit('searchStarted');
            console.log(`${process.env.VUE_APP_API_URL}/search?${this.buildQueryFromModels()}`)
            fetch(`${process.env.VUE_APP_API_URL}/search?${this.buildQueryFromModels()}`)
                .then(response => response.json())
                .then(data => { this.$emit('resultsReceived', data.results, this.countries); })
        },


        buildQueryFromModels () {
            let query = [];
            if (!this.allTimePeriods) {
                const from = this.timePeriodModel[0];
                const to = this.timePeriodModel[1];
                query.push(`period_start=${from.getFullYear()}-${from.getMonth()+1}-${from.getDate()}`);
                query.push(`period_end=${to.getFullYear()}-${to.getMonth()+1}-${to.getDate()}`);
            }
            if (this.countryModel !== 'all') {
                query.push(`country=${this.countryModel}`);
            }
            this.fields.forEach(field => {
                if (field.active) {
                    query.push(`${field.code}_start=${field.minRangeModel}`);
                    query.push(`${field.code}_end=${field.maxRangeModel}`);
                }
            });
            return query.join('&');
        }

    },


    mounted () {
        fetch(`${process.env.VUE_APP_API_URL}/country`)
            .then(response => response.json())
            .then(data => { this.countries = data.countries ? data.countries : [] })
    }

}
</script>


<style lang="less">
@import '@/assets/less/setup';

.form {
    width: 30%;
    min-width: 480px;
    max-width: 95%;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2px 2px 30px 0 rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    padding: 1.7rem 0;
    margin: 2rem;

    &__head {
        width: 100%;
        padding: 0 3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__segment {
        width: 100%;
        padding: 1.8rem 3rem;
        border-bottom: solid 1px rgba(255, 255, 255, 0.2);

        &:last-of-type {
            border-bottom: none;
        }

        &--center {
            display: flex;
            justify-content: center;
        }

        &__headline {
            font-size: 1.1rem;
            cursor: default;
        }
    }

    &__headline {
        text-align: center;
    }

    &__group {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0.7rem 0;

        &--row {
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
        }
    }

    &__control {
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: solid 2px @primary;
        padding: 0.5rem 1rem;
        color: @light;
        margin-top: 0.6rem;
        transition: all 250ms;

        &:hover, &:focus {
            background: fade(@primary, 20%);
        }
    }

    &__inline-control {
        background: transparent;
        border: none;
        border-bottom: solid 2px rgba(255, 255, 255, 0.8);
        padding: 0.1rem 0rem 0.1rem 0.3rem;
        width: 4rem;
        color: #fff;
        margin: 0 0.1rem 0 0.4rem;
    }

    &__checkbox {
        width: 100%;
        margin: 0.8rem 0;
        text-align: left;

        input {
            margin-right: 0.3rem;
        }
    }

    &__round-button {
        background: transparent;
        border: solid 2px @primary;
        width: 1.9rem;
        height: 1.9rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        cursor: pointer;
        transition: all 250ms;
        color: @light;
        font-size: 1.6rem;
        margin: 0 0.6rem;

        &:hover {
            background: fade(@primary, 20%);
            border: solid 2px @primary;
        }

        img {
            width: 0.9rem;
        }
    }

    &__tag {
        background: fade(@primary, 80%);
        color: @light;
        font-size: 0.83rem;
        border: none;
        border-radius: 10px;
        margin: 0 0.5rem 0.5rem 0;
        padding: 0.1rem 0.6rem;
        transition: all 250ms;

        &:hover {
            background: fade(@primary, 100%);
        }

        &__icon {
            font-size: 1rem;
            margin-right: 0.3rem
        }
    }
}
</style>