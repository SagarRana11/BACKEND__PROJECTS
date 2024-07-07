const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET
/**
 * 
 * CHECK LOGIN
 */

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "unauthorized" })

    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" })
    }
}






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

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' })

        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials' })

        }

        const token = jwt.sign({ userId: user._id }, jwtSecret)
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');



    } catch (error) {
        console.log(error.message)
    }
})


/**
 * GET/
 * ADMIN/DASHBOARD
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Dashboard",
            description: "Simple Blog created with NODEJS"
        }
        const data = await Post.find();
        res.render('admin/dashboard', { locals, data, layout: adminLayout })
    } catch {

    }

})

/**
 * GET/
 * ADD/POST
 */
router.get("/add-post", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NODEJS"
        }

        res.render('admin/add-post', { locals, layout: adminLayout })
    } catch {

    }

})

/**
 * POST/
 * ADD-POST
 */
router.post("/add-post", authMiddleware, async (req, res) => {
    try {
        try {
            const body = req.body;
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
            })
            await Post.create(newPost)
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error)

        }


    } catch (error) {
        console.log(error)
    }

})


/**
 * PUT/
 * EDIT-POST
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        console.log(Post.find({ _id: req.params.id }))

        res.redirect(`/edit-post/${req.params.id}`);


    } catch (error) {
        console.log(error)
    }

})

/**
 * GET/
 * EDIT-POST
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        const data = await Post.findOne({ _id: req.params.id })
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NODEJS"
        }
        res.render('admin/edit-post', { locals, data, layout: adminLayout })

    } catch (error) {
        console.log(error.message)

    }
})

/**
 * DELETE/
 * EDIT-POST
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard')


    } catch (error) {
        console.log(error)
    }

})

/**
 * GET/
 * LOGOUT
 */
router.get("/logout", authMiddleware, async (req, res) => {
    res.clearCookie('token')
    res.redirect('/')

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



    } catch (error) {
        console.log(error.message)
    }
})





module.exports = router;