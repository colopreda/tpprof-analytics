<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
            <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
            <Filters v-show="loaded && !noData && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered" @loaded="setLoading" :filterUrl="dataUrl"></Filters>
            <ImageTextContainer v-show="noData" image="no_data.jpg" text="There is no data that matches with the selected filters"></ImageTextContainer>
            <BaseContainer v-show="loaded && !noData && !error" :id="title"></BaseContainer>
        </b-card>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_Lux from "@/assets/maps/communesLux";
import * as luxCoordinates from "@/common/luxCoordinates.js"
import Filters from "../Filters";
import BaseContainer from "../BaseContainer";
import LoadingAnimation from "../LoadingAnimation";
import ImageTextContainer from "../ImageTextContainer";
import axios from "axios";
import TheCardHeader from "../TheCardHeader";

am4core.useTheme(am4themes_animated);

function joinData(data, filterValue) {
    let dict = {};
    for (let i = 0; i < data.length; i++) {
        let newValue;
        let totalValue = getTotalValue(JSON.parse(data[i].values.value), filterValue);
        if (isNaN(dict[data[i].area_code])) {
            newValue = totalValue
        } else {
            newValue = dict[data[i].area_code] + totalValue;
        }
        dict[data[i].area_code] = newValue;
    }
    let result = [];
    for (let key in dict) {
        result.push({
            "id": key,
            "value": dict[key]
        });
    }
    return result;
}

function getTotalValue(singleData, filterValue) {
    let total = 0;
    for (let key in singleData) {
        if (filterValue == null || filterValue === key) {
            total += singleData[key];
        }
    }
    return total;
}

export default {
    name: "CurvedLineMap",
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
        onDataFiltered: function (parsedData) {
            if (parsedData.length > 0) {
                this.createLineArrays(parsedData);
                this.var.chart.validateData();
                this.noData = false;
            } else {
                this.noData = true;
            }
        },
        setLoading: function (value) {
            this.loaded = value;
        },
        createLineArrays: function(data) {
            for (let line of this.data.lines) {
                let lineSeries = this.var.chart.series.push(new am4maps.MapLineSeries());
                lineSeries.dataFields.multiGeoLine = "multiGeoLine";

                let lineTemplate = lineSeries.mapLines.template;
                lineTemplate.nonScalingStroke = true;
                lineTemplate.arrow.nonScaling = true;
                lineTemplate.arrow.width = 4;
                lineTemplate.arrow.height = 6;
                lineTemplate.stroke = am4core.color(line.color);
                lineTemplate.fill = am4core.color(line.color);
                lineTemplate.line.strokeOpacity = 0.4;
                let dataInLine = [];
                for (let item of data) {
                    if (item[this.data.value] > line.minValue && item[this.data.value] < line.maxValue) {
                        const startArea = luxCoordinates.luxCoordinates[item[this.data.start_area]];
                        const endArea = luxCoordinates.luxCoordinates[item[this.data.end_area]];
                        if (startArea !== undefined && endArea !== undefined) {
                            let object = {
                                "multiGeoLine": [
                                    [
                                        startArea,
                                        endArea
                                    ]
                                ]
                            };
                            dataInLine.push(object);
                        }
                    }
                }
                lineSeries.data = dataInLine;
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
            polygonSeries: null,
            chart: null
        };
    },
    mounted() {
        am4core.useTheme(am4themes_animated);

        // Create map instance
        this.var.chart = am4core.create(this.title, am4maps.MapChart);

        // Set map definition
        this.var.chart.geodata = am4geodata_Lux;

        // Set projection
        this.var.chart.projection = new am4maps.projections.Mercator();

        // Add zoom control
        this.var.chart.zoomControl = new am4maps.ZoomControl();

        // Set initial zoom
        this.var.chart.homeZoomLevel = 1.2;
        this.var.chart.homeGeoPoint = {
            latitude: 49.79,
            longitude: 6.09
        };

        this.var.chart.seriesContainer.draggable = false;
        this.var.chart.seriesContainer.resizable = false;
        this.var.chart.minZoomLevel = 1.2;
        this.var.chart.maxZoomLevel = 1.2;

        // Create map polygon series
        this.var.polygonSeries = this.var.chart.series.push(new am4maps.MapPolygonSeries());
        this.var.polygonSeries.exclude = ["AQ"];
        this.var.polygonSeries.useGeodata = true;
        this.var.polygonSeries.mapPolygons.template.nonScalingStroke = true;

        axios
            .get(this.dataUrl)
            .then(response =>
            {
                this.createLineArrays(response.data.data);
                this.loaded = true;
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