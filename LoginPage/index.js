require('dotenv').config()
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
require('./passport-setup');
//for gooogle user
const Token = require('./models/Token')
const createTokenUser = require('./utils/createUserToken')
const attachCookieToResponse = require('./utils/jwt')
const CustomError = require('./errors')
const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes')

const mongoose = require('mongoose')
const connectDB = require('./db/config')
const { requstLogger } = require('./middlewares/requestLogger')
const userRouters = require('./routers/userRoute')
//custom middlewares
const notfound = require('./middlewares/notFound')
const app = express()
app.set('view engine', 'ejs');

//modules import
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))

app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

//routes

//google auth route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        console.log('inside callback')
        const user = req.user;
        const tokenUser = createTokenUser(user)
        console.log("tokenUser :", tokenUser)
        let refreshToken = '';
        //check for existing Token
        const existingToken = await Token.findOne({ user: user._id })
        console.log("existing Token :", existingToken)
        if (existingToken) {
            const { isValid } = existingToken;
            if (!isValid) {
                throw new CustomError.UnauthenticatedError('Invalid Credentials');
            }
            refreshToken = existingToken.refreshToken;
            attachCookieToResponse({ res, user: tokenUser, refreshToken });
            res.status(StatusCodes.OK).json({ user: tokenUser });
            return;
        }
        // making a Token Object for every user

        refreshToken = crypto.randomBytes(40).toString('hex')
        // console.log("refresh token", refreshToken)
        const userAgent = req.headers['user-agent']
        const ip = req.ip
        const userToken = { refreshToken, userAgent, ip, user: user._id }
        // console.log("useragent :", userAgent)
        const token = await Token.create(userToken)
        // console.log("token with TOKEN Schema :", token)
        attachCookieToResponse({ res, user: tokenUser, refreshToken });
        res.redirect('/');
    },
    (err) => {
        console.error('Authentication Error:', err);
        res.status(500).json({ error: 'Authentication failed' });
    });

app.get('/profile', isLoggedIn, (req, res) => {
    res.send(`Hello, ${req.user.username}`);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Sign in with Google</a>')
})
app.use(requstLogger)
app.use('/v1/user', userRouters)
app.use(notfound)


const PORT = process.env.PORT || 7777


const start = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server created at http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()