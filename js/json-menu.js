$(document).ready(function () {
  $.getJSON('/api/trucks', function (data) {
    var cuisineList = function (data) {
      var ul1 = $(".cuisine-dropdown");
      var cuisines = [];
      $.each(data, function (key, val) {
        var cuisine = val.cuisine;
        cuisines.push(cuisine);
      });
      var sortedCuisines = cuisines.sort();
      var results = [];
      for (var i = 0; i < cuisines.length; i++) {
        if (sortedCuisines[i + 1] != sortedCuisines[i]) {
          results.push(sortedCuisines[i]);
          ul1.append("<li id='cuisine" + i + "'><a href='#'>" + sortedCuisines[i] + "</a></li>");
        }
      }
    };
    var truckList = function (data) {
      var ul2 = $(".truck-dropdown");
      $.each(data, function (key, val) {
        var date = new Date();
        var dateDay = date.getDay();
        var dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var day = dayArray[dateDay].toLowerCase();

        var truckName = val.truckname || val.locations[day].name;
        ul2.append("<li id='truck" + key + "'><a href='#'>" + truckName + "</a></li>");
      });
    };
    cuisineList(data);
    truckList(data);
  });
});
