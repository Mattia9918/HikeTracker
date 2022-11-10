"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dao = require("./dao");

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

// Register new user
app.post('/api/register', async (req, res) => {
	const email = req.body.email;
	const role = req.body.role;
	try{
		// Generate hash password
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);

		await dao.insertUser(email, password, salt, role);

		// Generate activation code
		const code = crypto.randomBytes(64).toString('hex');

		const activation = await dao.insertActivation(email, code);
		const activationUrl = "http://localhost:3000/api/validate/" + code;

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
								"Name": email
							}
						],
						"Subject": "Activate your account",
						"TextPart": "Account activation email",
						"HTMLPart": `<h3>To activate your account, click <a href=${activationUrl}>here</a>!</h3><br />`,
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


// Validate user
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
