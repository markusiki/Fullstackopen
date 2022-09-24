const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json and right amount', async () => {
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

test('a valid blog can be added', async () => {
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

test('if likes has no value, the value is set to 0', async () => {
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

test('if a new blog doesent have title and url, the request is aswered with a statuscode 400', async () => {
  const newBlog = {
    author: 'test',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})  
  
afterAll(() => {
  mongoose.connection.close()
})