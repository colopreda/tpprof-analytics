import * as filters from '@/common/filters'

//const TOKEN = $TOKEN;
const TOKEN = "l7gjvvt9er6j8f602k05ckemig81v3d8";

export const TRIP_LIST = {
    dataUrl: `http://localhost:3002/trip-list`,
        title: 'Table list',
        tooltipText: 'Table with a list of elements that load from the url',
        data: {
        links: ['url'],
            stacked: false,
            fields: [
            {
                key: 'trip_id',
            },
            {
                key: 'total_distance',
                label: 'Total distance (km)',
                sortable: true,
                sortDirection: 'desc'
            },
            {
                key: 'avg_speed',
                label: 'Average speed (km/h)',
                sortable: true,
                sortDirection: 'desc'
            },
            {
                key: 'url',
            }
        ]
    },
    filters: []
};

export const risk_assessment_trip = {
    cf_by_severity: {
        dataUrl: `http://localhost:3002/stacked-filters`,
        title: 'Stacked bar chart',
        tooltipText: 'Stacked bar chart where all the bars are at a 100%',
        filters: [],
        data: {
            xaxis: "category",
            legend: false
        }
    },
    cf_activation: {
        dataUrl: `http://localhost:3002/gantt`,
        title: 'Gantt chart (with forced filters)',
        tooltipText: 'Gantt chart where you need to define de start date and end date, and if you want fixed range, the start range and end range',
        data: {
            value: "cf",
            start_date: "fromDate",
            end_date: "toDate",
            start_range: "first_trip_date",
            end_range: "last_trip_date"
        },
        filters: [
            filters.CF_CATEGORIES_FORCED
        ]
    },
    risk_over_time: {
        dataUrl: `http://localhost:3002/line`,
        title: 'Line chart',
        tooltipText: 'Line chart with the X axis using dates',
        data: {
            xaxis: "local_date",
            yaxis: "risk",
            xlabel: "X Axis",
            ylabel: "Y Axis",
            type: "date"
        },
        filters: []
    },
    global_score: {
        dataUrl: `http://localhost:3002/gauge`,
        title: 'Gauge chart',
        tooltipText: 'Gauge chart from 0 to 100',
        data: {
            min: 0,
            max: 100,
            stops: {
                stops: [
                    {
                        color: "#FF0000",
                        offset: 0.5
                    },
                    {
                        color: "#FFFF00",
                        offset: 0.9
                    },
                    {
                        color: "#00FF00",
                        offset: 1
                    }
                ]
            }
        },
        filters: []
    },
    matrix_heat_map: {
        dataUrl: `http://localhost:3002/matrix-heat-map`,
        title: 'Matrix Heatmap chart',
        tooltipText: 'Matrix with different colouring according to the value (this case with inverted colouring)',
        data: {
            xaxis: "start_area",
            xlabel: "X Axis",
            yaxis: "end_area",
            ylabel: "Y Axis",
            value: "avg_risk_score",
            inverted: true
        },
        filters: [
            filters.AGE_DYNAMIC,
            filters.GENDER_DYNAMIC
        ]
    },
    choropleth_map: {
        dataUrl: `http://localhost:3002/choropleth-filters`,
        title: 'Choropleth map chart',
        tooltipText: 'Map with defined zones from a geoJSON that uses the value to paint the colour',
        data: {
            map_url: 'http://localhost:8083/luxembourg.json',
            identification: 'area_code',
            home_geopoint: {
                latitude: 49.79,
                longitude: 6.09
            },
            zoom_level: 1.2,
            fill_color: "#3c5bdc"
        },
        filters: [
            filters.TOD_OBJ,
            filters.DOW_OBJ,
            filters.CF
        ]
    },
    scatter: {
        dataUrl: 'http://localhost:3002/scatter',
        title: 'Scatter chart',
        tooltipText: 'Chart with XY points and with a trend (straight line from (0,0) to (1,1)',
        filters: [
        ],
        data: {
            extradata: "canton",
            yaxis: "real",
            ylabel: "Real number of accidents",
            xaxis: "predicted",
            xlabel: "Predicted accidents (Motion-S)",
            xlabelunit:"",
            ylabelunit:"",
            trend: true
        }
    },
};

