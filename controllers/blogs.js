const express = require('express')
const router = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')
const jwt = require('jsonwebtoken')

router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(blog => blog.toJSON()))
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    res.json(blog.toJSON())
})


router.post('/', async (request, response) => {

    // Validation, i.e. returning an object which the token is based on
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)


    if (!request.body.title || !request.body.url) {
        return response.status(400).send({ error: 'Missing required field(s)' })
    } else if (!request.body.likes) {
        const blog = new Blog({
            title: request.body.title,
            url: request.body.url,
            author: request.body.author,
            likes: 0,
            user: user._id
        })
        const savedBlog = await blog.save()
        console.log(savedBlog)
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
    } else {
        const blog = new Blog({
            title: request.body.title,
            url: request.body.url,
            author: request.body.author,
            likes: request.body.likes,
            user: user._id
        })
        const savedBlog = await blog.save()
        console.log(savedBlog)
        user.blogs = user.blogs.concat(savedBlog._id)
        console.log(user)
        await user.save()

        response.json(savedBlog)
    }

})


router.delete('/:id', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete.user.toString() === user.id.toString()) {
        const removed = await Blog.remove(blogToDelete)
        user.blogs = user.blogs.splice(-1)
    }


    response.status(204).end()
})

router.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        author: body.author,
        likes: body.likes,
        url: body.url
    }

    const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updated)
})

module.exports = router