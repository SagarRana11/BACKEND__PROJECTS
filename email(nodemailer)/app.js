const express = require('express')
const app = express()
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
const sendEmail = require('./controllers/sendEmail')

app.use(express.json())
app.get('/', (req, res) => {
    res.send('<h1>Email with NodeMailer Project</h1><a href="/send">send email</a>')
})
app.use('/send', sendEmail)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const port = 5000;
app.listen(port, () => {
    console.log(`server running at http://localhost:5000`)
})