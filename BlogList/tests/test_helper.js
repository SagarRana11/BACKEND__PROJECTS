const User = require("../models/schema/user")


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    usersInDb,
}