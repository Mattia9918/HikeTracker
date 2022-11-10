"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dao = require("./dao");

/* -- SERVER AND MIDDLEWARE CONFIGURATION */

/* Express server init */
const app = new express();
const port = 3001;

/* Middlewares */
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

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

app.get(`/api/hike*`, async (req, res) => {
	try {
		let hikes;
		console.log(req.query); // req.query.filter
		const filter = req.query.filter;
		console.log(filter);
		switch (filter) {
			case "ascent":
				hikes = await dao.getHikeByAscent(req.query.max);
				break;
			case "expectedTime":
				hikes = await dao.getHikeByExpectedTime(req.query.min, req.query.max);
				break;
			case "length":
				hikes = await dao.getHikeByLength(req.query.min, req.query.max);
				break;
			case "difficulty":
				hikes = await dao.getHikeByDiffculty(req.query.difficulty);
				break;
			case "city":
				hikes = await dao.getHikeByCity(req.query.city);
				break;
			case "province":
				hikes = await dao.getHikeByProvince(req.query.province);
				break;
			case "distance":
				hikes = await dao.getHikeByDistanceRange(
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

/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

/* Objects to export */
module.exports = {
	app: app,
};
