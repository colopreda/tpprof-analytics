<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded"/>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <ImageTextContainer v-show="noData" image="no_data.jpg" text="There is no data that matches the selected filters"></ImageTextContainer>
        <div v-show="!error || !noData" id="table-container">
            <b-table class="table" bordered responsive :fields="data.fields" :stacked="data.stacked" :items="items" v-show="loaded">
                <span :slot="link" slot-scope="data" v-html="data.value" v-for="link in data.links"></span>
            </b-table>
        </div>
    </b-card>
</template>

<script>
    import LoadingAnimation from "../LoadingAnimation";
    import axios from "axios";
    import TheCardHeader from "../TheCardHeader";
    import ImageTextContainer from "../ImageTextContainer";

    export default {
        name: "TableChart",
        data() {
            return {
                items: [],
                loaded: false,
                error: false,
                noData: false
            }
        },
        components: {
            ImageTextContainer,
            LoadingAnimation,
            TheCardHeader
        },
        props: {
            dataUrl: String,
            title: String,
            tooltipText: String,
            data: Object
        },
        mounted() {
            axios
                .get(this.dataUrl)
                .then(response =>
                {
                    this.items = response.data.data;
                    this.loaded = true;
                })
                .catch(() => {
                    this.loaded = true;
                    this.error = true;
                });

        }
    }
</script>

<style scoped>
    .card-body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    #card {
        display: flex;
        margin: 20px!important;
        height: 650px;
    }

    .table {
        table-layout: fixed;
    }

    #table-container {
        margin-top: 20px!important;
        flex-grow: 1;
        overflow-y: auto;
        max-height: 530px !important;
    }
</style>