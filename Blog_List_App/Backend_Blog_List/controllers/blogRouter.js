const blogRouter = require('express').Router()
const Blog = require('../models/schema/blog')
const User = require('../models/schema/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    let authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', "")
    }
    next()
}


blogRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', tokenExtractor, async(request, response) => {

    const user = await request.user

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

blogRouter.put('/:id', async(request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 })
    response.json(updatedBlog)
})

blogRouter.delete('/:id', tokenExtractor, async(request, response) => {
    console.log("in the delete function")
    const { id } = request.params
    const blogToDelete = await Blog.findById(id)
    const userId = blogToDelete.user
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (userId.toString() === decodedToken.id.toString()) {
        console.log('yaha ander')
        await Blog.deleteOne({ _id: id })
        console.log('deleted')
        response.status(203).end()
    } else {
        response.status(400).json({ error: "different user" })

    }
})





module.exports = blogRouter