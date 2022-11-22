"use strict";

require('dotenv').config({ path: './PARAM.env' })

const {resolve} = require('path');
const manageFile = require('./manageGpx');

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const hike_dao = require("./modules/dao/hikedao");
const user_dao = require("./modules/dao/userdao");

const userRouter = require('./modules/routers/userRouter.js');

const fileUpload = require("express-fileupload");

const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const passportLocal = require('passport-local');

const { check, validationResult } = require('express-validator'); // validation middleware

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
app.use(fileUpload());

/* Routers */
app.use('/api', userRouter);


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

/** API PROVA PER PERMESSI **/

app.get("/api/user", isLoggedIn, async (req, res) => {
	try {
		const user = await user_dao.getUserById(1);
		return res.status(200).json(user);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

/* -- API -- */

app.get("/api/hikes", async (req, res) => {
	try {
		const hikes = await hike_dao.getHikes();
		return res.status(200).json(hikes);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

app.get("/api/hike/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const hike = await hike_dao.getHikeById(id);
		res.status(200).json(hike);
	} catch (err) {
		res.status(500).end();
	}
});

app.get(`/api/hike*`, async (req, res) => {
	try {
		let hikes;
		const filter = req.query.filter;
		switch (filter) {
			case "none":
				hikes = await hike_dao.getHikes();
				break;
			case "ascent":
				hikes = await hike_dao.getHikeByAscent(req.query.value1, req.query.value2);
				break;
			case "expectedTime":
				hikes = await hike_dao.getHikeByExpectedTime(req.query.value1, req.query.value2);
				break;
			case "length":
				hikes = await hike_dao.getHikeByLength(req.query.value1, req.query.value2);
				break;
			case "difficulty":
				hikes = await hike_dao.getHikeByDiffculty(req.query.value1);
				break;
			case "city":
				hikes = await hike_dao.getHikeByCity(req.query.value1);
				console.log(hikes);
				break;
			case "province":
				hikes = await hike_dao.getHikeByProvince(req.query.value1);
				console.log(hikes);
				break;
			case "distance":
				hikes = await hike_dao.getHikeByDistanceRange(
					req.query.longitude,
					req.query.latitude,
					req.query.maxDist
				);
				break;
			default:
				console.log("wrong filter error");
				res.status(422).json({ error: `Validation of request body failed` }).end();
				break;
		}
		return res.status(200).json(hikes);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
});

/** SKETCH **/


// FILE UPLOAD(.gpx*)
app.post('/upload', async (req, res) => {
	if (req.files === null) {
		return res.status(400).json({ msg: 'No file uploaded' });
	}

	const file = req.files.file;
	let random = String(Math.floor(Math.random() * 1000)) + '.gpx' //per randomizzare il fileName ed evitare le collisioni}`
	await file.mv(`../client/public/uploads/${random}`, err => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		} else {
			const info = hike_dao.getGpxInfo(`../client/public/uploads/${random}`);
			res.json({
				fileName: random,
				filePath: `/uploads/${random}`,
				startPointLong: info.coordinates[0][0][0],
				startPointLat: info.coordinates[0][0][1],
				endingPointLong: info.coordinates[0][info.coordinates[0].length - 1][0],
				endingPointLat: info.coordinates[0][info.coordinates[0].length - 1][1],
				totalDistance: Math.round(info.totalDistance * 100) / 100,
				totalAscent: Math.round(info.totalAscent * 100 / 100),
				difficulty: info.difficulty
			});
		}

	});
});



// HIKING TABLE

// hiking desc
app.get("/api/hikesdesc/:id", async (req, res) => {

	if (isNan(req.params.id)) {
		return res.status(404).json("Id is a wrong entity");
	}

	try {
		const hikedesc = await hike_dao.getHikeDesc(req.params.id);
		res.status(200).json(hikedesc);
	} catch (err) {
		res.status(500).json({ error: err });
	}
});



//hiking post
app.post('/api/hiking',
	[check('length').isNumeric(),
	check('estimatedTime').isNumeric()]
	, async (req, res) => {


		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {



			const hikeID = await hike_dao.createHiking(req.body.title, req.body.length, req.body.description, req.body.difficulty, req.body.estimatedTime, req.body.ascent, req.body.localguideID);
			const startingPointID = await hike_dao.postPoint(req.body.startingPoint);
			const endingPointID = await hike_dao.postPoint(req.body.endingPoint);
			await hike_dao.postHike_Point(hikeID, "start", startingPointID);
			await hike_dao.postHike_Point(hikeID, "arrive", endingPointID);

			for (let i in req.body.pointsOfInterest) {
				let pointID = await hike_dao.postPoint(req.body.pointsOfInterest[i]);
				await hike_dao.postHike_Point(hikeID, "interest", pointID);
			}

			return res.status(201).json({ "id": hikeID });
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: `Generic error` }).end();
		}


	})

// hiking delete
app.delete('/api/hiking/delete', async (req, res) => {
	try {
		const status = await hike_dao.deleteHikes();
		return res.status(204).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

app.delete('/api/points', async (req, res) => {
	try {
		await hike_dao.deleteHike_Point();
		await hike_dao.deletePoint();

		return res.status(201).end();
	} catch (err) {
		res.status(500).end();
	}
});

//POST GPX AS BLOB
app.post('/api/gpx', async (req, res) => {

	try {

		const path = req.body.path;
		const bin = manageFile.castFileToBinary(resolve(`../client/public${path}`));
		await hike_dao.saveFile(bin);
		return res.status(201).end();
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: `Generic error` }).end();
	}


})

//GET BLOB FROM GPX TABLE AND CONVERT BLOB TO GEOJSON
app.get("/api/gpx/:id", async (req, res) => {
	try {
		const id = req.params.id;

		const bin = await hike_dao.getFileContentById(id);
		const content = manageFile.convertBLOB2String(bin.gpxfile);
		const json = manageFile.getGeoJSONbyContent(content);
		res.status(200).json(json);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});




/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

/* Objects to export */
module.exports = {
	app: app,
};
