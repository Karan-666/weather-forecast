// Stored API key in a variable.
const apiKey = "5396acc97a30df607a41f8d6c1f62ff6";

// --- SELECT THE HTML ELEMENTS ---
const cityInputElement = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const currentWeatherContainer = document.getElementById("current-weather-details");
const forecastCardsContainer = document.getElementById("forecast-cards");
const errorMessageContainer = document.getElementById("error-message");


// This function will fetch the weather data ---
function getWeatherForCity(city) {
    // Constructs the API URL string using the city parameter and the apiKey, it was in site's documentation
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // The fetch() function starts a request to the API. It returns a Promise.
    fetch(apiUrl)
        .then(function(response) {
            // The first .then() block executes when the Promise is fulfilled with a 'response' object.
            if (!response.ok) {
                // Checks if the HTTP response status is not 'ok' (e.g., a 404 Not Found error).
                // If true, it throws an error which will be caught by the .catch() block.
                throw new Error("HTTP error, status = " + response.status);
            }
            // The .json() method parses the response body as JSON. This also returns a Promise.
            return response.json(); 
        })
        .then(function(data) {
            // The second .then() block receives the resolved value of response.json(), which is the parsed 'data'.
            console.log("Successfully fetched data:", data);
        })
        .catch(function(error) {
            // The .catch() block handles any errors that occurred in the Promise chain (e.g., network failure or the error we threw).
            console.error("Fetch error:", error);
            errorMessageContainer.textContent = "Could not find weather data. Please try again.";
        });
}

// --- LISTEN FOR A CLICK ON THE SEARCH BUTTON ---
searchButton.addEventListener("click", function() {
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

    getWeatherForCity(cityName);
});