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
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import BaseContainer from "../BaseContainer";
import LoadingAnimation from "../LoadingAnimation";
import Filters from "../Filters";
import ImageTextContainer from "../ImageTextContainer";
import TheCardHeader from "../TheCardHeader";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

function joinData(data, xyvalues) {
    let dict = {};
    for (let i = 0; i < data.length; i++) {
        let newValue;
        let currentData = data[i];
        if (isNaN(dict[currentData[xyvalues.xaxis]])) {
            newValue = currentData[xyvalues.yaxis];
        } else {
            newValue = dict[currentData[xyvalues.xaxis]] + currentData[xyvalues.yaxis];
        }
        dict[currentData[xyvalues.xaxis]] = newValue;
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

export default {
    name: "LineChart",
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
    data() {
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
                this.var.chart.data = joinData(parsedData, this.data);
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
    mounted() {
        // Create chart instance
        this.var.chart = am4core.create(this.title, am4charts.XYChart);
        this.var.chart.paddingRight = 20;

        this.var.chart.dataSource.url = this.dataUrl;
        this.var.chart.dataSource.parser = new am4core.JSONParser();
        this.var.chart.dataSource.parser.options.emptyAs = 0;
        this.var.chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";

        this.var.chart.dataSource.events.on("parseended", ev => {
            this.originalData = ev.target.data.data;
            ev.target.data = joinData(ev.target.data.data, this.data);
        });

        this.var.chart.dataSource.events.on("ended", () => {
            this.loaded = true;
        });

        this.var.chart.dataSource.events.on("error", () => {
            this.error = true;
        });

        // Create axes
        if (this.data.type === 'date') {
            let dateAxis =  this.var.chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss";
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.baseInterval = { count: 5, timeUnit: "second" };
            dateAxis.strictMinMax = true;
            dateAxis.renderer.tooltipLocation = 0;
            dateAxis.strictMinMax = true;
        } else {
            let categoryAxis = this.var.chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "id";
            categoryAxis.title.text = this.data.xlabel;
            categoryAxis.renderer.minGridDistance = 50;
            categoryAxis.renderer.grid.template.location = 0.5;
            categoryAxis.startLocation = 0.5;
            categoryAxis.endLocation = 0.5;
        }

        // Create value axis
        let valueAxis = this.var.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.baseValue = 0;
        valueAxis.title.text = this.data.ylabel;

        // Create series
        let series = this.var.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        if (this.data.type === 'date') {
            series.dataFields.dateX = "id";
        } else {
            series.dataFields.categoryX = "id";
        }
        series.strokeWidth = 2;
        series.tensionX = 1;

        this.var.chart.cursor = new am4charts.XYCursor();
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