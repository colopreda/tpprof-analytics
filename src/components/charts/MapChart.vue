<template>
    <b-card id="card">
        <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
        <LoadingAnimation v-show="!loaded" />
        <Filters v-show="loaded && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered"></Filters>
        <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
        <ImageTextContainer v-show="noData" image="no_data.jpg" text="There is no data that matches the selected filters"></ImageTextContainer>
        <BaseContainer v-show="loaded && !noData && !error" :id="title"></BaseContainer>
    </b-card>
</template>

<script>
    import * as L from "leaflet";
    import icon from 'leaflet/dist/images/marker-icon.png';
    import iconShadow from 'leaflet/dist/images/marker-shadow.png';
    import HeatmapOverlay from '../../extras/leaflet-heatmap';
    import { SVGMarker } from '../../extras/svg-icon';
    import '../../common/circle-marker'
    import BaseContainer from "../BaseContainer";
    import LoadingAnimation from "../LoadingAnimation";
    import axios from 'axios';
    import Filters from "../Filters";
    import TheCardHeader from "../TheCardHeader";
    import ImageTextContainer from "../ImageTextContainer";
    import {APP_CODE, APP_ID} from "../../common/keys";

    function joinData(data) {
        let allMarkers = [];
        for (let markers of data) {
            const values = JSON.parse(markers.values.value);
            for (let marker of values) {
                allMarkers.push(marker);
            }
        }
        return allMarkers;
    }

    function getColor(map, labels) {
        return map[labels];
    }

    export default {
        mounted() {
            //This is needed to hide the map when the div is already drawn. If not, when showing the map
            //you see weird things
            this.loaded = false;

            let baseLayer = L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                // If you have APP_CODE and APP_ID from HERE Maps, change them in users.js and use the line below
                //`https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=${APP_ID}&app_code=${APP_CODE}`, {
                    attribution: 'Motion-S 2019',
                    maxZoom: 18
                }
            );

            this.var.heatmapData = {
                max: 8,
                data: []
            };

            L.Marker.prototype.options.icon = L.icon({
                iconUrl: icon,
                shadowUrl: iconShadow
            });

            axios
                .get(this.dataUrl)
                .then(response => {
                    this.var.map = new L.Map(this.title, {
                        center: new L.LatLng(this.data.start_latitude, this.data.start_longitude),
                        zoom: this.data.start_zoom,
                        layers: [baseLayer]
                    });

                    if (this.data.max_zoom) {
                        this.var.map.options.maxZoom = this.data.max_zoom;
                    }

                    if (this.data.type !== 'line') {
                        this.originalData = response.data.data;
                    } else {
                        this.createAllMarkers(response.data.data, false);
                    }

                    if (this.filters.length === 0) {
                    //    this.createAllMarkers(response.data.data, false);
                    }
                    this.loaded = true;
                })
                .catch(() => {
                    this.loaded = true;
                    this.error = true;
                });

            this.var.cfg = {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                // if scaleRadius is false it will be the constant radius used in pixels
                "radius": 20,
                "maxOpacity": .8,
                // scales the radius based on map zoom
                "scaleRadius": false,
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": false,
                // which field name in your data represents the latitude - default "lat"
                latField: this.data.latitude,
                // which field name in your data represents the longitude - default "lng"
                lngField: this.data.longitude,
                // which field name in your data represents the data value - default "value"
                valueField: this.data.value
            };
        },
        name: "MapChart",
        components: {
            ImageTextContainer,
            TheCardHeader,
            BaseContainer,
            LoadingAnimation,
            Filters
        },
        props: {
            dataUrl: String,
            title: String,
            filters: Array,
            data: Object,
            tooltipText: String,
            queryParams: String
        },
        methods: {
            onDataFiltered: function (parsedData) {
                if (this.var.markers) {
                    this.var.markers.clearLayers();
                }
                if (this.var.heatmap) {
                    this.var.heatmap.clearLayers();
                }
                if (parsedData.length > 0) {
                    //this.noData = false;
                    if (this.filters.length > 0) {
                        this.createAllMarkers(joinData(parsedData), true);
                    } else {
                        this.createAllMarkers(parsedData, true);
                    }
                } else {
                    this.updateChart();
                }
            },
            createMarkers: function (markers) {
                if (markers && markers.length > 0) {
                    for (let marker of markers) {
                        let color;
                        if (marker[this.data.color] !== undefined) {
                            color = marker[this.data.color];
                        } else {
                            color = "#FF0000";
                        }
                        let options = {
                            color: color,
                            fillOpacity: 1
                        };
                        let tileMarker = L.marker.svgMarker([marker[this.data.latitude], marker[this.data.longitude]],
                            { iconOptions: options }).addTo(this.var.markers);

                        if (marker[this.data.tooltip] !== undefined) {
                            tileMarker.bindPopup(marker[this.data.tooltip]);
                        }

                    }
                }
            },
            updateChart: function () {
                this.var.map.invalidateSize(false);
                if (this.var.bounds) {
                    this.var.map.fitBounds(this.var.bounds);
                }
            },
            createDotMarkers: function (markers) {
                if (markers && markers.length > 0) {
                    for (let marker of markers) {
                        let color;
                        if (marker[this.data.color] !== undefined) {
                            color = marker[this.data.color];
                        } else {
                            color = "#FF0000";
                        }

                        let options = {
                            circleFillColor: color,
                            color: color,
                            fillOpacity: 1,
                            radius: 6
                        };

                        let tileMarker = L.circleMarker([marker[this.data.latitude], marker[this.data.longitude]],
                            options).addTo(this.var.markers);

                        if (marker[this.data.tooltip] !== undefined) {
                            tileMarker.bindPopup(marker[this.data.tooltip]);
                        }
                    }
                }
            },
            getBounds: function (data) {
                let lats = []; let lngs = [];
                for (let item of data)  {
                    lats.push(item[this.data.latitude]);
                    lngs.push(item[this.data.longitude]);
                }
                // calc the min and max lng and lat
                let minlat = Math.min.apply(null, lats),
                    maxlat = Math.max.apply(null, lats);
                let minlng = Math.min.apply(null, lngs),
                    maxlng = Math.max.apply(null, lngs);

                return [[minlat,minlng],[maxlat,maxlng]];
            },
            createAllMarkers: function(data, afterFilter) {
                this.var.bounds = new L.LatLngBounds();
                let markerData = data;

                if (this.data.trip_path !== undefined) {
                    let layer = L.geoJSON(null, {
                        style: function (feature) {
                            return { color: feature.properties.color }
                        }
                    }).addTo(this.var.map);
                    let url = this.data.trip_path;

                    axios.get(url)
                        .then(response => {
                            layer.addData(response.data.data);
                            this.var.bounds.extend(layer.getBounds());
                            this.var.map.fitBounds(this.var.bounds);
                        });
                }

                switch (this.data.type) {
                    case 'heatmap': {
                        let overlays = {};
                        this.var.heatdata = markerData;
                        let heatmapLayer = new HeatmapOverlay(this.var.cfg);
                        this.var.heatmap = L.layerGroup().addTo(this.var.map);
                        this.var.heatmap.addLayer(heatmapLayer);
                        heatmapLayer.addData(data);
                        this.var.bounds.extend(this.getBounds(data));
                        if (this.data.extra_layers) {
                            overlays[this.data.base_label] = heatmapLayer;
                            let controller = L.control.layers(null, overlays).addTo(this.var.map);
                            for (let item of this.data.extra_layers) {
                                const cfg = {
                                    "radius": 20,
                                    "maxOpacity": .8,
                                    "scaleRadius": false,
                                    "useLocalExtrema": false,
                                    latField: this.data.latitude,
                                    lngField: this.data.longitude,
                                    valueField: this.data.value
                                };
                                let extraHeatmapLayer = new HeatmapOverlay(cfg);
                                this.var.heatmap.addLayer(extraHeatmapLayer);
                                axios
                                    .get(item.url + this.queryParams)
                                    .then(response => {
                                        extraHeatmapLayer.addData(response.data.data);
                                        this.var.bounds.extend(this.getBounds(response.data.data));
                                        this.updateChart();

                                        this.var.map.removeLayer(this.var.heatmap);
                                        this.var.heatmap.addTo(this.var.map);

                                        controller.addOverlay(extraHeatmapLayer, item.label);
                                    })
                            }
                        }
                        break;
                    }
                    case 'pinpoint': {
                        this.var.markers = L.featureGroup().addTo(this.var.map);
                        this.createMarkers(markerData);
                        break;
                    }
                    case 'point': {
                        this.var.markers = L.featureGroup().addTo(this.var.map);
                        this.createDotMarkers(markerData);
                        break;
                    }
                    case 'line': {
                        let layer = L.geoJSON(null, {
                            style: function (feature) {
                                return {
                                    color: feature.properties.color,
                                    weight: 6
                                }
                            }
                        }).addTo(this.var.map);
                        layer.addData(markerData);
                        this.var.bounds.extend(layer.getBounds());
                        break;
                    }
                }
                if (this.data.legend !== undefined && (!afterFilter || afterFilter && this.data.type !== 'line')) {
                    let legend = L.control({position: 'bottomright'});

                    legend.onAdd = () => {

                        let div = L.DomUtil.create('div', 'infoLegend legendLegend'),
                            grades = this.data.legend.grades,
                            labels = [],
                            colorLabels = this.data.legend.labels,
                            from, to;

                        if (grades.length > 0) {
                            for (let i = 0; i < grades.length - 1; i++) {
                                from = grades[i];
                                to = grades[i + 1];
                                let label = colorLabels[i];

                                labels.push(
                                    '<i style="background:' + getColor(this.data.legend.colors, label) + '"></i> ' +
                                    from + (to ? '&ndash;' + to : '') + " " + label);
                            }
                        } else {
                            for (let i = 0; i < colorLabels.length; i++) {
                                let label = colorLabels[i];

                                labels.push(
                                    '<i style="background:' + getColor(this.data.legend.colors, label) + '"></i> ' +
                                    label);
                            }
                        }

                        div.innerHTML = labels.join('<br>');
                        return div;
                    };

                    legend.addTo(this.var.map);
                }

                if (this.data.trip_path === undefined && this.data.type !== 'line' && this.data.type !== 'heatmap') {
                    this.var.bounds.extend(this.var.markers.getBounds());
                    this.var.map.fitBounds(this.var.bounds);
                }

                this.$on('changed-tab', this.updateChart);
                // This call is to re draw the map when the info arrives
                if (afterFilter) {
                    this.updateChart();
                }
            }
        },
        created() {
            this.var = {
                map: null,
                markers: null,
                bounds: null,
                cfg: null,
                heatmapData: null,
                heatmap: null
            };
        },
        data() {
            return {
                loaded: true,
                originalData: null,
                error: false,
                noData: false
            }
        }
    }
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";

#container {
    margin-top: 20px!important;
}

.card-body {
    display: flex;
    flex-direction: column;
}
#card {
    margin: 20px!important;
    height: 650px;
}
</style>