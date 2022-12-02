const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')
let token = null

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id field is id', async () => {
  const blogsAtStart = await helper.blogsInDp()
  expect(blogsAtStart[0].id).toBeDefined()
})

// USER AUTOTEST

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'AutoTest', passwordHash })
  await user.save()

  await api
    .post('/api/login')
    .send({ username: 'AutoTest', password: 'sekret' })
    .then((res) => {
      return (token = res.body.token)
    })

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  return token
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Sipulimäyrän kosto'
  )
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Puuha Pate',
    author: 'Samuel L.Jackson',
    url: 'asd.com',
    likes: 20,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Puuha Pate')
})

test('blog without title is not added', async () => {
  const newBlog ={
    author: ':D',
    ulr: 'D:',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'XD',
    author: ':D',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDp()

  const blogsToView = blogsAtStart[0]

  const resultblog = await api
    .get(`/api/blogs/${blogsToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedBlogsToView = JSON.parse(JSON.stringify(blogsToView))

  expect(resultblog.body).toEqual(processedBlogsToView)
})

test('a blog can be deleted', async () => {

  const newBlog = {
    title: 'DeleteMe',
    author: 'Samuel L.Jackson',
    url: 'asd.com',
    likes: 20,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  expect(titles).toContain('DeleteMe')

  const blogsAtStart = await helper.blogsInDp()
  const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDp()
  // expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const deleteTitle = blogsAtEnd.map(r => r.title)

  expect(deleteTitle).not.toContain(blogToDelete.title)
})

test('if no likes, put likes to 0', async () => {

  const blogWithNoLikes = {
    title: 'I have no likes',
    author: 'Jorgman Poger',
    url: 'asd.com',
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithNoLikes)
    .expect(201)
  const response = await api.get('/api/blogs')
  expect(response.body[2].likes).toEqual(0)
})

test('blogs likes can be modified', async () => {
  const newBlog = {
    title: 'XD',
    author: ':D',
    url: ':)',
    likes: 12,
  }
  const newLikes = {
    likes: 420
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const id = response.body[2].id

  await api
    .put(`/api/blogs/${id}`)
    .send(newLikes)
    .expect(200)
  const newResponse = await api.get('/api/blogs')
  expect(newResponse.body[2].likes).toEqual(420)
})

// User Tests
describe('when there is initially one user at db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('unauthorized user cannot create a blog', async () => {
    const newBlog = {
      title: 'I cannot be added',
      author: 'Yeah',
      url: 'Googles',
    }

    token = null

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDp()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

test('cannot add user with username less than 3', async () => {

  const newUser = {
    username: '',
    name: 'Aatu ',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(helper.initialUsers.length)
})
afterAll(() => {
  mongoose.connection.close()
})