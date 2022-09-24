const blog = require("../models/blog")

const dummy = (blogs) => {

  return 1

}
const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)

  const reducer = (sum, likes) => {

    return sum + likes
  }

  return likes.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const indexOfMaxLikes = likes.indexOf(Math.max(...likes))
  
  return {
    title: blogs[indexOfMaxLikes].title,
    author: blogs[indexOfMaxLikes].author,
    likes: blogs[indexOfMaxLikes].likes    
  }
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)
  let counter = {}
  for (i of authors.flat()) {
    if (counter[i]) {
        counter[i] += 1
    } else {
        counter[i] = 1
    }
  }
  const blogsCountArray = Object.values(counter)
  const blogsAuthorsArray = Object.keys(counter)
  const mostBlogsIndex = blogsCountArray.indexOf(Math.max(...blogsCountArray))
  
  return {
    author: blogsAuthorsArray[mostBlogsIndex],
    blogs: blogsCountArray[mostBlogsIndex]
  }
}

const mostLikes = (blogs) => {
  let counter = {}
  for (value of blogs) {
    if (counter[value.author]) {
        counter[value.author] += value.likes
    } else {
        counter[value.author] = value.likes
    }
  }
  const likesCountArray = Object.values(counter)
  const blogsAuthorsArray = Object.keys(counter)
  const mostlikesIndex = likesCountArray.indexOf(Math.max(...likesCountArray))
  
  return {
    author: blogsAuthorsArray[mostlikesIndex],
    likes: likesCountArray[mostlikesIndex]
  }

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
  }