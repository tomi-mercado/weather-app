import React from 'react';

import CityCard from './components/CityCard';

function App() {
  return (
    <div>
      <CityCard
        name="Peronia"
        max={35}
        min={16}
        humidity={88}
        icon="https://www.metaweather.com/static/img/weather/png/hr.png"
      />
    </div>
  );
}

export default App;
