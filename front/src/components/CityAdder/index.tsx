import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import styles from './styles';
import { WeatherCity } from '../../interfaces';
import { Typography } from '@material-ui/core';

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
        const response = await axios.get(`${apiRoute}/cities/${inputValue}`);
        if (response.status === 200) {
            const { data } = response;
            const newCityWeather: WeatherCity = data;
            setWeatherCity([...weatherCities, newCityWeather]);
            handleResult(true);
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
        <Typography className={classes.aclaration} variant="subtitle2">*Please, enter the city in English.</Typography>
    </div>
  )
}

export default CityAdder;
