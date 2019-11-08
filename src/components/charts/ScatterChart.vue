<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <Filters v-show="loaded && !noData && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered"/>
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

function generateTooltipText(data) {
    let extraData = "";
    if (data.extradata) {
        extraData = "{" + data.extradata + "}: "
    }
    return extraData + data.xlabel + ": "
        + "{" + data.xaxis
        + ".formatNumber('#.00')}"
        + data.xlabelunit
        + " - "
        + data.ylabel
        + ": "
        + "{"
        + data.yaxis
        + ".formatNumber('#.00')} "
        + data.ylabelunit;
}

export default {
    name: "ScatterChart",
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
                this.var.series.data = parsedData;
                this.var.series.validateData();
                this.noData = false;
            } else {
                this.noData = true;
            }
        }
    },
    created() {
        this.var = {
            chart: null,
            series: null
        };
    },
    data() {
        return {
            originalData: null,
            loaded: false,
            error: false,
            noData: false
        }
    },
    mounted() {
        this.var.chart = am4core.create(this.title, am4charts.XYChart);

        // Create axes
        let xAxis = this.var.chart.xAxes.push(new am4charts.ValueAxis());
        xAxis.renderer.minGridDistance = 50;
        xAxis.title.text = this.data.xlabel;

        let yAxis = this.var.chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.minGridDistance = 50;
        yAxis.title.text = this.data.ylabel;

        // // Create series
        this.var.series = this.var.chart.series.push(new am4charts.LineSeries());
        this.var.series.dataSource.url = this.dataUrl;
        this.var.series.dataSource.parser = new am4core.JSONParser();
        this.var.series.dataFields.valueX = this.data.xaxis;
        this.var.series.dataFields.valueY = this.data.yaxis;
        this.var.series.strokeOpacity = 0;
        this.var.series.name = this.data.xlabel + " vs " + this.data.ylabel;

        this.var.series.dataSource.events.on("parseended", ev => {
            this.originalData = ev.target.data.data;
            ev.target.data = ev.target.data.data;
        });

        this.var.series.dataSource.events.on("ended", () => {
            this.loaded = true;
        });

        this.var.series.dataSource.events.on("error", () => {
            this.error = true;
        });

        let bullet = this.var.series.bullets.push(new am4charts.CircleBullet());
        bullet.tooltipText = generateTooltipText(this.data);
        bullet.circle.fill = am4core.color("blue");
        bullet.circle.fillOpacity = 0.3;
        bullet.circle.stroke = am4core.color("blue");
        bullet.circle.strokeOpacity = 0.3;

        if (this.data.extradata) {
            let valueLabel = this.var.series.bullets.push(new am4charts.LabelBullet());
            valueLabel.label.text = "{" + this.data.extradata + "}";
            valueLabel.label.fontSize = 16;
            valueLabel.label.horizontalCenter = "middle";
            valueLabel.label.dy = -16;
        }

        if (this.data.trend) {
            let trend = this.var.chart.series.push(new am4charts.LineSeries());
            trend.strokeOpacity = 0.7;
            trend.dataFields.valueX = this.data.xaxis;
            trend.dataFields.valueY = this.data.yaxis;
            trend.data = [
                { "predicted": 0, "real": 0 },
                { "predicted": 1, "real": 1 }
            ];
        }

        this.var.chart.scrollbarX = new am4core.Scrollbar();
        this.var.chart.scrollbarY = new am4core.Scrollbar();

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