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
        //console.log(truck.locations);
//        locations.push([truck.truckname || truck.locations[day].name, truck.locations[day].loc[1], truck.locations[day].loc[0], i]); 
        locations.push
        (
            {
                name: truck.truckname || truck.locations[day].name,
                lat: truck.locations[day].loc[1],
                lon: truck.locations[day].loc[0],
                cuisine: truck.cuisine,
                days: truck.locations
            }
        );
      }

      var infowindow = new google.maps.InfoWindow();
      var marker, i;

      for (i = 0; i < locations.length; i++) {
        var location = locations[i];
       // console.log(location);
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(location.lat, location.lon),
          map: map, 
          title: location.name
        });
        marker.cuisine = location.cuisine;
        marker.days = location.days;
        marker.truck = location.name;

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

  function onChangeDay (dayOfWeek) {
    for (var i = 0; i < markerCollection.length; i++) {
      var mapMarker = markerCollection[i];
      var mapDays = mapMarker.days;
      var mapDayArray = [mapDays.sunday, mapDays.monday, mapDays.tuesday, mapDays.wednesday, mapDays.thursday, mapDays.friday, mapDays.saturday, mapDays.sunday];
      for (var j = 0; j < mapDayArray.length; j++) {
        console.log(mapDayArray[j])
        console.log(mapDays[dayOfWeek] + ": This is mapDays[dayOfWeek]");
        if (mapDayArray[j] == mapDays[dayOfWeek]) {
          mapMarker.setVisible(true);
        }
      }
    }
  }

  function onChangeTruck (trucksName) {
    for (var i = 0; i < markerCollection.length; i++) {
      var mapMarker = markerCollection[i];
      if (mapMarker.truck === trucksName) {
        mapMarker.setVisible(true);
      }
      else {
        mapMarker.setVisible(false);
      }
    }
  }

  $('.cuisine-dropdown')
    .on('click', 'a', function (event) {
      var target = $(event.target);
      var cuisineType = target.text();
      onChangeCuisine(cuisineType);
    });

  $('.day-dropdown')
    .on('click', 'a', function (event) {
      var target = $(event.target);
      var dayOfWeek = target.text().toLowerCase();
      onChangeDay(dayOfWeek);
    });

  $('.truck-dropdown')
    .on('click', 'a', function (event) {
      var target = $(event.target);
      var trucksName = target.text();
      onChangeTruck(trucksName);
    });

  function getRandom () {
    clearMarkers();
    $.ajax({
      type: 'get',
      url: '/api/trucks/random/random',
      dataType: 'json',
      success: function(data) {
        var locations = [];
        var date = new Date();
        var dateDay = date.getDay();
        var dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var day = dayArray[dateDay].toLowerCase();

        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.locations[day].loc[1], data.locations[day].loc[0]),
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