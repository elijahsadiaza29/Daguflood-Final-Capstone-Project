import { useEffect, useState } from "react";
import { getWeatherDataDaily } from "@/services/weatherService";
import DailyWeatherForecast from "./DailyWeatherForecast";

interface WeatherDataDaily {
    daily: {
        dt: number;
    }[];
}



const WeatherDaily = () => {
    const [weatherDataDaily, setWeatherDataDaily] = useState<WeatherDataDaily | null>(null);
    const [city,] = useState('Dagupan');

    useEffect(() => {
        const fetchWeatherDataDaily = async () => {
            try {
                console.log("Fetching weather data for city:", city); 
                const data = await getWeatherDataDaily(city);
                console.log("Weather data fetched:", data);  // Log the fetched data
                setWeatherDataDaily(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeatherDataDaily();
    }, [city]);

    if (!weatherDataDaily) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <DailyWeatherForecast forecast={weatherDataDaily.daily} />
        </div>
    )

}
export default WeatherDaily