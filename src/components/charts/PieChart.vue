<template>
  <b-card id="card">
    <TheCardHeader :title="title" icon='infoicon.png' :tooltipText="tooltipText"></TheCardHeader>
    <LoadingAnimation v-show="!loaded"/>
    <ImageTextContainer v-show="error" image="error.jpg" text="There was an error loading the data"></ImageTextContainer>
    <Filters v-if="filters.length > 0" v-show="loaded && !noData && !error" :filters="filters" :originalData="originalData" @filtered="onDataFiltered" @loading="setLoading"></Filters>
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
import * as colorMap from '@/common/colors.js'
import TheCardHeader from "../TheCardHeader";

am4core.useTheme(am4themes_animated);

function joinData(data) {
  let dict = {};
  for (let i = 0; i < data.length; i++) {
    const cf = JSON.parse(data[i].values.value);
    for (let key in cf) {
      if (isNaN(dict[key])) {
        dict[key] = cf[key];
      } else {
        dict[key] = dict[key] + cf[key];
      }
    }
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
  name: 'PieChart',
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
        this.var.chart.data = joinData(parsedData);
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
  data() {
    return {
      originalData: null,
      loaded: false,
      error: false,
      noData: false
    }
  },
  mounted() {
        this.var.chart = am4core.create(this.title, am4charts.PieChart3D);

        this.var.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        this.var.chart.responsive.enabled = true;
        this.var.chart.numberFormatter.numberFormat = "#.##";

        this.var.chart.dataSource.url = this.dataUrl;
        this.var.chart.dataSource.parser = new am4core.JSONParser();
        this.var.chart.align = "center";

    let generateColorSet = values => {
      let colorset = [];
      let defaltColorSet = new am4core.ColorSet();
      for (let item of values) {
        if (colorMap.colorMap[item[this.data.category].toUpperCase()] !== undefined) {
          colorset.push(am4core.color(colorMap.colorMap[item[this.data.category].toUpperCase()]));
        } else {
          colorset.push(defaltColorSet.next());
        }
      }
      return colorset;
    };

    let createSeries = value => {
      let series = this.var.chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = this.data.value;
      series.dataFields.category = this.data.category;
      series.numberFormatter.numberFormat = "#.00";
      series.labels.template.disabled = true;
      series.slices.template.tooltipText = "{category}: {value.percent.formatNumber('#.#')}%";
      series.colors.list = generateColorSet(value);
    };

    this.var.chart.dataSource.events.on("parseended", ev => {
          if (this.filters.length > 0) {
            this.originalData = ev.target.data.data;
            let joinedData = joinData(ev.target.data.data);
            ev.target.data = joinedData;
          } else {
            ev.target.data = ev.target.data.data;
          }
          createSeries(ev.target.data);
    });

        this.var.chart.dataSource.events.on("ended", () => {
          this.loaded = true;
        });

        this.var.chart.dataSource.events.on("error", () => {
          this.error = true;
        });

        this.var.chart.seriesContainer.scale = 1;

        this.var.chart.legend = new am4charts.Legend();

    },

    beforeDestroy() {
        if (this.var.chart) {
            this.var.chart.dispose();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
