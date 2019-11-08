<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <Filters v-show="loaded && !noData && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered" @loaded="setLoading" :filterUrl="dataUrl"></Filters>
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
import ImageTextContainer from "../ImageTextContainer";
import TheCardHeader from "../TheCardHeader";

am4core.useTheme(am4themes_animated);

function createTooltipText(data) {
    return "{" + data.xaxis + "}-{" + data.yaxis + "} : {" + data.value + "}";
}

export default {
    name: "MatrixHeatmapChart",
    components: {
        LoadingAnimation,
        BaseContainer,
        Filters,
        ImageTextContainer,
        TheCardHeader
    },
    data () {
        return {
            loaded: false,
            originalData: null,
            error: false,
            noData: false
        }
    },
    methods: {
        onDataFiltered: function (parsedData) {
            if (parsedData.length > 0) {
                this.var.chart.data = parsedData;
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
    created() {
        this.var = {
            chart: null
        };
    },
    props: {
        dataUrl: String,
        title: String,
        tooltipText: String,
        filters: Array,
        data: Object
    },
    mounted() {
        this.var.chart = am4core.create(this.title, am4charts.XYChart);
        this.var.chart.maskBullets = false;

        this.var.chart.dataSource.url = this.dataUrl;
        this.var.chart.dataSource.parser = new am4core.JSONParser();
        this.var.chart.dataSource.parser.options.emptyAs = 0;

        this.var.chart.dataSource.events.on("parseended", ev => {
            this.originalData = ev.target.data.data;
            ev.target.data = ev.target.data.data;
        });

        this.var.chart.dataSource.events.on("ended", () => {
           this.loaded = true;
        });

        this.var.chart.dataSource.events.on("error", () => {
            this.error = true;
        });

        let xAxis = this.var.chart.xAxes.push(new am4charts.CategoryAxis());
        let yAxis = this.var.chart.yAxes.push(new am4charts.CategoryAxis());

        xAxis.dataFields.category = this.data.xaxis;
        yAxis.dataFields.category = this.data.yaxis;

        xAxis.renderer.grid.template.disabled = true;
        xAxis.renderer.minGridDistance = 40;
        xAxis.title.text = this.data.xlabel;

        yAxis.renderer.grid.template.disabled = true;
        yAxis.renderer.minGridDistance = 30;
        yAxis.title.text = this.data.ylabel;

        let series = this.var.chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = this.data.xaxis;
        series.dataFields.categoryY = this.data.yaxis;
        series.dataFields.value = this.data.value;
        series.sequencedInterpolation = true;
        series.defaultState.transitionDuration = 3000;

        let bgColor = new am4core.InterfaceColorSet().getFor("background");

        let columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 1;
        columnTemplate.strokeOpacity = 0.2;
        columnTemplate.stroke = bgColor;
        columnTemplate.tooltipText = createTooltipText(this.data);
        columnTemplate.width = am4core.percent(100);
        columnTemplate.height = am4core.percent(100);

        if (this.data.inverted) {
            series.heatRules.push({
                target: columnTemplate,
                property: "fill",
                min: am4core.color("red"),
                max: am4core.color(bgColor)
            });
        } else {
            series.heatRules.push({
                target: columnTemplate,
                property: "fill",
                min: am4core.color(bgColor),
                max: am4core.color("red")
            });
        }

        // heat legend
        let heatLegend = this.var.chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
        heatLegend.width = am4core.percent(100);
        heatLegend.series = series;
        heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
        heatLegend.valueAxis.renderer.minGridDistance = 30;
        heatLegend.marginTop = 10;

        // heat legend behavior
        series.columns.template.events.on("over", (event) => {
            handleHover(event.target);
        });

        series.columns.template.events.on("hit", (event) => {
            handleHover(event.target);
        });

        function handleHover(column) {
            if (!isNaN(column.dataItem.value)) {
                heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
            } else {
                heatLegend.valueAxis.hideTooltip();
            }
        }

        series.columns.template.events.on("out", () => {
            heatLegend.valueAxis.hideTooltip();
        });
    },

    beforeDestroy() {
        if (this.var.chart) {
           this.var.chart.dispose();
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