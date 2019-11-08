<template>
    <div>
        <h2>Second Dashboard</h2>
        <div class="row">
            <div class="col-lg">
                <TableChart :title="config.trip_data.title" :dataUrl="config.trip_data.dataUrl" :data="config.trip_data.data" :tooltipText="config.trip_data.tooltipText"></TableChart>
                <MapChart ref="map" :dataUrl="config.speed_limit.dataUrl" :title='config.speed_limit.title' :data="config.speed_limit.data" :filters="config.speed_limit.filters" :tooltipText="config.speed_limit.tooltipText" :queryParams="queryParams"></MapChart>
                <MapChart ref="map3" :dataUrl="config.pinpoint.dataUrl" :title='config.pinpoint.title' :data="config.pinpoint.data" :filters="config.pinpoint.filters" :tooltipText="config.pinpoint.tooltipText" :queryParams="queryParams"></MapChart>
                <BarChart :title="config.histogram.title" :dataUrl="config.histogram.dataUrl" :data="config.histogram.data" :tooltipText="config.histogram.tooltipText" :filters="config.histogram.filters"></BarChart>
            </div>
            <div class="col-lg">
                <PieChart :dataUrl="config.proportion_roadtype.dataUrl" :title='config.proportion_roadtype.title' :filters='config.proportion_roadtype.filters' :data='config.proportion_roadtype.data' :tooltipText="config.proportion_roadtype.tooltipText"></PieChart>
                <MapChart ref="map2" :dataUrl="config.possible_speed.dataUrl" :title='config.possible_speed.title' :data="config.possible_speed.data" :filters="config.possible_speed.filters" :tooltipText="config.possible_speed.tooltipText" :queryParams="queryParams"></MapChart>
                <MapChart ref="map4" :dataUrl="config.heatmap_filters.dataUrl" :title='config.heatmap_filters.title' :data="config.heatmap_filters.data" :filters="config.heatmap_filters.filters" :tooltipText="config.heatmap_filters.tooltipText" :queryParams="queryParams"></MapChart>
                <BarChart :title="config.bar_chart.title" :dataUrl="config.bar_chart.dataUrl" :data="config.bar_chart.data" :tooltipText="config.bar_chart.tooltipText" :filters="config.bar_chart.filters"></BarChart>
            </div>
        </div>
    </div>
</template>



<script>
    import TableChart from "../components/charts/TableChart";
    import PieChart from "../components/charts/PieChart";
    import MapChart from "../components/charts/MapChart";
    import BarChart from "../components/charts/BarChart";

    export default {
        name: "SecondDashboard",
        components: {BarChart, TableChart, PieChart, MapChart},
        methods: {
            emitToMap: function () {
                this.$refs.map.$emit('changed-tab');
                this.$refs.map2.$emit('changed-tab');
                this.$refs.map3.$emit('changed-tab');
                this.$refs.map4.$emit('changed-tab');
            },
            addQueryParams: function (url) {
                return url + this.queryParams;
            }
        },
        created() {
            this.$on('changed-tab', this.emitToMap);
        },
        props: {
            queryParams: String,
            config: Object
        }
    }
</script>

<style scoped>

</style>