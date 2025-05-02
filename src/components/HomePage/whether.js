import React, { useState, useEffect } from "react";
import axios from "axios";

import {  Sun, CloudRain, Wind, Droplets, Gauge, Loader2 } from "lucide-react";

const WeatherInfo = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "fce91158cf3de2349767f631b374d20a"; // Replace with your API key

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        setWeather(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch weather data");
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  if (loading) {
    return <Loader2 className="animate-spin w-8 h-8 mx-auto mt-10" />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-5">{error}</div>;
  }

  if (!weather) return null;

  return (
    <div className="bg-white  rounded-full md:p-2 p-1 px-4 w-full  border border-gray-300 space-y-4 transition-transform transform ">
    {/* Temperature & Condition */}
    <div className="flex md:flex-row flex-row  item-center gap-2 justify-center items-center">
    <div className="flex md:flex-row items-center gap-2  rounded-lg ">
        {weather.weather[0].main === "Rain" ? (
          <CloudRain className="text-blue-400" size={20} />
        ) : (
          <Sun className="text-yellow-400" size={20} />
        )}
        
      </div>
      <div className="sm:text-sm md:text-lg font-bold text-gray-900">{weather.main.temp}°C</div>
      
    </div>
    
   
  </div>
  );
};  

export default WeatherInfo;
