$(document).ready(function () {
  $("#input").val("94117");
  var cities = JSON.parse(localStorage.getItem("cities")) || [];
  $("#submitbtn").on("click", function (e) {
    e.preventDefault();
    input = $("#input").val();
    $("#input").val("");
    $(".card-container").empty();
    getWeather();
    searchList();
  });

  function getWeather() {
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${input},us&appid=c1dc5cf44c3a5ebaadb89b904175bcca`,
      dataType: "JSON",
    }).then(function (response) {
      console.log(response);
      let desc = response.weather[0].description;
      let humid = response.main.humidity;
      let tempF = convert(response.main.temp);
      let fl = convert(response.main.feels_like);
      let max = convert(response.main.temp_max);
      let min = convert(response.main.temp_min);
      function convert(n) {
        var convertedLocal = (1.8 * (n - 273.15) + 32).toFixed(1);
        return convertedLocal;
      }
      console.log(input);
      console.log(cities);
      console.log(cities.indexOf(response.name));

      if (cities.indexOf(response.name) === -1) {
        cities.push(response.name);
      }
      localStorage.setItem("cities", JSON.stringify(cities));
      console.log(cities);

      cardTemplate = $(".card-container").append(`
        <div class="card text-white bg-info mb-3" style="max-width: 18rem;">
          <div class="card-header"></div>
          <div class="card-body">
            <h5 class="card-title"></h5>
            <p class="card-text"></p>
          <div class="card-footer"></div>
          </div>
        </div>`);

      var humidity = $(`<h6>`).text(humid + "% humidity; " + desc);
      var thefeels = $(`<h6>`).text("Feels like " + fl + "°");
      var range = $(`<p>`).text("Min/Max: " + min + " ~ " + max + "°");
      $(".card-header").prepend(response.name);
      $(".card-footer").prepend(moment().format("lll"));
      $(".card-text").prepend("Currently " + tempF + "°");
      $(".card-text").append(thefeels, humidity, range);

      function searchList(city) {
        $(".list-group").append(`
        <li class="list-group-item">${city}</li>`);
        window.localStorage.setItem("history", JSON.stringify(city));
      }
      searchList($(".card-header").text());
    });
  }
  $("#time").text(moment().format("LT"));
});

// function makeRow(city) {
//   var li = $("<li>").addClass("list-group-item").text(city);
//   $(".list-group").append(li);
//   console.log($(".card-header").text());
// }
// makeRow($(".card-header").text());
