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
        var truck = data[i];
//        locations.push([truck.truckname || truck.locations[day].name, truck.locations[day].loc[1], truck.locations[day].loc[0], i]); 
          locations.push
          (
              {
                  name: truck.truckname || truck.locations[day].name,
                  lat: truck.locations[day].loc[1],
                  lon: truck.locations[day].loc[0],
                  cuisine: truck.cuisine
              }
          );
      }

      var infowindow = new google.maps.InfoWindow();
      var marker, i;

      for (i = 0; i < locations.length; i++) {
        var location = locations[i];
        console.log(location);
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(location.lat, location.lon),
          map: map, 
          title: location.name
        });
        marker.cuisine = location.cuisine;
        console.log(marker.cuisine);
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

  function onChangeCuisine (cuisineType) {
    for (var i = 0; i < markerCollection.length; i++) {
      var mapMarker = markerCollection[i];
      if (mapMarker.cuisine === cuisineType) {
        mapMarker.setVisible(true);
      }
      else {
        mapMarker.setVisible(false);
      };
    }
  }

  $('.cuisine-dropdown')
    .on('click', 'a', function (event) {
        var target = $(event.target);
        var cuisineType = target.text();
        onChangeCuisine(cuisineType);
    });

  function getRandom () {
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