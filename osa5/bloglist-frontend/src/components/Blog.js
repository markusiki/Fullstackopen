import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, blogs, setBlogs }) => {

  const [visible, setVisible] = useState(false)

    const hideWhenVisible = { 
    display: visible ? 'none' : '',
    paddingTop: 0,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
    }
    const showWhenVisible = { 
    display: visible ? '' : 'none',
    paddingTop: 0,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = async (event) => {
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

  return (
    <div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button> <br></br>
        {blog.url}<br></br>
        likes {blog.likes} <button onClick={handleLike}>like</button><br></br> 
        {blog.user.name}<br></br>
        </p>
      </div>
    </div>  
  )
}

export default Blog