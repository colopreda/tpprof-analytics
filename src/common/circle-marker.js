L.DivIcon.SVGIcon.CircleIcon = L.DivIcon.SVGIcon.extend({
    initialize: function(options) {
        options = L.Util.setOptions(this, options)
        options.circleAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.y)/2)
        L.DivIcon.SVGIcon.prototype.initialize.call(this, options)

        return options
    },
    _createPathDescription: function() {
        return "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    }
})

L.divIcon.svgIcon.circleIcon = function(options) {
    return new L.DivIcon.SVGIcon.CircleIcon(options)
}

L.Marker.SVGMarker.CircleMarker = L.Marker.SVGMarker.extend({
    options: {
        "iconFactory": L.divIcon.svgIcon.circleIcon
    }
})

L.marker.svgMarker.circleMarker = function(latlng, options) {
    return new L.Marker.SVGMarker.CircleMarker(latlng, options)
}
