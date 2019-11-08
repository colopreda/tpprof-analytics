<template>
    <div>
        <h2>First Dashboard</h2>
        <div class="row">
            <div class="col">
                <StackedBarChart v-if="isAdmin()" :dataUrl="config.cf_by_severity.dataUrl" :title='config.cf_by_severity.title' :filters='config.cf_by_severity.filters' :data="config.cf_by_severity.data" :tooltipText="config.cf_by_severity.tooltipText" />
            </div>
            <div class="col">
                <GaugeChart v-if="isAdmin()" :title="config.global_score.title" :data="config.global_score.data" :dataUrl="config.global_score.dataUrl" :tooltipText="config.global_score.tooltipText"></GaugeChart>
            </div>
        </div>
        <GanttChart :title="config.cf_activation.title" :dataUrl="config.cf_activation.dataUrl" :data="config.cf_activation.data" :filters='config.cf_activation.filters' :tooltipText="config.cf_activation.tooltipText"></GanttChart>
        <LineChart :dataUrl="config.risk_over_time.dataUrl" :title='config.risk_over_time.title' :filters='config.risk_over_time.filters' :data="config.risk_over_time.data" :tooltipText="config.risk_over_time.tooltipText"></LineChart>
        <div class="row">
            <div class="col-6">
                <ScatterChart :title="config.scatter.title" :dataUrl="config.scatter.dataUrl" :data="config.scatter.data" :tooltipText="config.scatter.tooltipText" :filters="config.scatter.filters"></ScatterChart>
                <ChoroplethMap :dataUrl="config.choropleth_map.dataUrl" :title='config.choropleth_map.title' :data="config.choropleth_map.data" :filters="config.choropleth_map.filters" :tooltipText="config.choropleth_map.tooltipText"></ChoroplethMap>
            </div>
            <div class="col-6">
                <MatrixHeatmapChart :dataUrl="config.matrix_heat_map.dataUrl" :title='config.matrix_heat_map.title' :data="config.matrix_heat_map.data" :filters="config.matrix_heat_map.filters" :tooltipText="config.matrix_heat_map.tooltipText" ></MatrixHeatmapChart>
            </div>
        </div>
    </div>

</template>


<script>
    import StackedBarChart from "../components/charts/StackedBarChart";
    import GanttChart from "../components/charts/GanttChart";
    import LineChart from "../components/charts/LineChart";
    import GaugeChart from "../components/charts/GaugeChart";
    import MatrixHeatmapChart from "../components/charts/MatrixHeatmapChart";
    import ChoroplethMap from "../components/charts/ChoroplethMapChart";
    import ScatterChart from "../components/charts/ScatterChart";
    // Role imports
    import {authService} from "../_services";
    import {Role} from "../_helpers/role";

    export default {
        name: "FirstDashboard",
        components: {
            ScatterChart,
            ChoroplethMap, MatrixHeatmapChart, LineChart, GanttChart, StackedBarChart, GaugeChart},
        methods: {
            addQueryParams: function (url) {
                return url + this.queryParams;
            },
            isAdmin: function () {
                return authService.currentUserValue.role === Role.Admin;
            }
        },
        props: {
            queryParams: String,
            config: Object
        }
    }
</script>

<style scoped>

</style>