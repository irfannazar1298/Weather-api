const API_KEY = "8ac5c4d57ba6a4b3dfcf622700447b1e";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weather-card");

const cityName = document.getElementById("city-name");
const weatherDate = document.getElementById("weather-date");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        showMessage("Please enter a city name.", true);
        cityInput.focus();
        return;
    }

    getWeather(city);
});

async function getWeather(city) {
    searchButton.disabled = true;
    searchButton.textContent = "Searching...";
    showMessage("Getting the latest weather...");

    const query = new URLSearchParams({
        q: city,
        appid: API_KEY,
        units: "metric"
    });

    try {
        const response = await fetch(`${API_URL}?${query}`);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling and try again.");
            }

            if (response.status === 401) {
                throw new Error("The weather service could not authorize this request.");
            }

            throw new Error(data.message || "Unable to get weather right now. Please try again.");
        }

        showWeather(data);
        showMessage("");
    } catch (error) {
        showMessage(error.message || "Could not connect to the weather service. Check your internet connection.", true);
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
}

function showWeather(data) {
    const weather = data.weather[0];
    const cityAndCountry = data.sys.country
        ? `${data.name}, ${data.sys.country}`
        : data.name;

    cityName.textContent = cityAndCountry;
    weatherDate.textContent = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
    });
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    weatherIcon.alt = weather.description;
    weatherDescription.textContent = weather.description;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    weatherCard.hidden = false;
}

function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle("error", Boolean(isError));
}

getWeather("Kakkanad");