export const contextual_data_trip = {
    trip_data: {
        dataUrl: `http://localhost:3002/list-stacked`,
        title: 'Stacked table',
        tooltipText: 'Stacked table not for displaying multiple items, to show 1 row data',
        data: {
            links: [],
            stacked: true,
            fields: [
                {
                    key: 'total_distance',
                    label: 'Total distance (km)',
                },
                {
                    key: 'average_speed',
                    label: 'Average speed (km/h)',
                },
                {
                    key: 'duration',
                    label: 'Duration (min)',
                },
                {
                    key: 'locations',
                    label: 'Locations processed',
                },
                {
                    key: 'start_time'
                },
                {
                    key: 'end_time'
                }
            ]
        },
        filters: []
    },
    proportion_roadtype: {
        dataUrl: `http://localhost:3002/pie-chart`,
        title: 'Pie chart',
        tooltipText: 'Pie chart with legend',
        filters: [],
        data: {
            category: "category",
            value: "value"
        }
    },
    speed_limit: {
        dataUrl: `http://localhost:3002/line-map`,
        title: 'Line map',
        tooltipText: 'Line map defined by a polygon shape',
        data: {
            type: "line",
            start_latitude: 47.8112,
            start_longitude: 13.0331,
            start_zoom: 5,
            legend: {
                grades: ['',0, 30, 90, 200],
                labels: ["No data available", "km/h - Low", "km/h - Moderate", "km/h - High"],
                colors: {
                    "km/h - Low": "#61ba72",
                    "km/h - Moderate": "#fecf00",
                    "km/h - High": "#ea232d",
                    "No data available": "#a9a9a9"
                }
            }
        },
        filters: []
    },
    possible_speed: {
        dataUrl: `http://localhost:3002/circle-marker`,
        title: 'Cicle marker map',
        tooltipText: 'Single dot markers with color and legend',
        data: {
            latitude: "latMatched",
            longitude: "lonMatched",
            start_latitude: 47.8112,
            start_longitude: 13.0331,
            start_zoom: 5,
            type: "point",
            color: "color",
            legend: {
                grades: [],
                labels: ["No data available", "Strongly reduced speed", "Reduced speed", "Unconstrained speed"],
                colors: {
                    "Unconstrained speed": "#61ba72",
                    "Reduced speed": "#fecf00",
                    "Strongly reduced speed": "#ea232d",
                    "No data available": "#a9a9a9"
                }
            }
        },
        filters: []
    },
    bar_chart: {
        dataUrl: `http://localhost:3002/bar`,
        title: 'Bar chart',
        tooltipText: 'Bar chart with legend in 90 degrees',
        filters: [],
        data: {
            xaxis: "display_name",
            yaxis: "times",
            ylabel: "Y Axis",
            rotation: 270
        }
    },
    histogram: {
        dataUrl: `http://localhost:3002/bar-histogram`,
        title: 'Bar chart (histogram)',
        tooltipText: 'Bar chart that fills the values within the minimum and maximum with 0',
        filters: [],
        data: {
            xaxis: "category",
            yaxis: "value",
            type: "histogram",
            xlabel: "X Axis",
            ylabel: "Y Axis"
        }
    },
    pinpoint: {
        dataUrl: `http://localhost:3002/heatmap-filters`,
        title: 'Marker map',
        tooltipText: 'Map with markers with colour',
        data: {
            latitude: "latitude",
            longitude: "longitude",
            value: "value",
            start_latitude: 33.64,
            start_longitude: -117.69,
            start_zoom: 10,
            type: "pinpoint",
        },
        filters: [
            filters.CF_FORCED
        ]
    },
    heatmap_filters: {
        dataUrl: `http://localhost:3002/heatmap-filters`,
        title: 'Heatmap',
        tooltipText: 'Heatmap with filters',
        data: {
            latitude: "latitude",
            longitude: "longitude",
            value: "value",
            start_latitude: 33.64,
            start_longitude: -117.69,
            start_zoom: 10,
            type: "heatmap"
        },
        filters: [
            filters.CF_FORCED
        ]
    },
};

// HOME Dashboard

export const GENERAL_INFORMATION = {
    dataUrl: `https://analytics.motion-s.com/externalApiv1/load/10081186?token=${TOKEN}&contentType=application/json`,
    title: 'General information',
    tooltipText: 'General information of the data source',
    data: {
        links: [],
        stacked: true,
        fields: [
            {
                key: 'number_of_trips',
            },
            {
                key: 'total_distance',
                label: 'Total distance (km)'
            },
            {
                key: 'locations_processed',
            },
            {
                key: 'number_of_drivers',
            },
            {
                key: 'first_trip_date_str',
                label: 'First Trip Date'
            },
            {
                key: 'last_trip_date_str',
                label: 'Last Trip Date'
            }
        ]
    },
    filters: []
};

export const FLEET_LIST = {
    dataUrl: `https://analytics.motion-s.com/externalApiv1/load/10080346?references=&token=${TOKEN}&contentType=application/json`,
    title: 'List of the fleets',
    tooltipText: 'List of the fleets with their link to their dashboard',
    data: {
        links: ['url'],
        stacked: false
    },
    filters: []
};

// Example Stacked Bar Chart
/*
export const STACKED_BAR_CHART = {
  dataUrl: `http://url`,
  title: 'Chart title',
  filters: [
    filters.AGE
  ],
  data: {
      xaxis: "driver_gender", Value defined in json used to plot in Y axis
      legend: false (Defines if you want a legend to appear at the bottom of the chart)
  }
};
 */

