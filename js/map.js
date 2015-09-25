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
          infowindow.setContent(marker.title);
          infowindow.open(map, marker);
          var truckName = marker.title;
          var menuItems = data[i].menu.map(function(item) {
            return item.item;
          });
          var menuList = menuItems.join(', ');
          appendMenu(truckName, menuList);
        }
      })(marker, i));
      markerCollection.push(marker);
    }
  });
}

function getRandom() {
  clearMarkers();
  $('#menuRow').remove();
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
          infowindow.setContent(data.locations.monday.name);
          infowindow.open(map, marker);
          var truckName = data.locations.monday.name;
          var menuItems = data.menu.map(function(item) {
            return item.item;
          });
          var menuList = menuItems.join(', ');
          appendMenu(truckName, menuList);
        }
      })(marker, i));
      markerCollection.push(marker);
    },
    error: function() {
      console.log('error!');
    }
  });
}

function appendMenu(truckName, menuList) {
  $('#menuRow').remove();
  $("#main-body-container").append('<div class="row" id="menuRow" style="padding-top: 30px;"> \
              <div class="col-md-2"></div> \
              <div class="col-md-8"><h4>' + truckName + '</h4><br><p><b>Menu</b>: ' + menuList + '</p></div> \
              <div class="col-md-2"></div>\
            </div>'
  );
}

$(document).ready(function() {
  if (!sessionStorage.getItem('app_token')) logout();
  initMap();

  $('#random').click(function() {
    getRandom();
  });
});
