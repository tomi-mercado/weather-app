import React, { useState, useEffect } from 'react';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';

import CityCard from './components/CityCard';
import CityAdder from './components/CityAdder';

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

  const haveWeatherCitiesLoaded: boolean = weatherCities.length > 0;

  useEffect(() => {
    Promise.all(coordinates.map(async ({ latitude, longitude }) => {
      const response = await axios.get(`${apiRoute}/cities/coordinates/${latitude},${longitude}`);
      if (response.status === 200) {
        const { data } = response;
        const weatherCity: WeatherCity = data;
        return weatherCity;
      } else {
        setErrorLoading(true);
      }
    }))
      .then((result: Array<WeatherCity>) => setWeatherCities(result))
      .catch((_error) => setErrorLoading(true))
  }, []);

  useEffect(() => {
    if (haveWeatherCitiesLoaded) {
      const interval = setInterval(() => {
        setCurrentCityIndex(currentIndex => currentIndex !== weatherCities.length - 1 ? currentCityIndex + 1 : 0);
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
        <CityAdder
          setWeatherCity={setWeatherCities}
          weatherCities={weatherCities}
        />
    </div>
  );

  if (errorLoading) return <h1>Error loading cities</h1>

  return <h1>Cities loading...</h1>
}

export default App;
