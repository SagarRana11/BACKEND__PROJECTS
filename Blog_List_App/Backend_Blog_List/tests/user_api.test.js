const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const User = require('../models/schema/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')


describe('when there is only one user', () => {
    beforeEach(async () => {
        await User.deleteMany()
        const passwordHash = await bcrypt.hash('root', 10)
        const user = new User({
            username: "root",
            name: "root",
            passwordHash
        })
        await user.save()

    })

    test('a valid user can be created', async () => {
        const userAtStart = await helper.usersInDb()
        const user = {
            username: "sagar",
            name: "sagar",
            password: "sagar"
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(203)
            .expect('Content-Type', /application\/json/)
        const userAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    })
})