const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('right amount of blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs are identifyed with id, not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(element => {
      expect(element.id).toBeDefined()
    })
  })

  describe('addition of a new blog', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const password = 'password'
      const passwordHash = await bcrypt.hash(password, 10)
    
      const user =  new User({
        username: 'user',
        passwordHash
      })
    
      await user.save()
    })

    test('succeeds with a valid data', async () => {
      const newBlog = {
        title: 'This is a new blog',
        author: 'Jaska Jokunen',
        url: 'jaskablogi.com',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .send(newBlog) 
        .set('Authorization', `bearer ${await helper.userLogin()}`)
        .expect(201)
        
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      const blogTitles = blogsAtEnd.map(blog => blog.title)
      expect(blogTitles).toContain('This is a new blog')
    })

    test('succeeds if likes has no value and the value is set to 0', async () => {
      const newBlog = {
        title: 'if likes has no value, the value is set to 0',
        author: 'test',
        url: 'test.com',
        likes: ''
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${await helper.userLogin()}`)

      const notesAtEnd = await helper.blogsInDb()
      notesAtEnd.forEach(element => {
        expect(element.likes).not.toBeNull()
      })
    })
  
    test('fails with statuscode 400 if a new blog does not have a title and url', async () => {
      const newBlog = {
        author: 'test',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${await helper.userLogin()}`)
        .expect(400)
    })

    test('fails with statuscode 401 Unauthorized if the request does not have a token', async () => {
      const newBlog = {
        title: 'fails with statuscode 401 Unauthorized if the request does not have a token',
        author: 'test',
        url: 'test.com',
        likes: ''
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const notesAtEnd = await helper.blogsInDb()
        expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const password = 'password'
      const passwordHash = await bcrypt.hash(password, 10)
    
      const user =  new User({
        username: 'user',
        passwordHash
      })
    
      await user.save()

      const newBlog = {
        title: 'deletion of a blog',
        author: 'test',
        url: 'test.com',
        likes: ''
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${await helper.userLogin()}`)
        .expect(201)  

    })

    test('succeeds with statuscode 204', async () => {
      const blogs = await helper.blogsInDb()
      const blogToDelete = blogs[3]
        expect(blogToDelete.title).toEqual('deletion of a blog')

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
        .set('Authorization', `bearer ${await helper.userLogin()}`)  

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('update of a blog', () => {
    test('succeeds with statuscode 200', async () => {
      const blogs = await helper.blogsInDb()
      const blogToUpdate = blogs[0].id
      const updatedBlog = {
        title: 'This is an updated blog title',
        author: 'Jaska Jokunen',
        url: 'jaskablogi.com',
        likes: 1
      }

      await api
        .put(`/api/blogs/${blogToUpdate}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[0].title).toEqual(updatedBlog.title)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'admin', passwordHash })

    await user.save()
  })

  test('creation fails if username is less than 3 digits', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'aa',
      name: 'user',
      password: 'secret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('Username and password must contain at least 3 digits')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if password is less than 3 digits', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user',
      name: 'user',
      password: 'se',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      
    expect(result.body.error).toContain('Username and password must contain at least 3 digits')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'admin',
      name: 'user',
      password: 'unknown'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
  
afterAll(() => {
  mongoose.connection.close()
})