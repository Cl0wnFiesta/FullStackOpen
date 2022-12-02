const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'Tiikeri, tiikeri, vi*un iso tiikeri',
    author: 'Henri Uimonen',
    url: 'youtube.com',
    likes: 1,
  },
  {
    title: 'Sipulimäyrän kosto',
    author: 'Rasmus Hyyppä',
    url: 'wikipedia.com',
    likes: 2,
  },
]

const initialUsers = [
  {
    username: 'User',
    name: 'IamUser',
    password: '1234'
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremove' , author: 'will', url: 'remove', likes: 1 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDp = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDp, usersInDb, initialUsers
}