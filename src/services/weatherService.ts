import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY_HOURLY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

const getWeatherDataHourly = async (city: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data", error);
    throw error;
  }
};

export { getWeatherDataHourly };

const API_KEY_DAILY = import.meta.env.VITE_WEATHER_API_KEY_ONECALL;
const BASE_URL_DAILY = "https://api.openweathermap.org/data/3.0/onecall?";

const getWeatherDataDaily = async (city: string) => {
  try {
    // Get latitude and longitude of the city using a geocoding API
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_DAILY}`
    );
    const { lat, lon } = geoResponse.data.coord;

    // Use One Call API with the lat/lon and your API key
    const response = await axios.get(
      `${BASE_URL_DAILY}lat=${lat}&lon=${lon}&appid=${API_KEY_DAILY}&units=metric`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching weather data", error.response || error);
    throw error;
  }
};

export { getWeatherDataDaily };
