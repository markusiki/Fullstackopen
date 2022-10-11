const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('when there is initially some notes saved', () => {
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
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with statuscode 204', async () => {
      const blogs = await helper.blogsInDb()
      const blogToDelete = blogs[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

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
  
afterAll(() => {
  mongoose.connection.close()
})