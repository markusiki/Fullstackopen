import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = (props) => {
  return (
    <p>find countries<input value={props.filter} onChange={props.handleFilterChange}></input> </p>
  )
}

const CountryList = ({ filteredCountries }) => {
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, spesify another filter</p>
    )
  }

  if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map(country => 
        <p key={country.name.common}>{country.name.common} {}</p>
        )}
      </div>
    )
  }
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    const languages = (Object.values(country.languages).map(row => row)) 
   
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area} m<sup>2</sup></p>
        <h4>Languages:</h4>
          <ul>
            {languages.map(language => 
              <li key={language}>{language}</li>
            )}
          </ul>
        <img src={country.flags.png} alt='flag' width='240' height='160'></img>
        <Weather country={country}/>
      </div>
    )
  }
}

const Weather = ({ country }) => {
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]
  const apiKey = process.env.REACT_APP_API_KEY
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  },[])
  
  if (weather===null) return

  return(
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature {weather.main.temp} Celcius</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt='weather icon'/>
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })


  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <CountryList filteredCountries={filteredCountries}/> 
    </div>
  )
}

export default App