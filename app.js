$(document).ready(function () {
  $("#input").val("94117");
  $("#submitbtn").on("click", function (e) {
    e.preventDefault();
    input = $("#input").val();
    $("#input").val("");
    $(".card-container").empty();

    getWeather();
  });

  function getWeather() {
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?zip=${input}&appid=c1dc5cf44c3a5ebaadb89b904175bcca`,
      dataType: "JSON",
    }).then(function (response) {
      console.log(response);
      let desc = response.weather[0].description;
      let humid = response.main.humidity;
      let tempF = convert(response.main.temp);
      let fl = convert(response.main.feels_like);
      let maxtemp = convert(response.main.temp_max);
      let mintemp = convert(response.main.temp_min);
      function convert(n) {
        var convertedLocal = (1.8 * (n - 273.15) + 32).toFixed(1);
        console.log(convertedLocal);
        return convertedLocal;
      }

      cardTemplate = $(".card-container").append(
        `<div class="card text-white bg-info mb-3" style="max-width: 18rem;">
              <div class="card-header"></div>
              <div class="card-body">
              <h5 class="card-title">Info card title</h5>
              <p class="card-text">Some quick example text.</p>
              </div>
          </div>`
      );
      var humidity = $(`<h5>`).text(humid + "% humidity; " + desc);
      var thefeels = $(`<h5>`).text("Feels like " + fl + "°");
      var where = $(`<h4>`).text(response.name + ": " + tempF + " °F");
      var range = $(`<h5>`).text(
        "Low/High: " + mintemp + " ~ " + maxtemp + "°; "
      );
      $(".card-header").prepend(where);
      $(".card-body").prepend(thefeels, humidity, range);
    });
  }
});
