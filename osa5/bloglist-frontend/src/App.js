import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = {
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        user: user
      }
      
      const returnedBlog = await blogService.create(blog)
      console.log(returnedBlog)
      setBlogs([...blogs, returnedBlog])
      setNewBlog({ title: '', author: '', url: '' })
    }
    catch (exeption) {
    setErrorMessage('error.message')
    }
  }

  const loginForm = () => (
    <div>
    <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>
  )

  const newBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
            <input type='text' value={newBlog.title} name='title' onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}/>
        </div>
        <div>
          author:
            <input type='text' value={newBlog.author} name='author' onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}/>
        </div>
        <div>
          url:
            <input type='text' value={newBlog.url} name='url' onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )

  if (user === null) {
    return (
      loginForm()
    )
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button type='submit' onClick={handleLogout}>logout</button></p>
      {newBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
