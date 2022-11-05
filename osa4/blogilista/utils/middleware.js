const jwt = require('jsonwebtoken')

//Extracts token from the request
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = (request, response, next)=> {
  const user = jwt.verify(request.token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: 'token missing or invalid '})
    }
    else {
      return decoded
    }
  })

  request.user = user.id
  
  next()
}

module.exports = { tokenExtractor, userExtractor }