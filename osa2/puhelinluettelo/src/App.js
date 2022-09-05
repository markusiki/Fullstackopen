import { useEffect, useState } from 'react'
import personService from './services/persons'

const Notification = ({ message, errorMessage }) => {
  if (message === null && errorMessage === null) {
    return null
  }

  if (message !== null) {
    return (
      <div className='notification'>
        {message}
      </div>
    )
  }

  return (
    <div className='error'>
      {errorMessage}
    </div>
  )

}

const Filter = (props) => {
  return (
    <p>filter shown with<input value={props.filter} onChange={props.handleFilterChange}></input> </p>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addPerson}>
        <div>name: <input value={props.newName} onChange={props.handleNameChange}/></div>
        <div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const PersonList = (props) => {
  return (
    <div>
       {props.personsToShow.map(person => 
       <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => props.deletePerson(person.id)}>delete</button>
       </p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personTestArray = persons.map(person => person.name)
    if (personTestArray.includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        changeNumber()
      }
  
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          console.log(error.response.data.error)
          setTimeout(() => setErrorMessage(null), 5000)
        }) 
    }
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personService
        .remove(personToDelete.id)
        .then(response => {
          if (response.status === 204) {
            setPersons(persons.filter(person => person.id !== id))
            setMessage(`Deleted ${personToDelete.name}`)
            setTimeout(() => setMessage(null), 5000)
          }
        })
        .catch(error => {
          setErrorMessage(`Information of ${personToDelete.name} has already been removed from server`)
          setTimeout(() => setErrorMessage(null), 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const changeNumber = () => {
    const personToChangeNumber = persons.find(person => person.name === newName)
    const id = personToChangeNumber.id
    const index = persons.findIndex(person => person.name === newName)
    const personsCopy = persons.map(person => person)
    personService
      .replace(id, personToChangeNumber.name, newNumber)
      .then(returnedPerson => {
        personsCopy.splice(index, 1, returnedPerson)
        setPersons(personsCopy)
        setNewName('')
        setNewNumber('')
        setMessage(`Number of ${returnedPerson.name} changed`)
        setTimeout(() => setMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage(`Information of ${personToChangeNumber.name} has already been removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const personsToShow = filter.length === 0
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} errorMessage={errorMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <PersonList personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App