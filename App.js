// Stored API key in a variable.
const apiKey = "5396acc97a30df607a41f8d6c1f62ff6";

// --- SELECT THE HTML ELEMENTS ---
const cityInputElement = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const currentWeatherContainer = document.getElementById(
  "current-weather-details"
);
const forecastCardsContainer = document.getElementById("forecast-cards");
const errorMessageContainer = document.getElementById("error-message");

const locationButton = document.getElementById("location-btn"); // Get the location button


// Global variables to store data for toggles and alerts ---
let lastTempCelsius = null; // Stores the last temperature in Celsius for conversion
let isCelsius = true; // Tracks the current temperature unit
const HIGH_TEMP_THRESHOLD = 40; // The temperature for the high-temp alert

function displayForecast(forecastData) {
  // First, clear any old forecast cards
  forecastCardsContainer.innerHTML = "";

  // The API gives weather data every 3 hours. We loop by 8 to get one forecast per day (3 * 8 = 24 hours).
  for (let i = 0; i < forecastData.list.length; i = i + 8) {
    const dayData = forecastData.list[i];

    // Create a new div element for the card
    const card = document.createElement("div");
    card.className =
      "bg-slate-700 p-5 rounded-lg shadow flex flex-col items-center space-y-1 border border-[#4EDCD8] ";

    // Create the HTML for the inside of the card
    const cardHTML = `
            <h3 class="font-bold text-sm text-white">${new Date(
              dayData.dt_txt
            ).toLocaleDateString()}</h3>
            <img src="https://openweathermap.org/img/wn/${
              dayData.weather[0].icon
            }.png" alt="forecast icon" class="w-12 h-12">
            <p class="text-2xs font-bold text-[#4EDCD8] ">Temp: ${
              dayData.main.temp
            }°C</p>
            <p class="text-2xs text-slate-300">Wind: ${
              dayData.wind.speed
            } M/S</p>
            <p class="text-2xs text-slate-300">Humidity: ${
              dayData.main.humidity
            }%</p>
        `;

    card.innerHTML = cardHTML;
    // Add the finished card to the container on the page
    forecastCardsContainer.appendChild(card);
  }
}



// This is the new, upgraded version of your displayCurrentWeather function
function displayCurrentWeather(data) {
    // Store the Celsius temperature so we can convert it later without another API call.
    lastTempCelsius = data.main.temp;
    isCelsius = true; // Always reset to Celsius on a new search.

    const weatherHTML = `
        <div class="flex flex-col items-center space-y-2 text-center">
            <h3 class="text-xl font-bold">${data.name} (${new Date().toLocaleDateString()})</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" class="w-20 h-20">
            
            <p class="text-lg">Temperature: <span id="temp-value" class="font-bold text-2xl">${data.main.temp}°C</span></p>
            
            <button id="temp-toggle-btn" class="w-full mt-2 bg-sky text-white p-2 rounded-lg font-semibold text-xs hover:bg-slate-500">Switch to °F</button>

            <p class="text-lg">Wind: ${data.wind.speed} M/S</p>
            <p class="text-lg">Humidity: ${data.main.humidity}%</p>
        </div>
    `;
    currentWeatherContainer.innerHTML = weatherHTML;

    // We must add the event listener AFTER the button has been created and added to the page.
    document.getElementById('temp-toggle-btn').addEventListener('click', toggleTemperatureUnit);

    // Call our new functions to check for alerts and update the background.
    displayWeatherAlert(data.main.temp);
    updateBackground(data.weather[0].main);
}


// This function will fetch the weather data ---
function getWeatherDetails(cityName, latitude, longitude) {
  errorMessageContainer.textContent = "";
  let apiUrl;

  // Check if we are searching by city name or by coordinates
  if (cityName) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  } else {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  }

  fetch(apiUrl)
    .then((res) => res.json())
    .then((currentWeather) => {
      if (currentWeather.cod !== 200) {
        throw new Error(currentWeather.message || "City not found!");
      }
      displayCurrentWeather(currentWeather);
      const { lat, lon } = currentWeather.coord;
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      return fetch(forecastApiUrl);
    })
    .then((res) => res.json())
    .then((forecastData) => {
      displayForecast(forecastData);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      errorMessageContainer.textContent =
        "Could not find weather data. Please try again.";
    });
}

// --- LISTEN FOR A CLICK ON THE SEARCH BUTTON ---
searchButton.addEventListener("click", function () {
  // Get the text from the input box and remove any extra spaces
  const cityName = cityInputElement.value.trim();

  // Check if the user actually typed something
  if (cityName === "") {
    errorMessageContainer.textContent = "Please enter a city name.";
    return; // Stop the function here if the input is empty
  } else {
    errorMessageContainer.textContent = ""; // Clear any previous error
  }

  console.log("User wants weather for:", cityName);

  getWeatherDetails(cityName, null, null);
});

locationButton.addEventListener("click", function () {
  // Check if geolocation is supported by the browser
  if (navigator.geolocation) {
    // Ask the user for their location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Success: we have the coordinates
        const { latitude, longitude } = position.coords;
        getWeatherDetails(null, latitude, longitude); // Call with coordinates
      },
      function (error) {
        // Error: user denied access or location could not be found
        alert(
          "Unable to retrieve your location. You may need to grant location permission in your browser settings."
        );
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});


// ---  Handles the °C / °F toggle ---
function toggleTemperatureUnit() {
    // Find the elements we need to update
    const tempValueElement = document.getElementById('temp-value');
    const tempToggleButton = document.getElementById('temp-toggle-btn');

    if (isCelsius) {
        // If we are currently showing Celsius, convert to Fahrenheit
        const fahrenheit = (lastTempCelsius * 9/5) + 32;
        tempValueElement.textContent = `${fahrenheit.toFixed(2)}°F`;
        tempToggleButton.textContent = 'Switch to °C';
    } else {
        // If we are showing Fahrenheit, convert back to Celsius
        tempValueElement.textContent = `${lastTempCelsius.toFixed(2)}°C`;
        tempToggleButton.textContent = 'Switch to °F';
    }
    isCelsius = !isCelsius; // This flips the state from true to false, or false to true.
}

// --- Displays an alert for high temperatures ---
function displayWeatherAlert(temperature) {
    // First, check if an old alert is already on the page and remove it.
    const existingAlert = document.getElementById('weather-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // If the temperature is above our limit, create and show a new alert.
    if (temperature > HIGH_TEMP_THRESHOLD) {
        const alertDiv = document.createElement('div');
        alertDiv.id = 'weather-alert';
        alertDiv.textContent = `⚠️ High Temperature Alert: ${temperature.toFixed(2)}°C! Stay hydrated.`;
        // These are Tailwind classes to style the alert
        alertDiv.className = 'text-center font-bold text-yellow-400 p-2 mt-4';
        // Add the alert to the page right after the main weather display grid
        document.querySelector('.lg\\:grid-cols-3').insertAdjacentElement('afterend', alertDiv);
    }
}

// --- Changes the background based on weather conditions ---
function updateBackground(weatherCondition) {
    // We'll add a class to the body for a rainy background
    if (weatherCondition === 'Rain') {
        document.body.classList.add('rainy-bg');
    } else {
        // IMPORTANT: Make sure to remove the class if the weather is not rainy
        document.body.classList.remove('rainy-bg');
    }
    // NOTE: You need to add styling for '.rainy-bg' in your own CSS file.
    // For example: .rainy-bg { background-image: url('path/to/your/rain-image.jpg'); background-size: cover; }
}
