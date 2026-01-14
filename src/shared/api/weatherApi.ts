import type { WeatherData, ForecastData } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherApi = {
  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    // Convert Korean city name to English for OpenWeatherMap API
    // const englishCityName = mapCityNameToEnglish(cityName);
    // console.log('Fetching weather for city:', cityName, '->', englishCityName);

    const response = await fetch(
      `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    return response.json();
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    return response.json();
  },

  async getForecastByCity(cityName: string): Promise<ForecastData> {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    return response.json();
  },

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    return response.json();
  },
};
