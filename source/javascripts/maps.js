window.onload = function() {
  if(document.getElementById('sdmaps-housing-income')) {
    cartodb.createVis('sdmaps-housing-income', 'https://milafrerichs.carto.com/api/v2/viz/95e7ecbe-e70c-11e6-9243-0e233c30368f/viz.json');
  }
  var map_2017_01_31_tract_1 = 'sdmaps-tract-9511';
  if(document.getElementById(map_2017_01_31_tract_1)) {
    var cartocss = " #housing_costs_2015_merge_copy{ polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 81.2] { polygon-fill: #B10026; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 69.6] { polygon-fill: #E31A1C; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 58] { polygon-fill: #FC4E2A; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 46.4] { polygon-fill: #FD8D3C; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 34.8] { polygon-fill: #FEB24C; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 23.2] { polygon-fill: #FED976; } #housing_costs_2015_merge_copy [ percent_hosuing_more_30 <= 11.6] { polygon-fill: #FFFFB2; }";
    cartodb.createVis(map_2017_01_31_tract_1, 'https://milafrerichs.carto.com/api/v2/viz/95e7ecbe-e70c-11e6-9243-0e233c30368f/viz.json')
      .done(function(vis, layers) {
        var layer = layers[ 1 ];
        layer.getSubLayer(2).set({
          cartocss: cartocss+" #housing_costs_2015_merge_copy[cartodb_id = 226] { line-color: #5CA2D1; line-width: 2.5; }"
        });
        var map = vis.getNativeMap();
        map.panTo([32.83, -117.102]);
        map.setZoom(13);
        $('#' + map_2017_01_31_tract_1 +' .overlay-text').remove();
      });
  }
};
