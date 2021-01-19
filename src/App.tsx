import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CityCard from './components/CityCard';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface WeatherCity {
  name: string;
  max: number;
  min: number;
  humidity: number;
  icon: string;
}

const coordinates: Array<Coordinate> = [
  {
    latitude: -34.603722,
    longitude: -58.381592,
  },
  {
    latitude: -33.459229,
    longitude: -70.645348,
  },
  {
    latitude: 40.730610,
    longitude: -73.935242,
  },
  {
    latitude: 37.58,
    longitude: -47.35,
  },
];

const apiRoute = 'http://localhost:8010/proxy';

function App() {
  
  const [weatherCities, setWeatherCities] = useState<Array<WeatherCity>>([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [errorLoading, setErrorLoading] = useState(false);

  const getByLattLong = async (lat: number, lon: number) => axios.get(`${apiRoute}/location/search/?lattlong=${lat},${lon}`);
  const getWeatherByWoeid = (woeid: number) => axios.get(`${apiRoute}/location/${woeid}`);
  const haveWeatherCitiesLoaded: boolean = weatherCities.length > 0;

  useEffect(() => {
    Promise.all(coordinates.map(async ({ latitude, longitude }) => {
      const responseCitySearch = await getByLattLong(latitude, longitude);
      const cityFound = responseCitySearch.data[0];
      const responseWeatherCity = await getWeatherByWoeid(cityFound.woeid);
      const weatherCity = responseWeatherCity.data;
      const currentWeatherCity = weatherCity.consolidated_weather[0];
      return {
        name: cityFound.title,
        max: Math.round(currentWeatherCity.max_temp),
        min: Math.round(currentWeatherCity.min_temp),
        humidity: Math.round(currentWeatherCity.humidity),
        icon: `https://www.metaweather.com/static/img/weather/${currentWeatherCity.weather_state_abbr}.svg`
      };
    }))
      .then((result: Array<WeatherCity>) => setWeatherCities(result))
      .catch((_error) => setErrorLoading(true))
  }, []);

  useEffect(() => {
    if (haveWeatherCitiesLoaded) {
      const interval = setInterval(() => {
        setCurrentCityIndex(currentIndex => {
          console.log("Current index", currentIndex)
          console.log("Length", weatherCities.length)
          return currentIndex !== weatherCities.length - 1 ? currentCityIndex + 1 : 0
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [currentCityIndex, haveWeatherCitiesLoaded, weatherCities.length]);

  const currentCity = weatherCities[currentCityIndex];
  
  if (haveWeatherCitiesLoaded) return (
    <div>
        <CityCard
          name={currentCity.name}
          max={currentCity.max}
          min={currentCity.min}
          humidity={currentCity.humidity}
          icon={currentCity.icon}
        />
    </div>
  );

  if (errorLoading) return <h1>Error loading cities</h1>

  return <h1>Cities loading...</h1>
}

export default App;
