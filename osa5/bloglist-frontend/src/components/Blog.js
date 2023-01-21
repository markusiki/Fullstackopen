import { useState } from "react"

const Blog = ({ blog }) => {

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
        likes {blog.likes} <button>like</button><br></br> 
        {blog.user.name}<br></br>
        </p>
      </div>
    </div>  
  )
}

export default Blog