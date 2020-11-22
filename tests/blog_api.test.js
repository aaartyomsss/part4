const { TestScheduler } = require('jest')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const Blog = require('../models/blog')


const api = supertest(app)

//Initializing initial database

beforeEach(async () => {
    await Blog.deleteMany({})
    let blog = new Blog(helper.initBlogs[0])
    await blog.save()
    blog = new Blog(helper.initBlogs[1])
    await blog.save()
})

test('notes are returned as json', async () => {

    const response = await api.get('/api/blogs')

    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initBlogs.length)
})

test('notes are identified by id', async () => {

    const response = await api.get('/api/blogs')
    const ids = response.body.map(obj => obj.id)
    expect(ids).toBeDefined()

})

test('new post is submitted to the db', async () => {
    const newBlog = {
        title: 'Dummy',
        author: 'Ava',
        likes: 17,
        url: 'dummyUrl'
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(200)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initBlogs.length + 1)
})

test('if likes are undefined, then set to 0', async () => {
    const noLikesDefined = {
        title: 'Dummy',
        author: 'Undefined',
        url: 'absent'
    }

    await api.post('/api/blogs')
        .send(noLikesDefined)
        .expect(200)

    const response = await api.get('/api/blogs')

    const numOfLikes = response.body[2].likes

    expect(numOfLikes).toEqual(0)

})

test('if title or url is missing', async () => {
    const dummyBlog = {
        likes: 0
    }

    await api.post('/api/blogs')
        .send(dummyBlog)
        .expect(400)

})

afterAll(() => {
    mongoose.connection.close()
})