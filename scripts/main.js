import { fetchWeather, celsiusToFahrenheit } from "./weather-api.js";

const weatherIcon = document.querySelector("#weather-icon");
const locationEl = document.querySelector("#location");
const conditionEl = document.querySelector("#condition");
const tempEl = document.querySelector("#temperature");
const statusEl = document.querySelector("#status-message");

// null (not 0) means "no reading yet" — using 0 as that sentinel was a bug,
// since 0°C is a perfectly real temperature that would have been silently
// treated as "not loaded".
let currentTempCelsius = null;
let isCelsius = true;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("status--error", isError);
}

function renderTemperature() {
  if (currentTempCelsius === null) return;

  const value = isCelsius ? currentTempCelsius : celsiusToFahrenheit(currentTempCelsius);
  const unit = isCelsius ? "°C" : "°F";
  tempEl.textContent = `: ${value.toFixed(1)}${unit}`;
}

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  renderTemperature();
}

function renderWeather(weather) {
  locationEl.textContent = `: ${weather.location}`;
  conditionEl.textContent = `: ${weather.condition}`;
  weatherIcon.src = weather.iconUrl;
  weatherIcon.alt = weather.condition;
  weatherIcon.hidden = false;

  currentTempCelsius = weather.tempCelsius;
  isCelsius = true;
  renderTemperature();
}

function handleGeolocationSuccess(position) {
  const { latitude, longitude } = position.coords;
  setStatus("Loading weather...");

  fetchWeather(latitude, longitude)
    .then((weather) => {
      renderWeather(weather);
      setStatus("");
    })
    .catch((error) => {
      console.error(error);
      setStatus("Failed to load weather data.", true);
    });
}

function handleGeolocationError(error) {
  const messages = {
    [GeolocationPositionError.PERMISSION_DENIED]:
      "Location access denied. Please allow location access and reload the page.",
    [GeolocationPositionError.POSITION_UNAVAILABLE]:
      "Your location is currently unavailable. Please try again.",
    [GeolocationPositionError.TIMEOUT]: "Location request timed out. Please try again.",
  };

  console.error(error.message);
  setStatus(messages[error.code] ?? "Unable to retrieve your location.", true);
}

function requestLocation() {
  if (!navigator.geolocation) {
    setStatus("Your browser does not support geolocation.", true);
    return;
  }

  setStatus("Requesting your location...");
  navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
}

tempEl.addEventListener("click", toggleTemperatureUnit);
tempEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleTemperatureUnit();
  }
});

requestLocation();
