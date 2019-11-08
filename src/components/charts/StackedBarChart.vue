<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <Filters v-if="filters.length > 0" v-show="loaded && !noData && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered" @loading="setLoading"></Filters>
        <ImageTextContainer v-show="noData" image="no_data.jpg" text="There is no data that matches the selected filters"></ImageTextContainer>
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
import * as colorMap from '@/common/colors.js'
import ImageTextContainer from "../ImageTextContainer";
import TheCardHeader from "../TheCardHeader";

am4core.useTheme(am4themes_animated);

function joinData(data, xvalue) {
    let dict = {};
    for (let i = 0; i < data.length; i++) {
        let newValue;
        let currentData = data[i];
        let currentValues = JSON.parse(currentData.values.value);
        if (dict[currentData[xvalue]] === undefined) {
            newValue = currentValues;
        } else {
            let previousDict =  dict[currentData[xvalue]];
            newValue = {};
            for (let key in previousDict) {
                newValue[key] = previousDict[key] + currentValues[key];
            }
        }
        dict[currentData[xvalue]] = newValue;
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

function generateData(data, xaxis) {
    let parsedData = [];
    for (let item of data) {
        let categoryObject = {};
        categoryObject[xaxis] = item['category'];
        parsedData.push(Object.assign({}, categoryObject, filterInvalid(item.values)));
    }
    return parsedData;
}

export default {
    name: "StackedBarChart",
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
                this.var.chart.data = generateData(joinData(parsedData, this.data.xaxis), this.data.xaxis);
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
        this.var.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        this.var.chart.colors.step = 2;
        this.var.chart.padding(30, 30, 10, 30);

        this.var.chart.dataSource.url = this.dataUrl;
        this.var.chart.dataSource.parser = new am4core.JSONParser();

        let generateSeries = (data) => {
            let defaltColorSet = new am4core.ColorSet();
            for (let key of data) {
                let series = this.var.chart.series.push(new am4charts.ColumnSeries());
                series.columns.template.width = am4core.percent(60);
                series.columns.template.tooltipText =
                    "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
                series.name = key;
                series.columns.template.fill = am4core.color(colorMap.colorMap[key.toUpperCase()]);
                if (colorMap.colorMap[key.toUpperCase()] !== undefined) {
                    series.columns.template.fill = am4core.color(colorMap.colorMap[key.toUpperCase()]);
                } else {
                    series.columns.template.fill = defaltColorSet.next();
                }
                series.dataFields.categoryX = this.data.xaxis;
                series.dataFields.valueY = key;
                series.dataFields.valueYShow = "totalPercent";
                series.dataItems.template.locations.categoryX = 0.5;
                series.stacked = true;
                series.tooltip.pointerOrientation = "vertical";
            }
        };

        function getAllPossibleValues(parsedData) {
            let possibleValues = [];
            for (let item of parsedData) {
                for (let key in item.values) {
                    if (!possibleValues.includes(key)) {
                        possibleValues.push(key);
                    }
                }
            }
            return possibleValues;
        }

        this.var.chart.dataSource.events.on("parseended", ev => {
            this.originalData = ev.target.data.data;
            let parsedData = joinData(ev.target.data.data, this.data.xaxis);
            generateSeries(getAllPossibleValues(parsedData));
            ev.target.data = generateData(parsedData, this.data.xaxis);
        });

        this.var.chart.dataSource.events.on("ended", () => {
            this.loaded = true;
        });

        this.var.chart.dataSource.events.on("error", () => {
            this.error = true;
        });

        let categoryAxis = this.var.chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = this.data.xaxis;
        categoryAxis.renderer.grid.template.location = 0;

        let valueAxis = this.var.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 100;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;

        if (this.data.legend) {
            this.var.chart.legend = new am4charts.Legend();
        }
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