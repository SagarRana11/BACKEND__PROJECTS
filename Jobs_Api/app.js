require('dotenv').config()
require('express-async-errors')

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const express = require('express')
const app = express()

//swagger 
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
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


app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.set('view engine', 'ejs');
//extra packages
app.get('/', (req, res) => {
    res.render('index')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);
//port
const port = process.env.PORT || 3000
// app runnning
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port http://localhost:${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()