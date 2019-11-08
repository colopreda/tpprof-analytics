<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <Filters v-show="loaded && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered" @loaded="setLoading" :filterUrl="dataUrl"></Filters>
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
    export default {
        name: "GanttChart",
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
                    // TODO Esto no me gusta nada
                    this.var.chart.data = JSON.parse(parsedData[0].values.value);
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
                chart: null,
                dateAxis: null
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
            this.var.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            this.var.chart.dataSource.url = this.dataUrl;
            this.var.chart.dataSource.parser = new am4core.JSONParser();
            this.var.chart.dataSource.parser.options.emptyAs = 0;

            let setDefault = data => {
                return JSON.parse(data[0].values.value);
            };

            let checkDateRange = originalData => {
                if (this.data.start_range && this.data.end_range) {
                    this.var.dateAxis.min = new Date(originalData[this.data.start_range]).getTime();
                    this.var.dateAxis.max = new Date(originalData[this.data.end_range]).getTime();
                }
            };

            this.var.chart.dataSource.events.on("parseended", ev => {
                this.originalData = ev.target.data.data;
                if (this.filters.length > 0) {
                    ev.target.data = setDefault(ev.target.data.data);
                    checkDateRange(this.originalData[0]);
                } else {
                    ev.target.data = ev.target.data.data;
                    checkDateRange(this.originalData);
                }
            });

            this.var.chart.dataSource.events.on("ended", () => {
                this.loaded = true;
            });

            this.var.chart.dataSource.events.on("error", () => {
                this.error = true;
            });

            this.var.chart.paddingRight = 30;
            this.var.chart.dateFormatter.inputDateFormat = "i";
            this.var.chart.dateFormatter.dateFormat = "i";

            let colorSet = new am4core.ColorSet();
            colorSet.saturation = 0.4;

            let categoryAxis = this.var.chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = this.data.value;
            categoryAxis.renderer.grid.template.location = 0;

            this.var.dateAxis = this.var.chart.xAxes.push(new am4charts.DateAxis());
            this.var.dateAxis.renderer.minGridDistance = 50;
            this.var.dateAxis.baseInterval = { count: 1, timeUnit: "second" };
            this.var.dateAxis.strictMinMax = true;
            this.var.dateAxis.renderer.tooltipLocation = 0;

            let series = this.var.chart.series.push(new am4charts.ColumnSeries());
            series.columns.template.width = am4core.percent(80);
            if (this.data.tooltip !== undefined) {
                series.columns.template.tooltipText = "{tooltip}";
            }

            series.dataFields.openDateX = this.data.start_date;
            series.dataFields.dateX = this.data.end_date;
            series.dataFields.categoryY = this.data.value;
            series.dataFields.tooltip = this.data.tooltip;
            series.columns.template.propertyFields.fill = "color"; // get color from data
            series.columns.template.propertyFields.stroke = "color";
            series.columns.template.propertyFields.fillOpacity = "opacity"; // get color from data
            series.columns.template.propertyFields.strokeOpacity = "opacity";

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