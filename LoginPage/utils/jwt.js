const jwt = require('jsonwebtoken')
const { secure } = require('./nodemailerConfig')
const createJwt = ({ payload }) => {
    console.log("payload from createJwt", payload)
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
}

const attachCookieToResponse = ({ res, user, refreshToken }) => {
    const refreshTokenJWT = createJwt({ payload: { user, refreshToken } })
    console.log("returned token : refreshToken :",
        refreshTokenJWT)
    const accessTokenJWT = createJwt({ payload: user })
    console.log("returned token : refreshToken :", accessTokenJWT)
    const oneDay = 1000 * 60 * 60 * 24;
    const longerExp = 1000 * 60 * 60 * 24 * 30;


    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneDay)
    })
    res.cookie("accessToken", accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + longerExp)
    })
}

module.exports = { createJwt, attachCookieToResponse }