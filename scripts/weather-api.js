const WEATHER_API_URL = "https://weather-proxy.freecodecamp.rocks/api/current";
const ICON_BASE_URL = "https://cdn.freecodecamp.org/weather-icons";

/**
 * Fetches current weather for a coordinate pair.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{ location: string, condition: string, iconUrl: string, tempCelsius: number }>}
 */
export async function fetchWeather(lat, lon) {
  const url = `${WEATHER_API_URL}?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  const data = await response.json();

  return {
    location: data.name,
    condition: data.weather[0].main,
    // The API returns an icon *code* (e.g. "04d"), not a full URL — this
    // was being assigned directly to <img src> before, which 404'd.
    iconUrl: `${data.weather[0].icon}`,
    tempCelsius: data.main.temp,
  };
}

/**
 * Converts a Celsius temperature to Fahrenheit.
 * @param {number} celsius
 * @returns {number}
 */
export function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
