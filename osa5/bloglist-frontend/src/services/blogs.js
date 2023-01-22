import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newtoken => {
  token = `bearer ${newtoken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addLike = async (likedBlog, blogId) => {
  const response = await axios.put(`${baseUrl}/${blogId}`, likedBlog)
  return response.data
}

export default { getAll, create, setToken, addLike }