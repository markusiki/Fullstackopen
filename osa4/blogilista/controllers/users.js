const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = await request.body

  const userValidation = (data) => {
    const len = data.length
    if (len < 3) {
      return false
    }
    return true
  }

  const validUsername = userValidation(username)
  const validPassword = userValidation(password)
  if (!validUsername || !validPassword) {
    return response.status(400).json({
      error: 'Username and password must contain at least 3 digits'
    })
  }

  const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({
        error: 'Username must be unique'
      })
    }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user =  new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1})

  response.status(200).json(users)
})

module.exports = userRouter