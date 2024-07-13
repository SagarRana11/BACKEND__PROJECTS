const mongoose = require('mongoose')
require('dotenv').config()

const config = require('../../utils/config')
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(config.MONGODB_URL)
        console.log(`Database connected: ${conn.connection.host}`)

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDB