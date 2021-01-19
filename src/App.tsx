import React, { useState, useEffect } from 'react';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CityCard from './components/CityCard';

import coordinates from './coordinates';
import styles from './styles';
import { WeatherCity } from './interfaces';

const useStyles = makeStyles(styles);

const apiRoute = process.env.REACT_APP_BACKEND_URL;

function App() {
  
  const classes = useStyles();

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
    <div className={classes.root}>
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
