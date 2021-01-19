import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import styles from './styles';
import { WeatherCity } from '../../interfaces';

const useStyles = makeStyles(styles);

const apiRoute = process.env.REACT_APP_BACKEND_URL;

function CityAdder({ weatherCities, setWeatherCity }: { weatherCities: Array<WeatherCity>, setWeatherCity: any }) {
  
  const classes = useStyles();

  const [inputValue, setInputValue] = useState<string>('');
  const [resultAdding, setResultAdding] = useState<boolean | null>(null);

  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInputValue(event.target.value);

  const handleResult = (value: boolean) => {
    setResultAdding(value);
    setTimeout(() => {
      setResultAdding(null);
    }, 3000);
  }

  const addCity = async () => {
    try {
        const responseSearchCity = await axios.get(`${apiRoute}/location/search/?query=${inputValue}`);
        if (responseSearchCity.status === 200) {
            const { data } = responseSearchCity;
            const newCity = data[0];
            const responseWeatherCity = await axios.get(`${apiRoute}/location/${newCity.woeid}`);
            if (responseWeatherCity.status === 200) {
                const weather = responseWeatherCity.data.consolidated_weather[0];
                setWeatherCity([...weatherCities, {
                    name: newCity.title,
                    max: Math.round(weather.max_temp),
                    min: Math.round(weather.min_temp),
                    humidity: Math.round(weather.humidity),
                    icon: `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`
                }]);
                handleResult(true);
            }
            else handleResult(false);
        } else handleResult(false);
    } catch (error) {
        handleResult(false);
    } 
  }

  return (
    <div className={classes.root}>
        <TextField value={inputValue} label="Enter a city name" onChange={handleInput} />
        <Button variant="contained" onClick={addCity}>Add</Button>
        {resultAdding && <h5>City successfully added</h5>}
        {resultAdding === false && <h5>We couldn't find this city</h5>}
    </div>
  )
}

export default CityAdder;
