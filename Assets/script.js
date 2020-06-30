$(document).ready(function() {
    
    var city;
    //use moment.js library to display day of week and date
    var currentDay = moment().format('MMMM Do YYYY');
    var currentDayOfWeek = moment().format("dddd");
    var currentInfo = currentDayOfWeek + ", " + currentDay;
    $("#date").text(currentInfo);
    var searchedCities = [];

    displayHistory();

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
        $("#city-name").css("font-size", "1.5em");
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
              var uvIndex = response.current.uvi;
              $("#uv-container").text("UV Index: ");
              $("#uv-index").text(uvIndex);
              if (uvIndex < 6) {
                $("#uv-index").css("background-color", "#27cf2a");
              } else if (uvIndex > 6 && uvIndex < 8) {
                $("#uv-index").css("background-color", "#f0c543");
              } else if (uvIndex >= 8) {
                $("#uv-index").css("background-color", "#e35262");
              }

              $(".five-day-forecast").empty();
              for (i=1;i<=5;i++){
                var timeStamp = response.daily[i].dt * 1000;
                var dateLine = new Date(timeStamp);
                var options = {year: 'numeric', month: 'numeric', day: 'numeric'};
                var dateForecast = dateLine.toLocaleString("en-US", options);
                var forecastDiv = $("<div>").css({
                                            "background-color": "#93dded",
                                            "margin": "20px",
                                            "padding": "15px",
                                            "float": "left",
                                            "border-radius": "10px"
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

    function displayHistory(){
      $(".list-group").empty();
      citiesToDisplay = JSON.parse(localStorage.getItem("searchedCities"));
      for (i=0; i < citiesToDisplay.length; i++){
        var liElm = $("<li>").text(citiesToDisplay[i]);
        liElm.addClass("list-group-item");
        $(".list-group").append(liElm);    
      }
    }


    $("#search").click(function(){
      event.preventDefault();
      if (city !== ""){
        city = $("#city").val();
      };
      searchedCities.push(city);
      console.log(searchedCities);

      //for every search, create a city tab in the "Your Favorite Cities" panel
      var liElm = $("<li>").text(city);
      liElm.addClass("list-group-item");
      $(".list-group").append(liElm);  
      getWeather();

      localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    })

    $(".list-group-item").click(function(){
      alert("clicked!");
      city = $(this).text();
      getWeather();
    })
});