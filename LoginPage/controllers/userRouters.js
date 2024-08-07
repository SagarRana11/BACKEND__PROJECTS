const bcryptjs = require('bcryptjs')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const crypto = require('crypto')
const CustomError = require('../errors')
const createTokenUser = require('../utils/createUserToken')
const { createJwt, attachCookieToResponse } = require('../utils/jwt')
const Token = require('../models/Token')
const sendForgotPasswordEmail = require('../utils/sendForgotPasswordEmail')
const createHash = require('../utils/createHash')
const generateToken = require('../utils/generateToken')



// register user

const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("it's working")
    if (!username || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).send("incomplete credentials")
        console.log("Invalid credentials")
        return
    }
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(StatusCodes.BAD_REQUEST).send("user alresady exists")
        // throw new CustomError.BadRequestError('A user for this email already exists')
        return
    }
    const verificationToken = generateToken()
    const user = await User.create({ username, email, password, verificationToken })

    console.log('user :', user)
    const origin = 'http://localhost:3343';
    await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin,
    })
    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify account',
    });

}

const verifyEmail = async (req, res) => {
    // const url = 'http://localhost:5000/user/verify-email?token=9fd39bc67fb4b78a6cd0c54b66b6492125c455c514e6906fd1a1a0bf1b6787a7b5c94e22a45d075c&email=ranasagar974@gmail.com'
    console.log('inside verify_email')
    const token = req.body.token

    const user = await User.findOne({ verificationToken: token })
    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).send('invalid pass')
        return
    }

    user.isVerified = true
    user.verified = Date.now();
    user.verificationToken = '';
    await user.save()
    console.log("user after email verification", user)

    res.status(StatusCodes.OK).json({ msg: 'Email Verified' });

}
const login = async (req, res) => {
    console.log('inside login')
    const { email, password } = req.body
    const user = await User.findOne({ email })
    console.log("user", user)
    if (!user) {
        console.log("invalid credentials")
        res.status(StatusCodes.BAD_REQUEST).send("Invalid credentials")
        return
        // throw new CustomError.BadRequestError("Invalid credentials")

    }
    const passwordMatch = await user.comparePassword(password)
    console.log("password Match", passwordMatch)
    if (!passwordMatch) {
        console.log("invalid credentials")
        res.status(StatusCodes.BAD_REQUEST).send("Invalid credentials")
        return

        // throw new CustomError.BadRequestError("Invalid credentials")
    }
    // this code can be seperated
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
        res.status(StatusCodes.OK).json({ username: user.username });
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
    console.log("after log in :", user.username)
    res.status(StatusCodes.OK).json({ message: "user logged in", username: user.username })



}

const forgotPassword = async (req, res) => {
    console.log('inside forgot password')
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(StatusCodes.BAD_REQUEST).send("Email does not exist")
        // throw new CustomError.BadRequestError("invalid credential : email")
        return
    }
    const passwordToken = generateToken()
    user.passwordToken = passwordToken
    // password expiration time
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)


    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()
    console.log("this is passwordToken", user.passwordToken)


    // send password reset link
    const origin = 'http://localhost:3343'
    sendForgotPasswordEmail({
        name: user.username,
        email: user.email,
        passwordToken,
        origin,
    })
    res.status(StatusCodes.OK).json({ message: "check your email" })
}
// const getResetPassword = (req, res) => {
//     const token = req.body.token

//     data = { token, email }
//     console.log(data)
//     res.render('index', data);


// }
const resetPassword = async (req, res) => {
    console.log("inside")
    const { token, password } = req.body
    console.log("here")
    if (!token || !password) {
        console.log("provide token and password")
        res.status(StatusCodes.BAD_REQUEST).send("Invalid token")
        return
    }

    const user = await User.findOne({ passwordToken: token });
    console.log("user before: ", user)
    if (user) {
        const currentDate = new Date()

        if (
            user.passwordTokenExpirationDate > currentDate
        ) {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            await user.save();
            console.log(user)

        }
    }
    res.status(StatusCodes.CREATED).send(user)

}

const getAllUsers = async (req, res) => {
    const users = await User.find({})
    res.json(users)
}

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,

    resetPassword,
    getAllUsers
}