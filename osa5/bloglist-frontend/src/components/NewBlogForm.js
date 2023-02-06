import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const NewBlogForm = ({ user, setBlogs, blogs, setMessage, setErrorMessage }) => {

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

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
      setBlogs([...blogs, returnedBlog])
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setNewBlog({ title: '', author: '', url: '' })
    }
    catch (exeption) {
      setErrorMessage(exeption.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
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
}

NewBlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired
}

export default NewBlogForm