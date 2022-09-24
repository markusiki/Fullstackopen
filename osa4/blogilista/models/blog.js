const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true 
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.likes === null
      ? returnedObject.likes = 0
      : returnedObject.likes = returnedObject.likes
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Blog', blogSchema)