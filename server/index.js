"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dao = require("./dao");

const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const passportLocal = require('passport-local');

// To hash user password
const bcrypt = require("bcrypt");

// To generate random activation code
const crypto = require("crypto");

// To send email
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
	'4f786e2ba95d4eed2e8b266cb0dbf59f',
	'14c5298a106b3a7e08b42783742e6cfe'
);

// initialize and configure passport
passport.use(new passportLocal.Strategy(
	// function of username, password, done(callback)
	(username, password, done) => {
		// look for the user data
		dao.getUserByCredentials(username, password).then(user => {
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
	dao.getUserById(id)
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

/* Middlewares */
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

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
	if (req.user.role === "Local Guide")
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
	req.logout(function(err) {
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

/** API PROVA PER PERMESSI **/
// GET /api/user
/*
app.get('/api/user', isLoggedIn, (req, res) => {
	dao.getUserById(1)
		.then((user) => res.json(user))
		.catch((err) => res.status(500).json({ error: 'DB error', description: err }))
});

 */

app.get("/api/user", isLoggedIn, isLocalGuide, async (req, res) => {
	try {
		const user = await dao.getUserById(1);
		return res.status(200).json(user);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

/* -- API -- */

app.get("/api/hikes", async (req, res) => {
	try {
		const hikes = await dao.getHikes();
		return res.status(200).json(hikes);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

app.get("/api/hike/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const hike = await dao.getHikeById(id);
		res.status(200).json(hike);
	} catch (err) {
		res.status(500).end();
	}
});

app.get(`/api/hikeFilter/*`, async (req, res) => {
	try {
		const filters = ["ascent"];
		const filterFunctions = [dao.getHikeByAscent];
		const mapFilter = new Map();
		mapFilter.set(filters[0], filterFunctions[0]);
		console.log(mapFilter);
		const searchParams = new URLSearchParams(req.url);
		const params = {};

		// the searchParams.entry also have as a value the url
		for (const [key, value] of searchParams.entries()) {
			if (filters.includes(key)) {
				params.filter = key;
				params.value = value;
				break;
			}
		}
		const func = mapFilter.get(params.filter);
		console.log(func);
		const hikes = await func(params.value);
		return res.status(200).json(hikes);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
});

/** Register new user **/

app.post('/api/register', async (req, res) => {
	const email = req.body.email;
	const role = req.body.role;
	const name = req.body.name;
	const surname = req.body.surname;
	try{
		// Generate hash password
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);

		await dao.insertUser(email, password, salt, role, name, surname);

		// Generate activation code
		const code = crypto.randomBytes(64).toString('hex');

		const activation = await dao.insertActivation(email, code);
		const activationUrl = "http://localhost:3000/validate/" + code;

		// Send email with activation code
		const request = mailjet
			.post("send", {'version': 'v3.1'})
			.request({
				"Messages":[
					{
						"From": {
							"Email": "team7sw2@gmail.com",
							"Name": "Team 7"
						},
						"To": [
							{
								"Email": email,
								"Name": name
							}
						],
						"Subject": "Activate your account",
						"TextPart": "Account activation email",
						"HTMLPart": `<h3>Hello, ${name}, to activate your account, click <a href=${activationUrl}>here</a>!</h3><br />`,
						"CustomID": "EmailVerification"
					}
				]
			})
		request
			.then((result) => {
				console.log(result.body)
			})
			.catch((err) => {
				console.log(err.statusCode)
			})

		return res.status(200).json({code: activation});
	} catch(err){
		return res.status(500).json({ error: err });
	}
})


/** Validate user **/

app.get('/api/validate/:code', async (req, res) => {
	const code = req.params.code;
	try{
		// Retrieves activation
		const activation = await dao.getActivationByCode(code)

		// Activate user
		await dao.activateUser(activation.email)

		// Delete activation from table
		await dao.deleteActivation(activation.email)

		const user = await dao.getUserByEmail(activation.email)

		return res.status(200).json(user);
	}catch(err){
		return res.status(500).json({error: err})
	}
})

/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

/* Objects to export */
module.exports = {
	app: app,
};
