
$(document).ready(function () {
    var cities = [];
    var response = {}
    $apiKey = "4908158d19074a732d9fcf591a613000";
    $baseUrl = "https://api.openweathermap.org/data/2.5/";
    // forecast
    // weather

    var today = new Date();
    // var currentDate = now.format("dddd MMM. D, YYYY");

    $('#searchButton').click(function () {

        var cityName = $('#searchBar').val();

        getWeather(cityName);
    })
    $('#deleteHistory').click(function () {
        deleteHistory()
    })
    function init() {
        setTodayDate();
        getLocalStorage()
        cities.forEach(city => {
            displayCity(city);
        });
        var lastCityIndex = cities.length - 1;
        if (cities[lastCityIndex] !== undefined) {
            getWeatherCurrent(cities[lastCityIndex], false);
            getWeatherForecast(cities[lastCityIndex]);
        } else {
            getWeatherCurrent("Ankara", false);
            getWeatherForecast("Ankara");
        }
    }
    init();

    function getWeather(city) {
        var lastCityIndex = cities.length - 1;
        if (cities[lastCityIndex] !== city) {
            getWeatherCurrent(city);
            getWeatherForecast(city);
        } else {
            setLocalStorage(city)
            displayCity(city)
        }

    }

    function setTodayDate() {
        $("#todayDate").text(today.toDateString());
    }
    function getWeatherCurrent(city, isSave = true) {
        $.ajax({
            type: "get",
            url: $baseUrl + "weather",
            data: {
                q: city,
                appid: $apiKey,
            },
            success: function (res) {
                response.current = res;
                showWeather(response.current)
                if (isSave) {
                    displayCity(city)
                    setLocalStorage(city)
                }
            }
        });
    }
    function showWeather(data) {
        $("#city").text(data.name);
        $("#conditions").text(data.weather[0].main);
        $("#temperature").text(`${((parseInt(data.main.temp)) - 273.15).toFixed(2)}\u00B0 C`);
        $("#humidity").text(`${data.main.humidity}%`);
        $("#wind-speed").text(`${data.wind.speed} mph`);
    }
    function displayCity(city) {
        var li = $("<li>");
        li.addClass("list-group-item search-item");
        li.text(city);
        $("#search-history").prepend(li);
    }
    function getWeatherForecast(city) {
        $.ajax({
            type: "get",
            url: $baseUrl + "forecast",
            data: {
                q: city,
                appid: $apiKey,
            },
            success: function (res) {
                response.forecast = res
                displayForecast(response.forecast)
            }
        });
    }
    function createForecast(data) {
        forecastData = [];

        for (let i = 1; i < data.list.length; i += 8) {
            forecastData.push(data.list[i])
        }
        return forecastData
    }
    function displayForecast(data) {
        var forecast = createForecast(data);

        $.each(forecast, function (i, day) {

            var date = dayjs(day.dt_txt).format("MMM. D");
            var year = dayjs(day.dt_txt).format("YYYY");

            //TODO: icon

            $(`#day-${i + 1}-date`).text(date);
            $(`#day-${i + 1}-year`).text(year);
            $(`#day-${i + 1}-conditions`).text(day.weather[0].main);
            $(`#day-${i + 1}-temp`).text(`${(parseInt(day.main.temp) - 273.15).toFixed(2)}\u00B0 C`);
            $(`#day-${i + 1}-humidity`).text(`${day.main.humidity}% Humidity`);
        });

    }
    function setLocalStorage(city) {
        getLocalStorage();
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    function getLocalStorage() {
        if (localStorage.getItem("cities") === null) {
            cities = [];
        } else {
            cities = JSON.parse(localStorage.getItem("cities"));
        }
    }
    function deleteHistory() {
        cities = [];
        localStorage.clear();
        $(".search-item").remove();
    }


})