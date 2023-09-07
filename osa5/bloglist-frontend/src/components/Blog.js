import { useState } from 'react'


const Blog = ({ blog, user, handleLike, handleRemove }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : '',
    paddingTop: 0,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    float: 'center',
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
      {visible === false
        ?
        <div style={hideWhenVisible}>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>view</button>
        </div>
        :
        <div style={showWhenVisible}>
          <div>
            {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button> <br></br>
            <a href={'#'}>{blog.url}</a><br></br>
          likes {blog.likes} <button onClick={(event) => handleLike(event, blog)} className='likeButton'>like</button><br></br>
            {blog.user.name}<br></br>
            {blog.user.username === user.username
              ? <button onClick={(event) => handleRemove(event, blog)}>remove</button>
              : ''
            }
          </div>
        </div>
      }
    </div>
  )
}


export default Blog
