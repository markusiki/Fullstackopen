const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  try {
  const body = request.body
    
  const user = await User.findById(request.user) 

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  }
  catch (error) {
    response.status(400).json()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === request.user.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
      }
    else {
      return response.status(401).json({ error: 'wrong user' })
    }
  }
  catch(error) {
    response.status(400).json()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    url: body.url,
    likes: body.likes,
    author: body.author,
    user: body.user.id
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1, id: 1 })
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter