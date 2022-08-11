import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObjet => {
    const request = axios.post(baseUrl, newObjet)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response)
}

const replace = (id, name, newNumber) => {
    const request = axios.put(`${baseUrl}/${id}`, { name: name, number: newNumber })
    return request.then(response => response.data)
}

export default { getAll, create, remove, replace }