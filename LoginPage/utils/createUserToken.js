const createTokenUser = (user) => {
    return { user: user.username, userId: user._id }
}

module.exports = createTokenUser