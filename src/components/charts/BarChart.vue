<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg"
                            text="There was an error loading the data"></ImageTextContainer>
        <Filters v-if="filters.length > 0" v-show="loaded && !noData && !error" :filters="filters"
                 :originalData="originalData" @filtered="onDataFiltered" @loading="setLoading"></Filters>
        <ImageTextContainer v-show="noData" image="no_data.jpg"
                            text="There is no data that matches the selected filters"></ImageTextContainer>
        <BaseContainer v-show="loaded && !noData && !error" :id="title"></BaseContainer>
    </b-card>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    import BaseContainer from "../BaseContainer";
    import LoadingAnimation from "../LoadingAnimation";
    import Filters from "../Filters";
    import ImageTextContainer from "../ImageTextContainer";
    import TheCardHeader from "../TheCardHeader";

    am4core.useTheme(am4themes_animated);

    function joinData(data, xaxis) {
        let dict = {};
        for (let i = 0; i < data.length; i++) {
            let newValue;
            let currentData = data[i];
            let currentValues = JSON.parse(currentData.values.value);
            for (let item of currentValues) {
                if (dict[item[xaxis]] === undefined) {
                    newValue = item['value'];
                } else {
                    let previousValue = dict[item[xaxis]];
                    newValue = previousValue + item['value'];
                }
                dict[item[xaxis]] = newValue;
            }

        }
        let result = [];
        for (let key in dict) {
            result.push({
                "category": key,
                "values": dict[key]
            });
        }
        return result;
    }

    function filterInvalid(data) {
        return Object.keys(data).reduce(function (filtered, key) {
            if (data[key] > 0 && data[key] !== null) filtered[key] = data[key];
            return filtered;
        }, {});
    }

    function addMissingCategories(data, minConst, maxConst, xaxis, yaxis) {
        let min, max;
        if (minConst !== undefined && maxConst !== undefined) {
            min = minConst;
            max = maxConst;
        } else {
            const firstItem = data[0];
            max = min = firstItem[xaxis];
        }
        for (let item of data) {
            let v = item[xaxis];
            min = (v < min) ? v : min;
            max = (v > max) ? v : max;
        }
        while (min <= max) {
            let has = false;
            for (let item of data) {
                if (item[xaxis] === min) {
                    has = true;
                }
            }
            if (!has) {
                data.push({
                    [xaxis]: min,
                    [yaxis]: 0
                });
            }
            min++;
        }
        data.sort((a,b) => (a[xaxis] > b[xaxis]) ? 1 : ((b[xaxis] > a[xaxis]) ? -1 : 0));
        return data;
    }

    export default {
        name: "BarChart",
        components: {
            BaseContainer,
            LoadingAnimation,
            Filters,
            ImageTextContainer,
            TheCardHeader
        },
        props: {
            dataUrl: String,
            title: String,
            tooltipText: String,
            filters: Array,
            data: Object
        },
        methods: {
            onDataFiltered: function (parsedData) {
                if (parsedData.length > 0) {
                    if (this.data.type === 'histogram') {
                        this.var.chart.data = addMissingCategories(joinData(parsedData, this.data.xaxis), this.data.min, this.data.max, this.data.xaxis, this.data.yaxis);
                    } else {
                        this.var.chart.data = joinData(parsedData, this.data.xaxis);
                    }
                    this.var.chart.validateData();
                    this.noData = false;
                } else {
                    this.noData = true;
                }
            },
            setLoading: function (value) {
                this.loaded = value;
            }
        },
        data() {
            return {
                originalData: null,
                loaded: false,
                error: false,
                noData: false
            }
        },
        created() {
            this.var = {
                chart: null
            };
        },
        mounted() {
            this.var.chart = am4core.create(this.title, am4charts.XYChart);

            this.var.chart.dataSource.url = this.dataUrl;
            this.var.chart.dataSource.parser = new am4core.JSONParser();

            // Create axes

            let categoryAxis = this.var.chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = this.data.xaxis;
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            if (this.data.rotation) {
                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
                categoryAxis.renderer.labels.template.rotation = this.data.rotation;
            }
            if (this.data.xlabel) {
                categoryAxis.title.text = this.data.xlabel;
            }

            let valueAxis = this.var.chart.yAxes.push(new am4charts.ValueAxis());
            if (this.data.ylabel) {
                valueAxis.title.text = this.data.ylabel;
            }

            // Create series
            let series = this.var.chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = this.data.yaxis;
            series.dataFields.categoryX = this.data.xaxis;
            series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
            series.columns.template.fillOpacity = .8;

            let columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;

            this.var.chart.dataSource.events.on("parseended", ev => {
                if (this.filters.length > 0) {
                    this.originalData = ev.target.data.data;
                    let joinedData = joinData(ev.target.data.data);
                    if (this.data.type === 'histogram') {
                        ev.target.data = addMissingCategories(joinedData, this.data.min, this.data.max, this.data.xaxis, this.data.yaxis);
                    } else {
                        ev.target.data = joinedData;
                    }
                } else {
                    if (this.data.type === 'histogram') {
                        ev.target.data = addMissingCategories(ev.target.data.data, this.data.min, this.data.max, this.data.xaxis, this.data.yaxis);
                    } else {
                        ev.target.data = ev.target.data.data;
                    }
                }
            });

            this.var.chart.dataSource.events.on("ended", () => {
                this.loaded = true;
            });

            this.var.chart.dataSource.events.on("error", () => {
                this.error = true;
            });
        }
    }
</script>

<style scoped>
    .card-body {
        display: flex;
        flex-direction: column;
    }
    #card {
        margin: 20px!important;
        height: 650px;
    }
</style>