# weather-app
 - Add `.env` file on /api
 ```
WEATHER_API_ROUTE="https://www.metaweather.com/api"
FRONTEND_URL=frontend route (default 3000)
```

I recommend this library https://www.npmjs.com/package/local-cors-proxy to make unlimited requests.
On the bash:
```
npm install -g local-cors-proxy
lcp --proxyUrl https://www.metaweather.com/api
```
This return a message with a port. Then replace `WEATHER_API_ROUTE` with the value `http://localhost:{bash_port}/proxy`

- Add `.env` file on /front
```
REACT_APP_BACKEND_URL=backend route (default 3001)
```

- Run this project running `yarn start` inside /api folder and inside /front folder.

This project was realized with Create React App with the Typescript template and Material-ui to create the frontend, and Express to create the api.
