var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5
});

var outdoors_background= L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NDg1bDA1cjYzM280NHJ5NzlvNDMifQ.d6e-nNyBDtmQCVwVNivz7A#2/0/0', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/outdoors-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
}).addTo(myMap);


var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

var baseMaps = {
  Outdoors: outdoors_background
};

var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": earthquakes
};

L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
 
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#EA2C2C";
      case magnitude > 4:
        return "#EA822C";
      case magnitude > 3:
        return "#EE9C00";
      case magnitude > 2:
        return "#EECC00";
      case magnitude > 1:
        return "#D4EE00";
      default:
        return "#98EE00";
    }
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }
  
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);
  earthquakes.addTo(myMap);
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98EE00",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#EA2C2C"
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
 
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);
     
      tectonicplates.addTo(myMap);
    });
});