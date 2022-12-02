const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  //const token = getTokenFrom(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.get('/:id', async (request, response) => {
  const id = (request.params.id)
  const blog = await Blog.findById(id)
  response.json(blog)
})

// Updates the blog TODO?
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const { likes } = request.body

  const blog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: body.likes })
  if(blog)
    response.json(blog)
  else
    response.status(404).end()


})

blogsRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token ||!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: ' token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  const user = await User.findById(decodedToken.id)

  if (blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response
      .status(401)
      .json({ error: 'You are not authorized to delete this blog' })
  }
})

module.exports = blogsRouter