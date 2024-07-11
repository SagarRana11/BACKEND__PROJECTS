const blogRouter = require('express').Router()
const Blog = require('../models/schema/blog')
blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
        return response.status(400).json({ message: "bad request" })
    }
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogRouter.put('/:id', async (request, response, error) => {
    const id = request.params.id
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes + 1
    }
    try {
        const updatedNote = await Blog.findByIdAndUpdate(id, blog, { new: true })
        response.json(updatedNote)

    } catch (error) {
        next(error)
    }




})

module.exports = blogRouter