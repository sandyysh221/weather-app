let now = new Date();
let h2 = document.querySelector("h2");
let date = now.getDate();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
let day = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
h2.innerHTML = `Last updated: ${day} ${date} ${month}, ${hours}:${minutes}.`;

function showTempF(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#currentTemp");
  tempClickC.classList.remove("active");
  tempClickF.classList.add("active");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showTempC(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#currentTemp");
  tempClickF.classList.remove("active");
  tempClickC.classList.add("active");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row"><h5>Daily Forecast</h5>`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="daily-forecast">${formatForecastDay(
              forecastDay.dt
            )}</div>
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" width="42" />
            <div class="forecast-temps">
              <span class="max-temp">${Math.round(forecastDay.temp.max)}° </span
              ><span class="min-temp">${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "d8426e0d7454e83e722791e94527aed3";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

function showCurrentWeather(response) {
  let temp = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#currentTemp");
  currentTemperature.innerHTML = `${temp}`;

  let feelsElement = Math.round(response.data.main.feels_like);
  let feelsLike = document.querySelector("#feels");
  feelsLike.innerHTML = `Feels like: ${feelsElement}°`;

  let humid = Math.round(response.data.main.humidity);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${humid}%`;

  let windy = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${windy} m/s`;

  let weatherNow = response.data.weather[0].description;
  let displayCurrentWeather = document.querySelector("#currentWeather");
  displayCurrentWeather.innerHTML = `${weatherNow}`;

  let displayCityName = document.querySelector("#citySearched");
  let city = response.data.name;
  let country = response.data.sys.country;
  displayCityName.innerHTML = `${city}, ${country}`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  celciusTemperature = response.data.main.temp;

  tempClickC.classList.add("active");
  tempClickF.classList.remove("active");

  getForecast(response.data.coord);
}

function search(city) {
  let unit = "metric";
  let apiKey = "d8426e0d7454e83e722791e94527aed3";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiURL).then(showCurrentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function showCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = "metric";
  let apiKey = "d8426e0d7454e83e722791e94527aed3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function findCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let tempClickF = document.querySelector("#fahrenheit-link");
tempClickF.addEventListener("click", showTempF);

let tempClickC = document.querySelector("#celcius-link");
tempClickC.addEventListener("click", showTempC);

let celciusTemperature = null;

let form = document.querySelector("#citySearchForm");
form.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSubmit);

search("Ottawa"); //Displays default location

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", findCurrentLocation);
