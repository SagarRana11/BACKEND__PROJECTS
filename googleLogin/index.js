require("dotenv").config();
const path = require('path');

const express = require('express');
const cors = require('cors');
const passport = require("passport");
const authRoute = require('./routes/auth');
const session = require('express-session');
const passportStrategy = require("./passport"); // Ensure this file properly configures the passport strategies

const app = express();

// Configure express-session
app.use(
	session({
		secret: 'login', // Replace with your secret key
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
	})
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(express.static(path.join(__dirname, 'dist')));


// Use authentication routes
app.use("/auth", authRoute);

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));