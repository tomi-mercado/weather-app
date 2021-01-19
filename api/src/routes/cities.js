require('dotenv').config();
const { Router, response } = require('express');
const axios = require('axios');
const { type } = require('os');

const router = Router();

const weatherApiRoute = process.env.WEATHER_API_ROUTE;

router.get('/coordinates/:lattlong', async (req, res) => {
    const { lattlong } = req.params;
    const coordinates = lattlong.split(',');
    try {
        if (coordinates.length === 2) {
            const responseCitySearch = await axios.get(`${weatherApiRoute}/location/search/?lattlong=${coordinates[0]},${coordinates[1]}`)
            if (responseCitySearch.status === 200) {
                const cityFound = responseCitySearch.data[0];
                const responseWeatherCity = await axios.get(`${weatherApiRoute}/location/${cityFound.woeid}`);
                if (responseWeatherCity.status === 200) {
                    const weatherCity = responseWeatherCity.data.consolidated_weather[0];
                    return res.status(200).json({
                        name: cityFound.title,
                        max: Math.round(weatherCity.max_temp),
                        min: Math.round(weatherCity.min_temp),
                        humidity: Math.round(weatherCity.humidity),
                        icon: `https://www.metaweather.com/static/img/weather/${weatherCity.weather_state_abbr}.svg`,
                    });
                } 
                return res.status(400).json({ error: "Can't found weather of this city" });
            }
            return res.status(400).json({ error: "Can't found this city" });
        }
        return res.status(400).json({ error: "Error in params. You have to get /coordinates/lat,long" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get('/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const responseSearchCity = await axios.get(`${weatherApiRoute}/location/search/?query=${name}`);
        if (responseSearchCity.status === 200) {
            const { data } = responseSearchCity;
            const newCity = data[0];
            const responseWeatherCity = await axios.get(`${weatherApiRoute}/location/${newCity.woeid}`);
            if (responseWeatherCity.status === 200) {
                const weatherCity = responseWeatherCity.data.consolidated_weather[0];
                return res.status(200).json({
                    name: newCity.title,
                    max: Math.round(weatherCity.max_temp),
                    min: Math.round(weatherCity.min_temp),
                    humidity: Math.round(weatherCity.humidity),
                    icon: `https://www.metaweather.com/static/img/weather/${weatherCity.weather_state_abbr}.svg`
                });
            }
            return res.status.json({ error: "Can't found the weather for this city" });
        }
        return res.status(400).json({ error: "Can't found this city" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
