
        // key taken from openweathermap.org.
        // 94bcc85c8dc2a6bafd6cc6de6feff945

        const apiKey = "5396acc97a30df607a41f8d6c1f62ff6"; 

        // Here, we grab the HTML elements from our page so we can control them with JavaScript.
        const cityInputElement = document.getElementById("city-input"); // The text box for the city.
        const searchButton = document.getElementById("search-btn"); // The "Search" button.
        const locationButton = document.getElementById("location-btn"); // The "Current Location" button.
        const currentWeatherContainer = document.getElementById("current-weather-details"); // The box for today's weather.
        const forecastCardsContainer = document.getElementById("forecast-cards"); // The box for the 5-day forecast.
        const errorMessageContainer = document.getElementById("error-message"); // The box for error messages.

        // This is our main function. It goes to the internet to get the weather information.
        function getWeatherDetails(cityName, latitude, longitude) {
            // This variable will hold the special web address (URL) for the weather website.
            let weatherApiUrl;

            // If we have a city name, we create the URL to search by city.
            if (cityName) {
                weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
            } else { // If we don't have a city, we create the URL to search by location coordinates.
                weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            }

            // The 'fetch' command tells the browser to go to the URL and get the data.
            fetch(weatherApiUrl)
                .then(response => {
                    // After we get a response, we check if everything is okay. If not, we create an error.
                    if (!response.ok) throw new Error("City not found or network error.");
                    // If it's okay, we turn the data into something JavaScript can easily read.
                    return response.json();
                })
                .then(weatherData => {
                    // Now we have the current weather data.
                    errorMessageContainer.textContent = ""; // We clear any old error messages.
                    displayCurrentWeather(weatherData); // We call our function to show the current weather.

                    // We need another trip to the internet to get the 5-day forecast.
                    const { lat, lon } = weatherData.coord; // We get the location from the data we just got.
                    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
                    // We fetch the forecast data now.
                    return fetch(forecastApiUrl);
                })
                .then(response => {
                    // We check the forecast response to make sure it's okay.
                    if (!response.ok) throw new Error("Could not fetch the forecast.");
                    // We get the forecast data ready for JavaScript to use.
                    return response.json();
                })
                .then(forecastData => {
                    // Now that we have the forecast data, we call our function to show it on the page.
                    displayForecast(forecastData);
                })
                .catch(error => {
                    // If anything went wrong at any step, this 'catch' block will run.
                    console.error("There was a problem:", error); // This logs a detailed error for developers.
                    errorMessageContainer.textContent = "Could not find weather data. Please try again."; // This shows a simple error to the user.
                    // We also clear out any old weather info from the page.
                    currentWeatherContainer.innerHTML = "<p>Enter a city or use your location to see the weather.</p>";
                    forecastCardsContainer.innerHTML = "";
                });
        }

        // This function builds the HTML to show the current weather.
        function displayCurrentWeather(data) {
            // We create a string of HTML code with the weather details filled in from our data.
            const weatherHTML = `
                <h3 class="text-xl font-bold">${data.name} (${new Date().toLocaleDateString()})</h3>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" class="mx-auto w-20 h-20">
                <p class="text-lg">Temperature: ${data.main.temp}°C</p>
                <p class="text-lg">Wind: ${data.wind.speed} M/S</p>
                <p class="text-lg">Humidity: ${data.main.humidity}%</p>
            `;
            // We put this new HTML inside the current weather container on our page.
            currentWeatherContainer.innerHTML = weatherHTML;
        }

        // This function builds and displays the 5-day forecast cards.
        function displayForecast(data) {
            // First, we empty the container to remove any old cards.
            forecastCardsContainer.innerHTML = "";
            // The weather data comes in 3-hour chunks, so we loop through it, skipping 8 chunks at a time to get one forecast per day.
            for (let i = 0; i < data.list.length; i = i + 8) {
                const forecast = data.list[i];
                // We create a new 'div' element in memory. This will be our card.
                const card = document.createElement("div");

                // We give our new card a dark grey background and other styles.
                card.className = "bg-slate-700 p-3 rounded-lg shadow";

                // We create the HTML for the inside of the card with the forecast details.
                const cardHTML = `
                    <h3 class="font-semibold text-sm text-slate-200">${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="forecast icon" class="mx-auto w-12 h-12">
                    <p class="text-xs text-slate-300">Temp: ${forecast.main.temp}°C</p>
                    <p class="text-xs text-slate-300">Wind: ${forecast.wind.speed} M/S</p>
                    <p class="text-xs text-slate-300">Humidity: ${forecast.main.humidity}%</p>
                `;
                // We put our new HTML inside the card.
                card.innerHTML = cardHTML;
                // Finally, we add our finished card to the forecast container on the page.
                forecastCardsContainer.appendChild(card);
            }
        }

        // This part makes our buttons actually do something when they are clicked.
        // It's like telling the app, "Hey, listen for a click on this button!"

        // This listens for a click on the "Search" button.
        searchButton.addEventListener("click", function() {
            // When the button is clicked, we get the text from the city input box.
            const city = cityInputElement.value.trim();
            // If the user typed something...
            if (city) {
                // ...we call our main function to get the weather.
                getWeatherDetails(city, null, null);
            } else {
                // ...if they didn't, we show an error message.
                errorMessageContainer.textContent = "Please enter a city name.";
            }
        });

        // This listens for a click on the "Current Location" button.
        locationButton.addEventListener("click", function() {
            // We check if the user's browser can find their location.
            if (navigator.geolocation) {
                // If it can, we ask for the location. The browser will ask the user for permission.
                navigator.geolocation.getCurrentPosition(function(position) {
                    // If the user says yes, we get their coordinates and fetch the weather.
                    getWeatherDetails(null, position.coords.latitude, position.coords.longitude);
                }, function(error) {
                    // If the user says no or something goes wrong, we show an error.
                    errorMessageContainer.textContent = "Unable to get your location. Please allow location access or search for a city.";
                });
            } else {
                // If the browser doesn't support this feature, we show an error.
                errorMessageContainer.textContent = "Your browser does not support geolocation.";
            }
        });