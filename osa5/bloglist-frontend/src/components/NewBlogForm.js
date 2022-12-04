const NewBlogForm = ({ handleNewBlog, newBlog, setNewBlog }) => (
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

export default NewBlogForm