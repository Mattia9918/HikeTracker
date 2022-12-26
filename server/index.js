"use strict";

require('dotenv').config({ path: './PARAM.env' })

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const user_dao = require("./modules/dao/userdao");

const hutRouter = require('./modules/routers/hutRouter.js'); 
const userRouter = require('./modules/routers/userRouter.js');
const hikeRouter = require('./modules/routers/hikeRouter.js');
const parkingRouter = require('./modules/routers/parkingRouter.js');
const gpxRouter = require('./modules/routers/gpxRouter.js');
const sessionRouter = require('./modules/routers/sessionRouter.js');

const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const PassportLocal = require('passport-local');

// initialize and configure passport
passport.use(new PassportLocal (
	// function of username, password, done(callback)
	(username, password, done) => {
		// look for the user data
		user_dao.getUserByCredentials(username, password).then(user => {
			if (user)
				done(null, user);
			else
				done(null, false, { message: 'Username or password wrong' });
		}).catch(err => {
			done(err);
		});
	}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
	done(null, user);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((user, done) => {
	return done(null, user);
});

/* -- SERVER AND MIDDLEWARE CONFIGURATION */

/* Express server init */
const app = new express();
const port = 3001;

/* CORS options allowing cookies exchange */
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
};

/* Middlewares */
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));

/* This path is freely accessible from the external */
app.use(express.static('hikepictures'));

app.use(session({
	secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// tell passport to use session cookies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

/* Routers */
app.use('/api', userRouter);
app.use('', hikeRouter);
app.use('', gpxRouter);
app.use('', hutRouter ); 
app.use('', parkingRouter);
app.use('/api/sessions', sessionRouter);


/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

const isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
	    return next();
	}
	return res.status(401).json({error: 'Not authorized'});
}


/* Objects to export */
module.exports = {
	app: app
};

exports.isLoggedIn = isLoggedIn
