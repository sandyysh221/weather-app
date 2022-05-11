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

let tempClickF = document.querySelector("#fahrenheit-link");
tempClickF.addEventListener("click", showTempF);

let tempClickC = document.querySelector("#celcius-link");
tempClickC.addEventListener("click", showTempC);

let units = "metric";
let coordinates = null;

let form = document.querySelector("#citySearchForm");
form.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSubmit);

search("Ottawa"); //Displays default location

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", findCurrentLocation);

let apiKey = "d8426e0d7454e83e722791e94527aed3";

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
  displayCityName.innerHTML = `${city}`;

  let displayCountry = document.querySelector("#countrySearched");
  let country = response.data.sys.country;
  let countryFull = countries[country];
  displayCountry.innerHTML = `${countryFull}`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  coordinates = response.data.coord;

  getForecast();
}

function search(city) {
  let apiKey = "d8426e0d7454e83e722791e94527aed3";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
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

  searchLocation(latitude, longitude);
}

function searchLocation(latitude, longitude) {
  let apiKey = "d8426e0d7454e83e722791e94527aed3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function findCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

function showTempF(event) {
  event.preventDefault();
  tempClickC.classList.remove("active");
  tempClickF.classList.add("active");

  units = "imperial";
  searchLocation(coordinates.lat, coordinates.lon);
}

function showTempC(event) {
  event.preventDefault();
  tempClickF.classList.remove("active");
  tempClickC.classList.add("active");

  units = "metric";
  searchLocation(coordinates.lat, coordinates.lon);
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
            }@2x.png" alt="" width="70" />
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

function getForecast() {
  let apiKey = "d8426e0d7454e83e722791e94527aed3";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

let countries = {
  BD: "Bangladesh",
  BE: "Belgium",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BA: "Bosnia and Herzegovina",
  BB: "Barbados",
  WF: "Wallis and Futuna",
  BL: "Saint Barthelemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BT: "Bhutan",
  JM: "Jamaica",
  BV: "Bouvet Island",
  BW: "Botswana",
  WS: "Samoa",
  BQ: "Bonaire, Saint Eustatius and Saba ",
  BR: "Brazil",
  BS: "Bahamas",
  JE: "Jersey",
  BY: "Belarus",
  BZ: "Belize",
  RU: "Russia",
  RW: "Rwanda",
  RS: "Serbia",
  TL: "East Timor",
  RE: "Reunion",
  TM: "Turkmenistan",
  TJ: "Tajikistan",
  RO: "Romania",
  TK: "Tokelau",
  GW: "Guinea-Bissau",
  GU: "Guam",
  GT: "Guatemala",
  GS: "South Georgia and the South Sandwich Islands",
  GR: "Greece",
  GQ: "Equatorial Guinea",
  GP: "Guadeloupe",
  JP: "Japan",
  GY: "Guyana",
  GG: "Guernsey",
  GF: "French Guiana",
  GE: "Georgia",
  GD: "Grenada",
  GB: "United Kingdom",
  GA: "Gabon",
  SV: "El Salvador",
  GN: "Guinea",
  GM: "Gambia",
  GL: "Greenland",
  GI: "Gibraltar",
  GH: "Ghana",
  OM: "Oman",
  TN: "Tunisia",
  JO: "Jordan",
  HR: "Croatia",
  HT: "Haiti",
  HU: "Hungary",
  HK: "Hong Kong",
  HN: "Honduras",
  HM: "Heard Island and McDonald Islands",
  VE: "Venezuela",
  PR: "Puerto Rico",
  PS: "Palestinian Territory",
  PW: "Palau",
  PT: "Portugal",
  SJ: "Svalbard and Jan Mayen",
  PY: "Paraguay",
  IQ: "Iraq",
  PA: "Panama",
  PF: "French Polynesia",
  PG: "Papua New Guinea",
  PE: "Peru",
  PK: "Pakistan",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Poland",
  PM: "Saint Pierre and Miquelon",
  ZM: "Zambia",
  EH: "Western Sahara",
  EE: "Estonia",
  EG: "Egypt",
  ZA: "South Africa",
  EC: "Ecuador",
  IT: "Italy",
  VN: "Vietnam",
  SB: "Solomon Islands",
  ET: "Ethiopia",
  SO: "Somalia",
  ZW: "Zimbabwe",
  SA: "Saudi Arabia",
  ES: "Spain",
  ER: "Eritrea",
  ME: "Montenegro",
  MD: "Moldova",
  MG: "Madagascar",
  MF: "Saint Martin",
  MA: "Morocco",
  MC: "Monaco",
  UZ: "Uzbekistan",
  MM: "Myanmar",
  ML: "Mali",
  MO: "Macao",
  MN: "Mongolia",
  MH: "Marshall Islands",
  MK: "Macedonia",
  MU: "Mauritius",
  MT: "Malta",
  MW: "Malawi",
  MV: "Maldives",
  MQ: "Martinique",
  MP: "Northern Mariana Islands",
  MS: "Montserrat",
  MR: "Mauritania",
  IM: "Isle of Man",
  UG: "Uganda",
  TZ: "Tanzania",
  MY: "Malaysia",
  MX: "Mexico",
  IL: "Israel",
  FR: "France",
  IO: "British Indian Ocean Territory",
  SH: "Saint Helena",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falkland Islands",
  FM: "Micronesia",
  FO: "Faroe Islands",
  NI: "Nicaragua",
  NL: "Netherlands",
  NO: "Norway",
  NA: "Namibia",
  VU: "Vanuatu",
  NC: "New Caledonia",
  NE: "Niger",
  NF: "Norfolk Island",
  NG: "Nigeria",
  NZ: "New Zealand",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  CK: "Cook Islands",
  XK: "Kosovo",
  CI: "Ivory Coast",
  CH: "Switzerland",
  CO: "Colombia",
  CN: "China",
  CM: "Cameroon",
  CL: "Chile",
  CC: "Cocos Islands",
  CA: "Canada",
  CG: "Republic of the Congo",
  CF: "Central African Republic",
  CD: "Democratic Republic of the Congo",
  CZ: "Czech Republic",
  CY: "Cyprus",
  CX: "Christmas Island",
  CR: "Costa Rica",
  CW: "Curacao",
  CV: "Cape Verde",
  CU: "Cuba",
  SZ: "Swaziland",
  SY: "Syria",
  SX: "Sint Maarten",
  KG: "Kyrgyzstan",
  KE: "Kenya",
  SS: "South Sudan",
  SR: "Suriname",
  KI: "Kiribati",
  KH: "Cambodia",
  KN: "Saint Kitts and Nevis",
  KM: "Comoros",
  ST: "Sao Tome and Principe",
  SK: "Slovakia",
  KR: "South Korea",
  SI: "Slovenia",
  KP: "North Korea",
  KW: "Kuwait",
  SN: "Senegal",
  SM: "San Marino",
  SL: "Sierra Leone",
  SC: "Seychelles",
  KZ: "Kazakhstan",
  KY: "Cayman Islands",
  SG: "Singapore",
  SE: "Sweden",
  SD: "Sudan",
  DO: "Dominican Republic",
  DM: "Dominica",
  DJ: "Djibouti",
  DK: "Denmark",
  VG: "British Virgin Islands",
  DE: "Germany",
  YE: "Yemen",
  DZ: "Algeria",
  US: "United States",
  UY: "Uruguay",
  YT: "Mayotte",
  UM: "United States Minor Outlying Islands",
  LB: "Lebanon",
  LC: "Saint Lucia",
  LA: "Laos",
  TV: "Tuvalu",
  TW: "Taiwan",
  TT: "Trinidad and Tobago",
  TR: "Turkey",
  LK: "Sri Lanka",
  LI: "Liechtenstein",
  LV: "Latvia",
  TO: "Tonga",
  LT: "Lithuania",
  LU: "Luxembourg",
  LR: "Liberia",
  LS: "Lesotho",
  TH: "Thailand",
  TF: "French Southern Territories",
  TG: "Togo",
  TD: "Chad",
  TC: "Turks and Caicos Islands",
  LY: "Libya",
  VA: "Vatican",
  VC: "Saint Vincent and the Grenadines",
  AE: "United Arab Emirates",
  AD: "Andorra",
  AG: "Antigua and Barbuda",
  AF: "Afghanistan",
  AI: "Anguilla",
  VI: "U.S. Virgin Islands",
  IS: "Iceland",
  IR: "Iran",
  AM: "Armenia",
  AL: "Albania",
  AO: "Angola",
  AQ: "Antarctica",
  AS: "American Samoa",
  AR: "Argentina",
  AU: "Australia",
  AT: "Austria",
  AW: "Aruba",
  IN: "India",
  AX: "Aland Islands",
  AZ: "Azerbaijan",
  IE: "Ireland",
  ID: "Indonesia",
  UA: "Ukraine",
  QA: "Qatar",
  MZ: "Mozambique",
};
