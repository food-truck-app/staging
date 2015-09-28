var locations = [
  ['Explosiv', 47.623380, -122.335773, 7],
  ["Sam Choy\'s Poke", 47.623229, -122.337320, 6],
  ['Pie Pie', 47.623380, -122.335853, 5],
  ['Hungry Me', 47.623385, -122.335778, 4],
  ['Buddah Bruddah', 47.623234, -122.337325, 3],
  ['Tacos El Tajin', 47.623390, -122.335783, 2],
  ['Djung On Wheels', 47.623393, -122.335858, 1]
];

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 17,
  center: new google.maps.LatLng(47.623553, -122.335827),
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var infowindow = new google.maps.InfoWindow();

var marker, i;

for (i = 0; i < locations.length; i++) {  
  marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    map: map
  });

  google.maps.event.addListener(marker, 'click', (function(marker, i) {
    return function() {
      infowindow.setContent(locations[i][0]);
      infowindow.open(map, marker);
    }
  })(marker, i));
}