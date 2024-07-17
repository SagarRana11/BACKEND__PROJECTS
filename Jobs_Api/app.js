require('dotenv').config()
require('express-async-errors')

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limiter')
const express = require('express')
const app = express()

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middlewares/authentication')
    //routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handlers
const notFoundMiddleWare = require('./middlewares/not-found')
const errorHandlerMiddleWare = require('./middlewares/error-handler')
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
}))

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
    //extra packages

//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);
//port
const port = process.env.PORT || 3000
    // app runnning
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port http://localhost:${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()