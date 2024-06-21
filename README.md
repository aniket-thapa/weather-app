# Weather App

This is a weather forecasting web application that uses the OpenWeather API to provide weather information based on your location or a city of your choice.

## Live Demo

Check out the live demo [here](https://aniket-thapa.github.io/weather-app/).

## Features

- **Current Location Weather**: Get weather information based on your current location.
- **Search by City**: Search for weather information by entering a city name.
- **5-Day Forecast**: View a 5-day weather forecast.
- **Error Handling**: Graceful error messages for network issues or invalid city names.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- OpenWeather API

## How to Use

1. **Grant Location Access**: On initial load, you will be prompted to grant location access. This is required to fetch weather data for your current location.
2. **Search for a City**: Use the search bar to find weather information for any city.
3. **View Weather Data**: Weather data includes temperature, weather description, wind speed, humidity, and cloud cover.
4. **5-Day Forecast**: Scroll down to see the 5-day weather forecast for the selected location.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/aniket-thapa/weather-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd weather-app
    ```
3. Open `index.html` in your preferred web browser.

## File Structure

- `index.html`: The main HTML file that structures the app.
- `style.css`: The CSS file for styling the app.
- `script.js`: The JavaScript file that contains the logic for fetching and displaying weather data.
- `Images`: Images folder that contains all the images and icons used in the code taken from various online resources.

## OpenWeather API

This project uses the OpenWeather API to fetch weather data. You will need an API key to run this project. Update the `API_KEY` variable in `script.js` with your own OpenWeather API key:

```javascript
const API_KEY = "your_api_key_here";
