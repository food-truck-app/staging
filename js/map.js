$(document).ready(function() {
  if (!sessionStorage.getItem('app_token')) logout();
  initMap();

  var map, markerCollection = [];

  function clearMarkers() {
    for (var i = 0; i < markerCollection.length; i++) {
      markerCollection[i].setMap(null);
    }
    markerCollection.length = 0;
  }

  function initMap() {
    $('#loading').remove();
    $('#main').append('<div id="map" style="width: 100%; height: 400px;"></div>');
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(47.623553, -122.335827),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    $.ajax({
      url: "/api/trucks",
      dataType: "json"
      }).success(function (data) {
      var locations = [];
      var date = new Date();
      var dateDay = date.getDay();
      var dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var day = dayArray[dateDay].toLowerCase();

      for (var i = 0; i < data.length; i++) {
        locations.push([data[i].truckname || data[i].locations[day].name, data[i].locations[day].loc[1], data[i].locations[day].loc[0], i]); 
      }

      var infowindow = new google.maps.InfoWindow();
      var marker, i;
      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map, 
          title: locations[i][0]
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            console.log(marker);
            infowindow.setContent(marker.title);
            infowindow.open(map, marker);
          }
        })(marker, i));
        markerCollection.push(marker);
      }
    });
  }

  function getRandom() {
    clearMarkers();
    $.ajax({
      type: 'get',
      url: '/api/trucks/random/random',
      dataType: 'json',
      success: function(data) {
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.locations.monday.loc[1], data.locations.monday.loc[0]),
          map: map
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(data.truckname);
            infowindow.open(map, marker);
          }
        })(marker, i));
        markerCollection.push(marker);
      },
      error: function() {
        console.log('error!');
      }
    });
  }

  $('#random').click(function() {
    getRandom();
  });
});