$(document).ready(function() {
  var accessToken = 'pk.eyJ1IjoibWlsYWZyZXJpY2hzIiwiYSI6IkNTOW8tQTgifQ.1Dh_DEF5--fPq_t0mhIkQA';
  var styleUrl = 'mapbox://styles/milafrerichs/cixgdp9dn00nb2qo91x6jiuva';

  L.mapbox.accessToken = accessToken;
  var map = L.mapbox.map('map', 'examples.map-20v6611k', {zoomControl: false})
      .setView([32.7439961,-117.0418957], 12);
  L.mapbox.styleLayer(styleUrl).addTo(map);
});
