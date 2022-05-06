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

//Celcius Fahrenheit Conversion
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

//Searched Weather Result
function showCurrentWeather(response) {
  let temp = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#currentTemp");
  currentTemperature.innerHTML = `${temp}°C`;

  let humid = Math.round(response.data.main.humidity);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${humid}%`;

  let windy = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${windy} km/h`;

  let weatherNow = response.data.weather[0].description;
  let displayCurrentWeather = document.querySelector("#currentWeather");
  displayCurrentWeather.innerHTML = `${weatherNow}`;

  let displayCityName = document.querySelector("#citySearched");
  displayCityName.innerHTML = response.data.name;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  celciusTemperature = response.data.main.temp;
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

//Current Location Weather
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

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", findCurrentLocation);
