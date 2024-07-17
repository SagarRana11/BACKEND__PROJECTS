const jwt = require('jsonwebtoken')
const UnauthenticatedError = require('../errors/unauthenticated')
const User = require('../models/User')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = User.findById(decodedToken.id).select('-password')
        req.user = user
        req.user = { userId: decodedToken.userId, name: decodedToken.name }
        next()

    } catch (error) {
        throw new UnauthenticatedError('Authentication invaid')
    }

}
module.exports = auth