var queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"+"2014-01-02&maxlongitude=180.0&minlongitude=-180.0&maxlatitude=90.0&minlatitude=-90.0";

d3.json(queryUrl, function(data){
    createFeatures(data.features);
});

function createFeatures (earthquakeData){
    function onEachFeature(feature,layer){
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + new Location(geometry.point.coordinates) + "</p>");
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    createMap(earthquakes);
}

function createMap(earthquakes){

}
var myMap = L.map("map", {
    center: [0.00,0.00],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);