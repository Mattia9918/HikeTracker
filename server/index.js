"use strict";

require('dotenv').config({ path: './PARAM.env' })

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const user_dao = require("./modules/dao/userdao");

const userRouter = require('./modules/routers/userRouter.js');
const hikeRouter = require('./modules/routers/hikeRouter.js');
const gpxRouter = require('./modules/routers/gpxRouter.js');

const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const passportLocal = require('passport-local');

// initialize and configure passport
passport.use(new passportLocal.Strategy(
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
	done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
	user_dao.getUserById(id)
		.then(user => {
			done(null, user); // this will be available in req.user
		}).catch(err => {
			done(err, null);
		});
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

/* Routers */
app.use('/api', userRouter);
app.use('', hikeRouter);
app.use('', gpxRouter);

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

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();

	return res.status(401).json({ error: 'not authenticated' });
}

const isLocalGuide = (req, res, next) => {
	if (req.user.role === "local guide")
		return next();

	return res.status(401).json({ error: 'not authorized!' });
}

/** API Login and Logout **/
// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err)
			return next(err);
		if (!user) {
			// display wrong login messages
			return res.status(401).json(info);
		}
		// success, perform the login
		req.login(user, (err) => {
			if (err)
				return next(err);

			// req.user contains the authenticated user, we send all the user info back
			// this is coming from dao.getUserByCredentials()
			return res.json(req.user);
		});
	})(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res, next) => {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.end();
	});
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
	if (req.isAuthenticated()) {
		res.status(200).json(req.user);
	}
	else
		res.status(401).json({ error: 'Unauthenticated user!' });;
});

/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

/* Objects to export */
module.exports = {
	app: app,
};
