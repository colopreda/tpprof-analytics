<template>
    <div v-if="hasfilters()" class="filters-container">
        <div class="row">
            <div class="col-sm filter" v-for="filter in filters">
                <label v-if="filter.forced" id="filter-label-forced" v-visible="!isMainValue(filter)">{{ filter.label }}</label>
                <label v-else id="filter-label" v-visible="!isMainValue(filter)">{{ getMainValue(filter) }}</label>
                <b-form-select v-if="filter.type === 'dropdown'" v-bind:key="filter.name" v-model="selectedState[filter.name]" v-on:change="checkUpdateType(filter.dynamic, originalData)" :options="filter.options"></b-form-select>
                <div id="minmax" class="row" v-else-if="filter.type === 'minmax'">
                    <label>{{ filter.label }}</label>
                    <b-form-input id="left-input" class="col-sm" v-model="selectedState[filter.name].min" placeholder="Min"></b-form-input>
                    <b-form-input class="col-sm" v-model="selectedState[filter.name].max" placeholder="Max"></b-form-input>
                </div>
            </div>
            <div class="button-ctr">
                <b-button v-if="showApplyButton(filters)" class="filter" v-on:click="applyfilters(originalData)">Apply</b-button>
                <b-button class="filter" style="margin-left: 10px!important;" v-on:click="resetChart()">Reset</b-button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    function hasFixedValue (filter) {
        return (filter.type === 'dropdown');
    }

    function parseQueryParams(queryParams, filterUrl) {
        return filterUrl.replace(/&references=[^&]*/, "&references=" + Object.keys(queryParams).map(key => queryParams[key]).join(','));
    }

    function isForced(filter) {
        return filter.forced;
    }

    export default {
        name: "Filters",
        props: {
            filters: Array,
            originalData: Array,
            filterUrl: String
        },
        created() {
            for (let item of this.filters) {
                this.$set(this.selectedState, item.name, item.selected);
            }
        },
        data() {
            return {
                selectedState: {}
            }
        },
        watch: {
            originalData: function (newVal, oldVal) {
                if (newVal.length > 0) {
                    this.updateChartStatic(newVal);
                }
            }
        },
        methods: {
            hasfilters: function () {
                return this.filters.length > 0;
            },
            showApplyButton: function (filters) {
                let apply = false;
                for (let item of filters) {
                    if (!hasFixedValue(item)) {
                        apply = true;
                    }
                }
                return apply;
            },
            checkUpdateType: function (dynamic, data) {
                if (dynamic) {
                    this.updateChartDynamic(data);
                } else {
                    this.updateChartStatic(data)
                }
            },
            isMainValue: function (filter) {
                return !(hasFixedValue(filter) && (
                    (this.selectedState[filter.name] !== filter.options[0].value && filter.options[0].value !== undefined)
                    ||
                    (this.selectedState[filter.name] !== filter.options[0] && filter.options[0].value === undefined)
                    ||
                    (filter.forced !== undefined && filter.forced)
                ));
            },
            updateChartStatic: function (data) {
                let parsedData = data;
                let filterValue;
                for (let i = 0; i < this.filters.length; i++) {
                    const filter = this.filters[i];
                    // TODO Pensar forma menos villera de hacer esto
                    if (!this.isMainValue(filter)) {
                        if (!filter.main) {
                            parsedData = parsedData.filter(item => {
                                return item[filter.name] !== null && item[filter.name].toString() === this.selectedState[filter.name].toString();
                            });
                        } else {
                            filterValue = this.selectedState[filter.name];
                        }
                    }
                }
                this.$emit('filtered', parsedData, filterValue);
            },
            setInitialValue: function (i) {
                if (this.filters[i].options[0].value === undefined) {
                    this.selectedState[this.filters[i].name] = this.filters[i].options[0];
                } else {
                    this.selectedState[this.filters[i].name] = this.filters[i].options[0].value;
                }
            },
            getMainValue: function (filter) {
                if (filter.options[0].text === undefined) {
                    return filter.options[0];
                } else {
                    return filter.options[0].text;
                }
            },
            resetChart: function () {
                let parsedData = this.originalData;
                for (let i = 0; i < this.filters.length; i++) {
                    if (isForced(this.filters[i]) || hasFixedValue(this.filters[i])) {
                        this.setInitialValue(i);
                    } else {
                        this.setEmptyInput(i);
                    }
                }
                this.applyfilters(parsedData);
            },
            applyfilters: function (data) {
                let parsedData = data;
                for (let i = 0; i < this.filters.length; i++) {
                    const filter = this.filters[i];
                    if (!hasFixedValue(filter)) {
                        parsedData = parsedData.filter(item => {
                            if (this.selectedState[filter.name].min === '' && this.selectedState[filter.name].max === '') {
                                return true;
                            } else if (this.selectedState[filter.name].min === '') {
                                return item[filter.name] < this.selectedState[filter.name].max;
                            } else if (this.selectedState[filter.name].max === '') {
                                return item[filter.name] > this.selectedState[filter.name].min
                            } else {
                                return item[filter.name] > this.selectedState[filter.name].min && item[filter.name] < this.selectedState[filter.name].max;
                            }
                        });
                    }
                }
                this.updateChartStatic(parsedData);
            },
            setEmptyInput(i) {
                let selected = this.selectedState[this.filters[i].name];
                for (let key in selected) {
                    selected[key] = '';
                }
            },
            updateChartDynamic() {
                let queryParams = {};
                for (let i = 0; i < this.filters.length; i++) {
                    const filter = this.filters[i];
                    if (!this.isMainValue(filter)) {
                        queryParams[filter.name] = this.selectedState[filter.name];
                    } else {
                        queryParams[filter.name] = -1;
                    }
                }
                if (Object.keys(queryParams).length > 0) {
                    this.$emit('loaded', false);
                    axios
                        .get(parseQueryParams(queryParams, this.filterUrl))
                        .then(response =>
                            {
                                this.$emit('filtered', response.data.data, null);
                                this.$emit('loaded', true);
                            });
                } else {
                    this.resetChart();
                }
            }
        }
    }
</script>

<style scoped>
#minmax {
    align-items: center;
}

#left-input {
    margin-right: 20px!important;
    margin-left: 20px!important;
}

.filter {
    margin-top: 10px!important;
    margin-bottom: 10px!important;
}

.button-ctr {
    justify-content: flex-end;
    display: flex;
}

#filter-label, #filter-label-forced {
    float: left;
}
</style>