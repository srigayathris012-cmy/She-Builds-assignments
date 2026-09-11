const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", getWeather);

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Enter city name");
        return;
    }

    try {
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );
        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name } = locationData.results[0];
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
        );
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok || !weatherData.current) {
            throw new Error("Unable to fetch weather data");
        }

        document.getElementById("cityName").innerText = name;
        document.getElementById("temperature").innerText =
            `${weatherData.current.temperature_2m} °C`;
        document.getElementById("windSpeed").innerText =
            `${weatherData.current.wind_speed_10m} km/h`;

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}