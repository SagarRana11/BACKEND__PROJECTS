const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors');
const checkPermission = require('../utils/checkPermission');
const createTokenUser = require('../utils/createTokenUser');
const { attachCookiesToResponse } = require('../utils/jwt');


const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users })
}
const getSingleUser = async (req, res) => {
    const user = User.findOne({ _id: req.params.id }).select('-password')
    if (!user) {
        throw new CustomError.BadRequestError(`No user with id: ${req.params.id}`)
    }
    checkPermission(req.user, user._id)
}
const showCurrentUser = (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
    const { email, name } = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError("Provide name and email to change")
    }
    const user = await User.findOne({ _id: req.user.userId })
    user.name = name;
    user.email = email;

    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse(tokenUser)
    res.status(StatusCodes.OK).json({ user })
}
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Provide old and new password")
    }
    const user = await User.findOne({ _id: req.user.userId })
    const passwordMatch = user.comparePassword(oldPassword)
    if (!passwordMatch) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated' })
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
};