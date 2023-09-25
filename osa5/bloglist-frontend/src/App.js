import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exeption) {
      setErrorMessage(exeption.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLike = async (event, blog) => {
    event.preventDefault()

    const likedBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.addLike(likedBlog, blog.id)
    console.log(returnedBlog)
    setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
  }

  const handleRemove = async (event, blog) => {
    event.preventDefault()

    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      const returnedBlog = await blogService.remove(blog.id)
      if (returnedBlog.status === 204) {
        setBlogs(blogs.filter(blogToRemove => blogToRemove.id !== blog.id))
      }
    }
  }

  const handleNewBlog = async (newBlog) => {
    try {
      const blog = {
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        user: user
      }

      const returnedBlog = await blogService.create(blog)
      setBlogs([...blogs, returnedBlog])
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    catch (exeption) {
      setErrorMessage(exeption.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <LoginForm username={username} password={password}
        message={message} errorMessage={errorMessage}
        setUsername={setUsername} setPassword={setPassword}
        handleLogin={handleLogin}/>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <p>{user.name} logged in <button type='submit' onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='new blog'>
        <NewBlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleRemove={handleRemove} />
      )}
    </div>
  )
}

export default App
