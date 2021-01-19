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
                        max: weatherCity.max_temp,
                        min: weatherCity.min_temp,
                        humidity: weatherCity.humidity,
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

module.exports = router;