import { useEffect, useState } from "react";
import axios from "axios";

const Countries = ({ handleShowClick, countries, weather }) => {
  if (countries.length > 10) {
    return <p>Too many matches</p>;
  } else if (countries.length === 1) {
    return (
      <div>
        {countries.map((country, i) => {
          return <Country key={i} country={country} weather={weather} />;
        })}
      </div>
    );
  } else if (countries.length <= 10) {
    return (
      <div>
        <ul>
          {countries.map((country, i) => {
            return (
              <CountryList
                key={i}
                country={country}
                handleShowClick={handleShowClick}
              />
            );
          })}
        </ul>
      </div>
    );
  }
};

const Country = ({ country, i, weather }) => {
  return (
    <div key={i}>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3 key={i}>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang, i) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags[1]} alt="flag" />
      <Weather weather={weather} />
    </div>
  );
};

const Weather = ({ weather }) => {
  if (weather.length !== 0) {
    return (
      <div>
        <p>Temperature : {weather.main.temp}°C </p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weatherImg"/>
        <p>Wind : {weather.wind.speed}m/s</p>
      </div>
    );
  }
};

const CountryList = ({ country, handleShowClick }) => {
  return (
    <li key={country.name.common}>
      {country.name.common}
      <button onClick={() => handleShowClick(country)}>Show</button>
    </li>
  );
};

const Filter = ({ filteredCountry, handleFindChange }) => {
  return (
    <div>
      filter shown with:
      <input value={filteredCountry} onChange={handleFindChange} />
    </div>
  );
};

const App = () => {
  const [filteredCountry, setFilter] = useState([]);
  const [countries, setCountries] = useState([]);
  const [weather, setWeatherData] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3/all").then((response) => {
      const countries = response.data;
      setCountries(countries);
    });
  }, []);

  useEffect(() => {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
    const ACCESS_KEY = process.env.REACT_APP_API_KEY;
    
    if (filteredCountry.length === 1) {
      const lat = filteredCountry.map((country) => country.latlng[0]);
      const lon = filteredCountry.map((country) => country.latlng[1]);
      const capital = filteredCountry.map((country) => country.capital);
      if (capital[0]) {
        axios
          .get(
            `${baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${ACCESS_KEY}`
          )
          .then((response) => {
            setWeatherData(response.data);
          });
      }
    }
  }, [filteredCountry]);
  
  const handleFindChange = (event) => {
    setFilter(event.target.value);
    const result = countries.filter((person) =>
      person.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilter(result);
  };

  const handleShowClick = (name) => {
    const found = countries.find((obj) => {
      return obj.name.common === name.name.common;
    });
    setFilter([found]);
  };

  return (
    <div>
      <h2>Search</h2>
      <Filter value={filteredCountry} handleFindChange={handleFindChange} />

      <h1>Countries</h1>
      <Countries
        handleShowClick={handleShowClick}
        countries={filteredCountry}
        weather={weather} 
      />
    </div>
  );
};

export default App;
