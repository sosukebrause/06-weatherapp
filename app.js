$(document).ready(function () {
  var apiKey = "c1dc5cf44c3a5ebaadb89b904175bcca";

  $("#input").val("94117");
  var cities = JSON.parse(localStorage.getItem("cities")) || [];
  $("#currentWeather").hide();
  $(".for-list").hide();
  $("#time").text(moment().format("LT"));

  $("#submitbtn").on("click", function (e) {
    e.preventDefault();
    input = $("#input").val();
    $("#input").val("");
    $(".card-container").empty();
    getWeather();
    $("#currentWeather").show();
    $(".for-list").show();
  });
  function convert(n) {
    var convertedLocal = (1.8 * (n - 273.15) + 32).toFixed(1);
    return convertedLocal;
  }
  function getWeather() {
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${input},us&appid=${apiKey}`,
      dataType: "JSON",
    }).then(function (response) {
      console.log(response);
      let desc = response.weather[0].description;
      let humid = response.main.humidity;
      let tempF = convert(response.main.temp);
      let fl = convert(response.main.feels_like);
      let max = convert(response.main.temp_max);
      let min = convert(response.main.temp_min);

      console.log(input);
      console.log(cities.indexOf(response.name));
      console.log(cities.indexOf(response.name) === -1);
      if (cities.indexOf(response.name) === -1) {
        cities.push(response.name);
      }
      localStorage.setItem("cities", JSON.stringify(cities));
      // console.log(cities);
      $(".list-group").html("");

      for (var i = 0; i < cities.length; i++) {
        $(".list-group").append(`
          <li class="list-group-item">${cities[i]}</li>`);
        $("li").click(function (e) {
          $("input").val($(this).text());
          // console.log($("input").val());
          $("#submitbtn").click();
        });
      }

      $("#weather").html(`
        <div class="card text-white bg-info">
          <h2 class="card-header">${response.name}</h2>
          <div class="card-body bg-light text-dark">
            <div class="row" style="justify-content:space-evenly";>
              <div class="col-6">
                <h5 class="card-title">Currently ${tempF}°</h5>
                <p class="card-text" "style=margin-left: 0";>${desc}</p> 
              </div>
              <div class="col-4">
              <img style="width:100px" "margin-right:2%"; src="https://openweathermap.org/img/wn/${response.weather[0].icon}.png">
              </div>
            </div>
          </div>     
          <div class="card-footer"></div>
        </div>`);

      var thefeels = $(`<h6>`).text("Feels like " + fl + "°");
      var humidity = $(`<h6>`).text(humid + "% humidity");
      var range = $(`<p>`).text("Min/Max: " + min + " ~ " + max + "°");
      $(".card-text").append(thefeels, humidity, range);

      $(".card-footer").prepend(moment().format("lll"));
    });
    getForecast();
  }

  function getForecast() {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?zip=${input},us&appid=${apiKey}`,
      dataType: "json",
    }).then(function (res) {
      $(".forecast").empty();
      var list = res.list;
      // console.log(list);

      for (let i = 0; i < list.length; i = i + 8) {
        $(".forecast").append(`
        <div class="mb-4">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5 class="card-title">${moment(list[i].dt_txt).format("l")}</h5>
              <div><img src="https://openweathermap.org/img/wn/${
                list[i].weather[0].icon
              }.png"</div>
              <p class="card-text">Temp: ${convert(list[i].main.temp)}°F</p>
              <p class="card-text">Humidity: ${list[i].main.humidity}%</p>
            </div>
          </div>
        </div>`);
      }
    });
  }
});

// function makeRow(city) {
//   var li = $("<li>").addClass("list-group-item").text(city);
//   $(".list-group").append(li);
//   console.log($(".card-header").text());
// }
// makeRow($(".card-header").text());
