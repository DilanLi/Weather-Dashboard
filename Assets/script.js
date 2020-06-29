$(document).ready(function() {
    
    //use moment.js library to display day of week and date
    var currentDay = moment().format('MMMM Do YYYY');
    var currentTime = moment().format('h:mm a');
    var currentDayOfWeek = moment().format("dddd");
    var currentInfo = currentDayOfWeek + ", " + currentDay;
    $("#date").text(currentInfo);
    $("#current-time").text(currentTime);
    var city = "salt lake city";
    
    //this function dynamically updates hours and seconds on the html
    function updateTime(){
        currentTime = moment().format('h:mm a');
        $("#current-time").text(currentTime);
    }
    setInterval(updateTime, 59000);

    getWeather();

    function getWeather(){
    
      queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=17ffeabcb0395a48b5f63a70619d8c8e"
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
        //   console.log(response);
        console.log(response);
        $("#city-name").text(response.name);
        var weatherIconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
        $("#weather-icon").attr("src", weatherIconURL);
        var tempMax = "Highest Temperature: " + ((response.main.temp_max - 273.15) * 1.80 + 32).toFixed(1) + " °F";
        $("#temperature-max").text(tempMax);
        var tempMin = "Lowest Temperature: " + ((response.main.temp_min - 273.15) * 1.80 + 32).toFixed(1) + " °F";
        $("#temperature-min").text(tempMin);
        $("#humidity").text("Humidity: " + response.main.humidity + " %");
        $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        secondQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=17ffeabcb0395a48b5f63a70619d8c8e";

        $.ajax({
            url: secondQueryURL,
            method: "GET"
          })
            .then(function(response) {
              console.log(response);
              $("#uv-index").text("UV Index: " + response.current.uvi)

              for (i=1;i<=5;i++){
                var timeStamp = response.daily[i].dt * 1000;
                var dateLine = new Date(timeStamp);
                var options = {year: 'numeric', month: 'numeric', day: 'numeric'};
                var dateForecast = dateLine.toLocaleString("en-US", options);
                var forecastDiv = $("<div>").css({
                                            "background-color": "#93dded",
                                            "margin": "20px",
                                            "padding": "15px",
                                            "float": "left"
                                        });
                var dateElm = $("<p>").text(dateForecast);
                forecastDiv.append(dateElm);
                $(".five-day-forecast").append(forecastDiv);
                var iconUrl = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
                var logo = $("<img>").attr("src", iconUrl)
                forecastDiv.append(logo);
                var temp = ((response.daily[i].temp.day - 273.15)* 1.80 + 32).toFixed(2) + " °F";
                var tempElm = $("<p>").text("Temp: " + temp);
                forecastDiv.append(tempElm);
                var humidityElm = $("<p>").text("Humidity: " + response.daily[i].humidity + " %");
                forecastDiv.append(humidityElm);
              }
          
        });

    });
    }


    $("#search").click(function(){
      event.preventDefault();
      var city = $("#city").val();
      // localStorage.setItem("defaultCity", city);
      // var city = localStorage.getItem("defaultCity");
      getWeather();
    })

});