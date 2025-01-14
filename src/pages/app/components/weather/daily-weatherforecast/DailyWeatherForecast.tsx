import React from "react";

interface DailyWeatherForecastData {
    dt: number;
}

interface DailyWeatherForecastProps {
    forecast: DailyWeatherForecastData[];
}

const DailyWeatherForecast: React.FC<DailyWeatherForecastProps> = ({ forecast }) => {
    return (
        <div>
            {forecast.map((item, index) => (
                <div key={index} className="border p-2 item-container rounded-lg">
                    {new Date(item.dt).toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
            ))}
        </div >

    );
};
export default DailyWeatherForecast;