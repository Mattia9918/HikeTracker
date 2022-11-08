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

/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

/* Objects to export */
module.exports = {
	app: app,
};
