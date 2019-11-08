<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <ImageTextContainer v-show="noData" image="no_data.jpg" text="There is no data that matches the selected filters"></ImageTextContainer>
        <BaseContainer v-show="loaded && !noData && !error" :id="title"></BaseContainer>
    </b-card>
</template>

<script>
    import LoadingAnimation from "../LoadingAnimation";
    import BaseContainer from "../BaseContainer";
    import ImageTextContainer from "../ImageTextContainer";
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    import axios from "axios";
    import TheCardHeader from "../TheCardHeader";

    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);

    export default {
        name: "GaugeChart",
        components: {
            LoadingAnimation,
            BaseContainer,
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
            this.var.chart = am4core.create(this.title, am4charts.GaugeChart);
            this.var.chart.innerRadius = 82;

            let axis = this.var.chart.xAxes.push(new am4charts.ValueAxis());
            axis.min = ((this.data.min) ? this.data.min : 0);
            axis.max = ((this.data.max) ? this.data.max : 100);
            axis.strictMinMax = true;

            let gradient = new am4core.LinearGradient();

            // If the stops are defined in the config file, I load them from there. If not,
            // set a default
            if (this.data.stops) {
                gradient.config = this.data.stops;
            } else {
                gradient.stops.push({
                    color:am4core.color("red"),
                    offset: 0.5
                });
                gradient.stops.push({
                    color:am4core.color("yellow"),
                    offset: 0.9
                });
                gradient.stops.push({
                    color:am4core.color("green"),
                    offset: 1
                });
            }


            axis.renderer.line.stroke = gradient;
            axis.renderer.line.strokeWidth = 15;
            axis.renderer.line.strokeOpacity = 1;

            axis.renderer.grid.template.disabled = true;

            let hand = this.var.chart.hands.push(new am4charts.ClockHand());
            hand.innerRadius = am4core.percent(20);
            hand.startWidth = 10;
            hand.pin.disabled = true;

            let label = this.var.chart.radarContainer.createChild(am4core.Label);
            label.isMeasured = false;
            label.fontSize = 45;
            label.x = am4core.percent(50);
            label.y = am4core.percent(100);
            label.horizontalCenter = "middle";
            label.verticalCenter = "bottom";

            axios
                .get(this.dataUrl)
                .then(response =>
                    {
                        hand.showValue(response.data.data[0].value);
                        label.text = Math.trunc(response.data.data[0].value);
                        this.loaded = true;
                    })
                .catch(() => {
                    this.loaded = true;
                    this.error = true;
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