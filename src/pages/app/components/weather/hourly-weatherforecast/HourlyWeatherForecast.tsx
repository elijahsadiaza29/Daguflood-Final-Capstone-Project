import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import React from 'react';

interface HourlyForecastData {
  dt: number;
  pop: number;
  weather: {
    main: string;
    description: string;
    icon: string;
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
}

interface CityData {
  name: string;
  timezone: number;
}

interface HourlyWeatherForecastProps {
  forecast: HourlyForecastData[];
  city: CityData;
}

const getWeatherIconUrl = (iconCode: string, size: 'small' | 'large' = 'small') => {
  const baseUrl = 'https://openweathermap.org/img';
  const resolution = size === 'large' ? '@2x' : '';
  return `${baseUrl}/wn/${iconCode}${resolution}.png`;
};

const findClosestForecast = (forecasts: HourlyForecastData[]) => {
  const now = new Date();
  const currentTime = now.getTime() / 1000; // Convert to Unix timestamp

  return forecasts.reduce((closest, current) => {
    const closestDiff = Math.abs(closest.dt - currentTime);
    const currentDiff = Math.abs(current.dt - currentTime);
    return currentDiff < closestDiff ? current : closest;
  });
};

const renderHourlyForecastItem = (item: HourlyForecastData, isCurrentTime: boolean) => {
  return (
    <div key={item.dt} className={`border border-white/15 p-2 h-fit rounded-lg ${isCurrentTime ? 'bg-white/10 border-none backdrop-blur-xl' : ''}`}>
      <div className="text-lg font-semibold">
        <p className="text-white text-center text-sm">
          {Math.round(item.main.temp).toString().padStart(2, '0')}°C
        </p>
      </div>
      <div className="grid justify-center">
        <img
          src={getWeatherIconUrl(item.weather[0].icon, 'large')}
          alt={item.weather[0].description}
          className="w-16 h-16 items-center"
        />
      </div>
      <div className="w-[70px] text-sm text-center text-white">
        {new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
      </div>
    </div>
  );
};

const HourlyWeatherForecast: React.FC<HourlyWeatherForecastProps> = ({ forecast, city }) => {
  const currentWeather = findClosestForecast(forecast);

  return (
    <div id="container" className="absolute top-14 left-2 py-4 hidden sm:block">

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="flex flex-col text-sm">
          <h1 className="text-2xl text-foreground text-white">{city.name}</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })} {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
          </p>
          <p className="text-muted-foreground">{currentWeather.weather[0].description}</p>
        </div>

        <div className="grid grid-cols-[auto_auto_1fr_auto]">
          <div className="aspect-square">
            <img
              src={getWeatherIconUrl(currentWeather.weather[0].icon, 'large')}
              alt={currentWeather.weather[0].description}
              className="w-20 h-20 mx-auto"
            />
          </div>
          <h1 className="text-6xl font-medium text-white">
            {Math.round(currentWeather.main.temp).toString().padStart(2, '0')}
          </h1>
          <span className="pr-2">
            <span className="text-white">°C</span> <span className="text-muted-foreground">l</span> <span className="text-muted-foreground">°F</span>
          </span>
        </div>
      </div>

      <ScrollArea className="w-[340px]">
        <div className="flex gap-2 pb-4">
          {forecast.map((item) =>
            renderHourlyForecastItem(item, item.dt === currentWeather.dt)
          )}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

    </div>
  );
};

export default HourlyWeatherForecast;