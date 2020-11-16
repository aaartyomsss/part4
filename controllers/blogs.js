const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')
require('express-async-errors')

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

router.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).send({error: 'Missing required field(s)'})
    } else if (!request.body.likes) {
        const blog = new Blog({
            title: request.body.title,
            url: request.body.url,
            author: request.body.author,
            likes: 0
        })
        const savedBlog = await blog.save()
        response.json(savedBlog)
    } else {
        const blog = new Blog(request.body)
        const savedBlog = await blog.save()
        response.json(savedBlog)
    }

})

module.exports = router