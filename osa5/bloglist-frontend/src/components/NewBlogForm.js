import { useState } from 'react'

const NewBlogForm = ({ handleNewBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value })
  }

  const addBlog = (event) => {
    event.preventDefault()
    handleNewBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input id='title-input' type='text' placeholder='Title' value={newBlog.title} name='title' onChange={handleChange}/>
        </div>
        <div>
          author:
          <input id='author-input' type='text' placeholder='Author' value={newBlog.author} name='author' onChange={handleChange}/>
        </div>
        <div>
          url:
          <input id='url-input' type='text' placeholder='Url' value={newBlog.url} name='url' onChange={handleChange}/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default NewBlogForm