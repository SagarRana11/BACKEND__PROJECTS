const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const api = supertest(app)
const Blog = require('../models/schema/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/schema/user')
const helper = require('./test_helper')

const userForTest = {
    username: "sagar",
    name: "ssgar",
    password: "@sagar"
}
let token;

const initialBlogs = [{
    title: "I love programming",
    author: "sagar rana",
    url: "iloveprogramming.com",
    likes: 13,
},
{
    title: "why I love programming",
    author: "sagar rana",
    url: "whyIloveprog.com",
    likes: 12,
}
]

beforeEach(async () => {
    await Blog.deleteMany()
    await User.deleteMany()
    initialBlogs.forEach(blog => {
        const BlogObject = new Blog(blog)
        BlogObject.save()
    })
    await api
        .post('/api/users')
        .send(userForTest)

    const response = await api
        .post('/api/login')
        .send(userForTest)

    token = response.body.token
})

test("returned blogs are in JSON format", async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there is a unique identifier', async () => {
    const blog = new Blog({
        title: "a new trial blog",
        author: "sagar rana",
        url: "abc.com",
        likes: 12,
    })
    const returnedBlog = await blog.save()
    // mongo makes new Object with _id
    const id = returnedBlog._id.toString()
    // requesting all blogs
    const blogs = await api
        .get('/api/blogs')
        .expect(200)

    const length = blogs.body.length
    const BlogToCheck = blogs.body[length - 1]
    console.log(BlogToCheck)
    assert.deepStrictEqual(BlogToCheck.id, id)
})
test('a new Blog can be added', async () => {



    const newBlog = {
        title: "this blog is for post trial",
        author: "Mr Tester",
        url: "newBlog.com",
        likes: 10,
    }
    const postResponse = await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(203)
    assert.strictEqual(postResponse.body.title, newBlog.title)
    assert.strictEqual(postResponse.body.author, newBlog.author)
    assert.strictEqual(postResponse.body.url, newBlog.url)
    assert.strictEqual(postResponse.body.likes, newBlog.likes)

    await api.get('/api/blogs')

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(blog => blog.title)

    assert(titles.includes('this blog is for post trial'))
})

test('a new Blog added without likes has 0 likes by default', async () => {
    const newBlog = {
        title: "this blog is for post trial",
        author: "Mr Tester",
        url: "newBlog.com",
    }
    const returnedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(returnedBlog.body.likes === 0, true)
})
test('a new blog without title and url is not formed', async () => {
    const newBlogObject = {
        title: "this blog is for post trial",
        author: "Mr Tester",
    }
    await api
        .post('/api/blogs')
        .send(newBlogObject)
        .expect(400)
})
after(async () => {
    await mongoose.connection.close()
})