import React, { useState, useEffect } from 'react';
import { getWeatherDataHourly } from '@/services/weatherService';
import HourlyWeatherForecast from './HourlyWeatherForecast';

interface WeatherData {
  city: {
    name: string;
    timezone: number;
  };
  list: {
    dt: number;
    pop: number;
    weather: {
      main: string;
      description: string;
      icon: string
    }[];
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      feels_like: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    wind: {
      speed: number;
    }
  }[];

}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city] = useState('Dagupan');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getWeatherDataHourly(city);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
  }, [city]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <HourlyWeatherForecast
      city={weatherData.city}
      forecast={weatherData.list}
    />
  );
};

export default Weather;
