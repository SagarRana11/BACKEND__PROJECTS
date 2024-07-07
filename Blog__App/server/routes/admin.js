const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/Post')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'

/**
 * GET/
 * HOME
 */


router.get("/admin", async (req, res) => {


    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created By Sagar"
        }
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error.message)
    }
})

/**
 * POST/
 * ADMIN
 */

router.post("/admin", async (req, res) => {


    try {
        console.log(req.body)
        const { username, password } = req.body

        if (username === 'admin' && password === 'password') {

        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error.message)
    }
})

/**
 * POST/
 * REGISTER
 */


router.post("/register", async (req, res) => {


    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User Created', user })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use' })
            }
            res.status(500).json({ mesage: 'Internal server error' })
        }



        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router;