<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
            <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
            <Filters v-show="loaded && !noData && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered"></Filters>
            <ImageTextContainer v-show="noData" image="no_data.jpg" text="There is no data that matches with the selected filters"></ImageTextContainer>
            <BaseContainer v-show="loaded && !noData && !error" :id="title"></BaseContainer>
        </b-card>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Filters from "../Filters";
import BaseContainer from "../BaseContainer";
import LoadingAnimation from "../LoadingAnimation";
import ImageTextContainer from "../ImageTextContainer";
import TheCardHeader from "../TheCardHeader";

am4core.useTheme(am4themes_animated);

function joinData(data, identification, filterValue) {
    let dict = {};
    let counter = {};
    for (let i = 0; i < data.length; i++) {
        let newValue;
        let counterValue;
        let totalValue = getTotalValue(JSON.parse(data[i].values.value), filterValue);
        let element = data[i];
        let idElement = element[identification];
        if (isNaN(dict[idElement])) {
            newValue = totalValue;
            counterValue = 1;
        } else {
            newValue = dict[idElement] + totalValue;
            counterValue = counter[idElement] + 1;
        }
        dict[idElement] = newValue;
        counter[idElement] = counterValue;
    }
    let result = [];
    for (let key in dict) {
        result.push({
            "id": key,
            "value": dict[key] / counter[key]
        });
    }
    return result;
}

function getTotalValue(singleData, filterValue) {
    let total = 0;
    let counter = 0;
    for (let key in singleData) {
        if (filterValue == null || filterValue === key) {
            total += singleData[key];
            counter++;
        }
    }
    return total / counter;
}

export default {
    name: "ChoroplethMap",
    components: {
        BaseContainer,
        Filters,
        LoadingAnimation,
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
        onDataFiltered: function (parsedData, filterValue) {
            if (parsedData.length > 0) {
                this.var.polygonSeries.data = joinData(parsedData, this.data.identification, filterValue);
                this.var.polygonSeries.validateData();
                this.noData = false;
            } else {
                this.noData = true;
            }
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
            polygonSeries: null
        };
    },
    mounted() {
        let chart = am4core.create(this.title, am4maps.MapChart);
        
        chart.geodataSource.url = this.data.map_url;

        // Set projection
        chart.projection = new am4maps.projections.Mercator();

        // Create map polygon series
        this.var.polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        //Set min/max fill color for each area
        this.var.polygonSeries.heatRules.push({
            property: "fill",
            target: this.var.polygonSeries.mapPolygons.template,
            min: chart.colors.getIndex(1).brighten(1),
            max: chart.colors.getIndex(1).brighten(-0.3)
        });

        // Make map load polygon data (state shapes and names) from GeoJSON
        this.var.polygonSeries.useGeodata = true;

        this.var.polygonSeries.dataSource.url = this.dataUrl;
        this.var.polygonSeries.dataSource.parser = new am4core.JSONParser();

        this.var.polygonSeries.dataSource.events.on("parseended", ev => {
            this.originalData = ev.target.data.data;
            if (this.filters.length > 0) {
                ev.target.data = joinData(ev.target.data.data, this.data.identification);
            } else {
                ev.target.data = ev.target.data.data;
            }
        });

        this.var.polygonSeries.dataSource.events.on("ended", () => {
            this.loaded = true;
        });

        this.var.polygonSeries.dataSource.events.on("error", () => {
            this.error = true;
        });

        // Set up heat legend
        let heatLegend = chart.createChild(am4maps.HeatLegend);
        heatLegend.series = this.var.polygonSeries;
        heatLegend.align = "center";
        heatLegend.valign = "bottom";
        heatLegend.width = am4core.percent(40);
        heatLegend.marginRight = am4core.percent(4);
        heatLegend.minValue = 0;
        heatLegend.maxValue = 40000000;

        // Set up custom heat map legend labels using axis ranges
        let minRange = heatLegend.valueAxis.axisRanges.create();
        minRange.value = heatLegend.minValue;
        minRange.label.text = "Min";
        let maxRange = heatLegend.valueAxis.axisRanges.create();
        maxRange.value = heatLegend.maxValue;
        maxRange.label.text = "Max";

        // Blank out internal heat legend value axis labels
        heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function () {
            return "";
        });

        // Configure series tooltip
        let polygonTemplate = this.var.polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}: {value}";
        polygonTemplate.nonScalingStroke = true;
        polygonTemplate.strokeWidth = 0.5;

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        if (this.data.fill_color) {
            hs.properties.fill = am4core.color(this.data.fill_color);
        } else {
            hs.properties.fill = am4core.color("#3c5bdc");
        }

        // Set initial start point to mersch in luxembourg
        chart.homeGeoPoint = this.data.home_geopoint;
        chart.homeZoomLevel = this.data.zoom_level;

        // Disable zooming and panning
        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;
        chart.minZoomLevel = this.data.zoom_level;
        chart.maxZoomLevel = this.data.zoom_level;

    },

    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
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