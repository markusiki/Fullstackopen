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
          <ul key={country.name}>
            {languages.map(language => 
              <li>{language}</li>
            )}
          </ul>
        <img src={country.flags.png} width='240' height='160'></img>
      </div>
    )

  }
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
        console.log('axios', response.data)
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