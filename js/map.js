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
                  cuisine: truck.cuisine,
                  days: truck.locations
              }
          );
      }

      var infowindow = new google.maps.InfoWindow();
      var marker, i;

      for (i = 0; i < locations.length; i++) {
        var location = locations[i];

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
            var truckName = data[i].locations.monday.name;
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
    function onChangeCuisine (cuisineType) {
      if (markerCollection.length === 1) {
        $('#menuRow').remove();
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
                      cuisine: truck.cuisine,
                      days: truck.locations
                  }
              );
          }

          var infowindow = new google.maps.InfoWindow();
          var marker, i;

          for (i = 0; i < locations.length; i++) {
            var location = locations[i];

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
                var truckName = data[i].locations.monday.name;
                var menuItems = data[i].menu.map(function(item) {
                  return item.item;
                });
                var menuList = menuItems.join(', ');
                appendMenu(truckName, menuList);
              }
            })(marker, i));
            markerCollection.push(marker);
          }
          for (var i = 0; i < markerCollection.length; i++) {
            var mapMarker = markerCollection[i];
            if (mapMarker.cuisine === cuisineType) {
              mapMarker.setVisible(true);
            }
            else {
              mapMarker.setVisible(false);
            };
          }
        });
      } else {
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
    }

  function onChangeTruck (trucksName) {
    if (markerCollection.length === 1) {
      $('#menuRow').remove();
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
                    cuisine: truck.cuisine,
                    days: truck.locations
                }
            );
        }

        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        for (i = 0; i < locations.length; i++) {
          var location = locations[i];

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
              var truckName = data[i].locations.monday.name;
              var menuItems = data[i].menu.map(function(item) {
                return item.item;
              });
              var menuList = menuItems.join(', ');
              appendMenu(truckName, menuList);
            }
          })(marker, i));
          markerCollection.push(marker);
        }
        for (var i = 0; i < markerCollection.length; i++) {
          var mapMarker = markerCollection[i];
          if (mapMarker.truck === trucksName) {
            mapMarker.setVisible(true);
          }
          else {
            mapMarker.setVisible(false);
          }
        }
      });
    } else {
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

  $('.cuisine-dropdown')
    .on('click', 'a', function (event) {
      var target = $(event.target);
      var cuisineType = target.text();
      onChangeCuisine(cuisineType);
    });


  $('.truck-dropdown')
    .on('click', 'a', function (event) {
      var target = $(event.target);
      var trucksName = target.text();
      onChangeTruck(trucksName);
    });

  $('#random').click(function() {
    getRandom();
  });
});

