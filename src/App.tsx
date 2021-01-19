import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CityCard from './components/CityCard';

interface Coordinate {
  latitude: number;
  longitude: number;
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
    latitude: -37.58,
    longitude: -57.35,
  },
];

const apiRoute = 'http://localhost:8010/proxy';

function App() {
  
  //TODO: type this
  const [weatherCities, setWeatherCities] = useState<Array<any>>([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const getByLattLong = async (lat, lon) => axios.get(`${apiRoute}/location/search/?lattlong=${lat},${lon}`, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
  const getByWoeid = (woeid: number) => axios.get(`${apiRoute}/location/${woeid}`, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });

  useEffect(() => {
    Promise.all(coordinates.map(async ({ latitude, longitude }) => {
      //TODO: type this
      const responseCitySearch = await getByLattLong(latitude, longitude);
      const cityFound = responseCitySearch.data[0];
      const responseWeatherCity = await getByWoeid(cityFound.woeid);
      const weatherCity = responseWeatherCity.data;
      const currentWeatherCity = weatherCity.consolidated_weather[0];
      return {
        name: cityFound.title,
        max: currentWeatherCity.max_temp,
        min: currentWeatherCity.min_temp,
        humidity: currentWeatherCity.humidity,
        icon: `https://www.metaweather.com/static/img/weather/${currentWeatherCity.weather_state_abbr}.svg`
      };
    }))
    .then((result) => setWeatherCities(result));
  }, []);

  const currentCity = weatherCities[currentCityIndex]
  
  return (
    <div>
      {weatherCities.length > 0 && (
        <CityCard
          name={currentCity.name}
          max={currentCity.max}
          min={currentCity.min}
          humidity={currentCity.humidity}
          icon={currentCity.icon}
        />
      )}
    </div>
  );
}

export default App;
