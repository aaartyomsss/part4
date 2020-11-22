const Blog = require('../models/blog')

const initBlogs = [
    {
        title: 'Dummy',
        author: 'Ava',
        likes: 17,
        url: 'dummyUrl'
    },
    {
        title: 'And another Dummy',
        author: 'Just Ava',
        likes: 16,
        url: 'AndAnotherDummyUrl'
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initBlogs, blogsInDb
}


