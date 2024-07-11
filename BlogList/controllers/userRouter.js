const userRouter = require('express').Router()
const mongoose = require('mongoose')
const User = require('../models/schema/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.status(203).json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const saltValue = 10
    const passwordHash = await bcrypt.hash(password, saltValue)
    const user = new User({
        username,
        name,
        passwordHash
    })
    try {
        const returnedUser = await user.save()
        response.status(203).json(returnedUser)
    } catch (error) {
        console.error(error)
        response.status(400).end()
    }
})
module.exports = userRouter