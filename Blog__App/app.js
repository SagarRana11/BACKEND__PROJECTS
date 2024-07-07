require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDb = require("./server/config/db")
const app = express();
const port = 5000 || process.env.port;
connectDb()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),

    cookie: { maxAge: new Date(Date.now() + (3600000)) }
}))
app.use(express.static('public'))
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

// app.get('/', (req, res) => {
//     res.send("Hello People")
// })

app.listen(port, () => {
    console.log(`App working ${port}`)
})