// Example Pie Chart
/*
export const PIE_CHART = {
  dataUrl: `${BASE_URL}/roadtype`,
  title: 'Chart title',
  filters: [
      filters.AGE,
      filters.GENDER
  ],
  data: {
    category: "id", Value that the chart would look to create a slice
    value: "value" Value that the chart will use to create the percentages
  }
};
 */

// Example of Cloropleth Map
/*
export const CLOROPLETH_MAP = {
  dataUrl: `http://url`,
  title: 'Chart title',
  filters: [
      filters.TOD_OBJ,
      filters.DOW_OBJ,
      filters.CF
  ]
};
 */

// Example Matrix Heatmap
/*
export const MATRIX_HEATMAP = {
  dataUrl: `http://url`,
  title: 'Chart title',
  data: {
    xaxis: "start_area", Value defined in json to define the values in the X axis
    xlabel: "Start canton", Label that appears below the values in the X axis
    yaxis: "end_area", Value defined in json to define the values in the Y axis
    ylabel: "End canton", Label that appears to the left of the values in the Y axis
    value: "avg_risk_score", Value that will be used to create the heat value in the intersection
    inverted: true (If you want to have the higher value to be painted with the lighter color, set to true)
  },
  filters: [
      filters.AGE_DYNAMIC,
      filters.GENDER_DYNAMIC
  ]
};
 */

// Example Line Chart
/*
export const LINE_CHART = {
  dataUrl: `http://url`,
  title: 'Chart title',
  data: {
    xaxis: "risk_score", Values that will be displayed in X axis (numbers)
    yaxis: "number_of_trips", Values that will be displayed in Y axis (numbers)
    xlabel: "safety score", Label that appears below the values in the X axis
    ylabel: "Number of trips" Label that appears to the left of the values in the Y axis
  },
  filters: [
      filters.AGE_DYNAMIC,
      filters.GENDER_DYNAMIC
  ]
};
 */

// Example Scatter Chart
/*
export const SCATTER_CHART = {
  dataUrl: `http://url`,
  title: 'Chart title',
  filters: [
      filters.AGE,
      filters.GENDER
  ],
  data: {
    xaxis: "avg_risk", Values that will be displayed in X axis (numbers)
    xlabel: "Average Risk", Label that appears below the values in the X axis
    yaxis: "avg_distance", Values that will be displayed in Y axis (numbers)
    ylabel: "Avg. Distance", Label that appears to the left of the values in the Y axis
    xlabelunit: '', (optional) Label for the x value when you hover on a point in the chart
    ylabelunit: 'km', (optional) Label for the y value when you hover on a point in the chart
    trend: true (optional) If set to true, it will draw a line from 0;0 to 1;1
  }
};
 */

// Example Maps
/*
export const MAPS = {
    dataUrl: `http://url`,
    title: 'Chart title',
    data: {
        latitude: "latitude", Value of the latitude value in the json
        longitude: "longitude", Value of the longitude value in the json
        value: "Gforce", (used only in heatmap_ Value to be used to create the heat layer
        start_latitude: 51.54,
        start_longitude: -1.33,
        type: "heatmap" Type of chart between (heatmap, pinpoint, point, line)
    },
    filters: []
};
 */

// Example table charts
/*
export const TEST_TABLE = {
    dataUrl: `http://url`,
    title: 'Chart title',
    data: {
        links: ['url', 'url2'] Define the columns that contain links to apply html
    },
    filters: []
};
 */

// Example Gauge chart
/*
export const GAUGE_CHART = {
    dataUrl: `http://url`,
    title: 'Total risk',
    filters: []
};
 */

// Example Gantt Chart
/*
export const GANTT_CHART = {
    dataUrl: `http://url`,
    title: 'Chart title',
    data: {
        value: "cf",
        start_date: "fromDate",
        end_date: "toDate",
    },
    filters: [filters.CF_CATEGORIES_FORCED]
};
 */

//Example Curved line map
/*
export const CURVED_LINE = {
    dataUrl: `http://url`,
    title: 'Chart title',
    data: {
        start_area: "start_area", Start area for the line to be drawn (coordinates)
        end_area: "end_area", End area for the line to be drawn (coordinates)
        value: "count", Value used to define the color of the line
        start_latitude: 49.79,
        start_longitude: 6.09,
        lines: [ Definition of the different scales possible in the map
            {
                color: "#FF0000",
                maxValue: 10000,
                minValue: 1500
            },
            {
                color: "#FFFF00",
                maxValue: 1499,
                minValue: 800
            },
            {
                color: "#00FF00",
                maxValue: 799,
                minValue: 0
            }
        ]
    },
    filters: [
        filters.TOD_OBJ_DYNAMIC,
        filters.DOW_OBJ_DYNAMIC
    ]
};
 */