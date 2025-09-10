
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