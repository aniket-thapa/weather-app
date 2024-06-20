// API Key
const API_KEY = "7975f5b62819e24b7dc56d3a44ce862c";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".userInfoContainer");
const grantAccessContainer = document.querySelector(".grantLocationContainer");
const loadingContainer = document.querySelector(".loadingContainer");
const notFound = document.querySelector(".errorContainer");
const errorBtn = document.querySelector("[data-errorButton]");
const errorText = document.querySelector("[data-errorText]");
const errorImage = document.querySelector("[data-errorImg]");
const forecastContainer = document.querySelector(".forecastContainer");

let currentTab = userTab;
currentTab.classList.add("currentTab");
getFromSessionStorage();

function switchTab(newTab) {
  notFound.classList.remove("active");
  if (currentTab !== newTab) {
    currentTab.classList.remove("currentTab");
    currentTab = newTab;
    currentTab.classList.add("currentTab");

    if (!searchForm.classList.contains("active")) {
      searchForm.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("userCoordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchWeatherInfo(coordinates);
  }
}

async function fetchWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingContainer.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    fetchForecastInfo(lat, lon); // Fetch the 5-day forecast
  } catch (err) {
    loadingContainer.classList.remove("active");
    notFound.classList.add("active");
    errorImage.style.display = "none";
    errorText.innerText = `Error: ${err?.message}`;
    errorBtn.style.display = "block";
    errorBtn.addEventListener("click", fetchWeatherInfo);
  }
}

async function fetchForecastInfo(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    renderForecastInfo(data);
  } catch (err) {
    console.error("Error fetching forecast data:", err);
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryFlag = document.querySelector("[data-countryFlag]");
  const description = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  cityName.innerText = weatherInfo?.name;
  countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  description.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
  clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}

function renderForecastInfo(forecastInfo) {
  forecastContainer.innerHTML = "";
  const forecastList = forecastInfo.list;
  const dailyData = {};

  forecastList.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(entry);
  });

  Object.keys(dailyData)
    .slice(0, 5)
    .forEach((date) => {
      const dayData = dailyData[date];
      const daySummary = {
        temp: [],
        weather: {},
        clouds: [],
        wind: [],
        humidity: [],
      };

      dayData.forEach((entry) => {
        daySummary.temp.push(entry.main.temp);
        daySummary.clouds.push(entry.clouds.all);
        daySummary.wind.push(entry.wind.speed);
        daySummary.humidity.push(entry.main.humidity);
        daySummary.weather = entry.weather[0]; // Assuming weather is same for the whole day
      });

      const avgTemp = (
        daySummary.temp.reduce((a, b) => a + b, 0) / daySummary.temp.length
      ).toFixed(2);
      const avgClouds = (
        daySummary.clouds.reduce((a, b) => a + b, 0) / daySummary.clouds.length
      ).toFixed(2);
      const avgWind = (
        daySummary.wind.reduce((a, b) => a + b, 0) / daySummary.wind.length
      ).toFixed(2);
      const avgHumidity = (
        daySummary.humidity.reduce((a, b) => a + b, 0) /
        daySummary.humidity.length
      ).toFixed(2);

      const formattedDate = formatDate(date);

      forecastContainer.innerHTML += `
      <div class="forecast-day">
        <h3>${formattedDate}</h3>
        <img src="http://openweathermap.org/img/w/${daySummary.weather.icon}.png" alt="${daySummary.weather.description}">
        <p>${daySummary.weather.description}</p>
        <p>Temp: ${avgTemp} °C</p>
        <p>Clouds: ${avgClouds} %</p>
        <p>Wind: ${avgWind} m/s</p>
        <p>Humidity: ${avgHumidity} %</p>
      </div>
    `;
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${dayName}, ${day}:${month}:${year}`;
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    grantAccessButton.style.display = "none";
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  const locationDiv = document.getElementById("location");
  locationDiv.innerText = `(Your Lat.: ${userCoordinates.lat} & Lon.: ${userCoordinates.lon})`;
  sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
  fetchWeatherInfo(userCoordinates);
}

function showError(error) {
  const locationDiv = document.getElementById("location");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      locationDiv.innerText = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      locationDiv.innerText = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      locationDiv.innerText = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      locationDiv.innerText = "An unknown error occurred.";
      break;
  }
}

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") {
    return;
  }
  fetchSearchWeatherInfo(searchInput.value);
  searchInput.value = "";
});

async function fetchSearchWeatherInfo(city) {
  loadingContainer.classList.add("active");
  userInfoContainer.classList.remove("active");
  notFound.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingContainer.classList.remove("active");
    notFound.classList.add("active");
    errorImage.style.display = "none";
    errorText.innerText = `Error: ${err?.message}`;
    errorBtn.style.display = "block";
    errorBtn.addEventListener("click", () => fetchSearchWeatherInfo(city));
  }
}

function loadStoredCoordinates() {
  const storedCoordinates = sessionStorage.getItem("userCoordinates");
  if (storedCoordinates) {
    const { lat, lon } = JSON.parse(storedCoordinates);
    locationDiv.innerText = `Your Latitude: ${lat} & Longitude: ${lon}`;
  } else {
    locationDiv.innerText = "No coordinates stored.";
  }
}
loadStoredCoordinates();
