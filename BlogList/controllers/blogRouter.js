const blogRouter = require('express').Router()
const Blog = require('../models/schema/blog')
const User = require('../models/schema/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    let authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', "")
    }
    return null
}

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

    if (!decodedToken.id) {
        response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const body = request.body
    if (!body.title || !body.url) {
        return response.status(400).json({ message: "bad request" })
    }
    const blog = new Blog({
        ...body,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()
    response.status(203).json(savedBlog)


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