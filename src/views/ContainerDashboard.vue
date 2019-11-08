<template>
    <b-tabs content-class="mt-3" justified>
        <b-tab title="Tab 1" active>
            <FirstDashboard ref="risk" :config="risk_assessment_trip" :queryParams="getQueryParams()" v-observe-visibility="riskVisible"></FirstDashboard>
        </b-tab>
        <b-tab title="Tab 2">
            <SecondDashboard ref="contextual" :config="contextual_data_trip" :queryParams="getQueryParams()" v-observe-visibility="contextualVisible"></SecondDashboard>
        </b-tab>
    </b-tabs>

</template>

<script>
    // Imports de constantes
    import {parseQueryParams} from "../_helpers";
    import FirstDashboard from "./FirstDashboard";
    import SecondDashboard from "./SecondDashboard";
    import {contextual_data_trip} from "../common/config";
    import {risk_assessment_trip} from "../common/config";

    export default {
        name: "ContainerDashboard",
        components: {
            SecondDashboard,
            FirstDashboard,
        },
        data() {
            return {
                contextual_data_trip: contextual_data_trip,
                risk_assessment_trip: risk_assessment_trip
            }
        },
        methods: {
            riskVisible: function (isVisible) {
                this.$refs.risk.$emit('changed-tab');
            },
            contextualVisible: function (isVisible) {
                this.$refs.contextual.$emit('changed-tab');
            },
            getQueryParams: function () {
                return parseQueryParams(this.trip_id);
            }
        },
        props: {
            trip_id: String
        }
    }
</script>

<style scoped>

</style>