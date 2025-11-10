const loca = document.querySelector("#location");
const weather = document.querySelector("#weather");
const weatherImg = document.querySelector("#weather-img");
const temp = document.querySelector("#temp");
document.addEventListener("DOMContentLoaded", getLocation);

function getLocation() {
  if (!navigator.geolocation) {
    console.log("Browser kamu tidak mendukung Geolocation.");
    return;
  }
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position) {
  const lat = position.coords.latitude.toFixed(3);
  const lon = position.coords.longitude.toFixed(3);
  fetchWeather(lat, lon)
    .then((data) => {
      // perubahan setelah data dipanggil
      console.log(data);
      loca.innerHTML = data.name;
      weather.innerHTML = data.weather[0].main;
      weatherImg.setAttribute("src", data.weather[0].icon);
      temp.innerHTML = data.main.temp.toFixed(1) + "&deg;C";
    })
    .catch((error) => {
      console.log("Gagal memuat data cuaca: " + error.message);
    });
}

function onError(error) {
  console.log("Gagal mendapatkan lokasi: " + error.message);
}

async function fetchWeather(lat, lon) {
  const url = `https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${lon}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal mengambil data API");
  return response.json();
}

temp.addEventListener("click", function () {
  const arr = this.innerHTML.split("°");
  console.log(arr);
  if (arr[1] === "C") {
    arr[0] = (Number((arr[0] * 9) / 5) + 32).toFixed(1);
    arr[1] = "F";
    this.innerHTML = arr.join("°");
  } else if (arr[1] === "F") {
    arr[0] = (((Number(arr[0]) - 32) * 5) / 9).toFixed(1);
    arr[1] = "C";
    this.innerHTML = arr.join("°");
  }
  // this.innerHTML = ;
});
