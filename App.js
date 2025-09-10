
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

       