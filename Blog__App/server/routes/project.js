const express = require('express');
const router = express.Router();
const Project = require('../models/Project')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {

        return res.render('project/alert');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" })
    }
}

// GET 
// projects
// **
router.get("/projects", async (req, res) => {
    console.log("reciebed get request")
    try {

        let data = await Project.find()
        console.log(data)
        res.render('project/index', { data });
    } catch (error) {
        console.log(error.message)
    }
})


// GET 
// projects
// **
router.get("/add-project", authMiddleware, async (req, res) => {

    try {
        const locals = {
            title: "Add New Project",
            description: "Simple Blog created By Sagar"
        }
        res.render('project/add-project', { locals });
    } catch (error) {
        console.log(error.message)
    }
})

// POST
// projects
// **
router.post("/projects", async (req, res) => {
    try {

        const body = req.body;
        console.log(body)

        const project = new Project({
            title: body.title,
            body: body.body,
            imageURL: body.imagePath,
            githubAddress: body.gitURL,
        })

        await Project.create(project)
            .then(project => console.log(project))

        res.redirect('/projects');
    } catch (error) {
        console.log(error.message)
    }




})


// })

//** 
// get
// for individual post
//**

router.get("/project/:id", async (req, res) => {

    try {
        const slug = req.params.id;
        console.log(slug)
        const data = await Project.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: "Simple Blog created By Sagar"
        }

        res.render('project', { locals, data });
    } catch (error) {
        console.log(error.message)
    }





})

//** 
// get
// edit 
//**

router.get("/edit-project/:id", async (req, res) => {
    try {
        const data = await Project.findOne({ _id: req.params.id })
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NODEJS"
        }
        res.render('project/edit-project', { locals, data })

    } catch (error) {
        console.log(error.message)

    }

})

/**
 * PUT/
 * EDIT-PROJECT
 */
router.put("/edit-project/:id", authMiddleware, async (req, res) => {
    try {
        await Project.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            imageURL: req.body.imagePath,
            githubAddress: req.body.gitURL,

            updatedAt: Date.now()
        });
        console.log(Project.find({ _id: req.params.id }))

        res.redirect(`/project/${req.params.id}`);


    } catch (error) {
        console.log(error)
    }

})

/**
 * DELETE/
 * EDIT-POST
 */
router.delete("/delete-project/:id", authMiddleware, async (req, res) => {
    try {
        await Project.deleteOne({ _id: req.params.id });
        res.redirect('/projects')


    } catch (error) {
        console.log(error)
    }

})




module.exports = router;