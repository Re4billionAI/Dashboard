import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Loader2,
  Thermometer,
  Cloud,
} from "lucide-react";

const WeatherInfo = ({ lat = 12.96227, lon = 80.25775 }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "fce91158cf3de2349767f631b374d20a";

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

  const isRain = weather.weather[0].main === "Rain";

  const Icon = isRain ? CloudRain : Sun;

  return (
   <div className="p-3.5 w-full sm:w-[40%] bg-white flex items-center justify-between  border-[1px] border-gray-300">
 
      <div className="flex flex-col items-center justify-between ">
        <div className="flex items-center gap-4">
          <Icon size={40} className={isRain ? "text-blue-500" : "text-yellow-400"} />
          <div>
            <h2 className="text-xl font-bold">{weather.weather[0].main}</h2>
            <p className="text-sm text-gray-600 capitalize">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
        <div className="text-4xl font-bold text-gray-800">
          {weather.main.temp.toFixed(1)}°C
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4  text-sm">
        <InfoBox
          icon={<Thermometer className="text-red-500" size={20} />}
          label={`Feels like`}
          value={`${weather.main.feels_like}°C`}
        />
        <InfoBox
          icon={<Droplets className="text-blue-600" size={20} />}
          label="Humidity"
          value={`${weather.main.humidity}%`}
        />
        <InfoBox
          icon={<Wind className="text-green-600" size={20} />}
          label="Wind"
          value={`${weather.wind.speed} m/s`}
        />
        <InfoBox
          icon={<Gauge className="text-gray-700" size={20} />}
          label="Pressure"
          value={`${weather.main.pressure} hPa`}
        />
        <InfoBox
          icon={<Cloud className="text-indigo-500" size={20} />}
          label="Cloudiness"
          value={`${weather.clouds.all}%`}
        />
        <InfoBox
          icon={<Sun className="text-orange-500" size={20} />}
          label="Sunrise"
          value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
        />
      </div>
    </div>
  );
};

const InfoBox = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-white  border border-gray-200shadow p-3">
    {icon}
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  </div>
);

export default WeatherInfo;
