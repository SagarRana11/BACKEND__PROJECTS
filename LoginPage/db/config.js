require('dotenv').config()

const mongoose = require('mongoose')

const connectDB = async () => {
    return await mongoose.connect(process.env.MONGO_URI)
}

module.exports = connectDB