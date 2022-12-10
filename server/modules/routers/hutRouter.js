"use strict";

const express = require("express");
const hut_dao = require("../dao/hutdao");
const { check, validationResult } = require("express-validator");
const hike_dao = require("../dao/hikedao");
const checkAuth = require("../../authMiddleware");

const router = express.Router();

router.post(
	"/api/hut",
	checkAuth.isLocalGuide,
	[
		check("hut.email").isEmail(),
		check("hut.website").isURL(),
		check("hut.description").notEmpty(),
		check("hut.altitude").isNumeric(),
		check("hut.languages").isIn(["french", "english", "german"]),
		check("hut.reachability").isIn(["foot", "cable", "normal", "offroad"]),
		check("hut.rooms").isNumeric(),
		check("hut.bathrooms").isNumeric(),
		check("hut.beds").isNumeric(),
		check("hut.bike_friendly").isIn([0, 1]),
		check("hut.disabled_services").isIn([0, 1]),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {
			const pointId = await hike_dao.postPointHut(req.body.point);

			const hutID = await hut_dao.postHut(req.body.hut, pointId);

			return res.status(201).json({ id: hutID });
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: `Generic error` }).end();
		}
	}
);

// Post the Hike_Point linked with Hut
router.post(
	"/api/hutLinkHike",
	checkAuth.isLocalGuide,
	[],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {
			const hut = await hut_dao.getHutById(req.body.hutId);

			const hikeID = await hike_dao.postHike_Point(
				req.body.hikeid,
				"hut",
				hut.point_id
			);

			return res.status(201).json({ id: hikeID });
		} catch (err) {
			res.status(500).json({ error: `Generic error` }).end();
		}
	}
);

/** Get all huts **/
router.get("/api/huts", checkAuth.isLoggedIn, async (req, res) => {
	try {
		const huts = await hut_dao.getHuts();
		return res.status(200).json(huts);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
});

// hikeLinkedhut delete
router.delete("/api/hut/deleteLink", async (req, res) => {
	try {
		await hut_dao.deleteHikeLinkedHut();
		return res.status(204).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

/** Get hut by id **/
router.get("/api/hut/:id", checkAuth.isLoggedIn, async (req, res) => {
	try {
		const id = req.params.id;
		const hut = await hut_dao.getHutById(id);
		if (hut === undefined) {
			return res.status(404).json({ error: "Hut not found!" });
		}
		return res.status(200).json(hut);
	} catch (err) {
		return res.status(500).end();
	}
});

/** Get huts with filters **/
router.get(`/api/hut*`, checkAuth.isLoggedIn, async (req, res) => {
	try {
		let huts;
		const filter = req.query.filter;
		switch (filter) {
			case "none":
				huts = await hut_dao.getHuts();
				break;
			case "altitude":
				huts = await hut_dao.getHutByAltitude(
					req.query.value1,
					req.query.value2
				);
				break;
			case "restaurant_service":
				huts = await hut_dao.getHutWithRestaurant();
				break;
			case "disabled_services":
				huts = await hut_dao.getHutWithDisabledServices();
				break;
			case "bike_friendly":
				huts = await hut_dao.getHutBikeFriendly();
				break;
			case "city":
				huts = await hut_dao.getHutByCity(req.query.value1);
				break;
			case "province":
				huts = await hut_dao.getHutByProvince(req.query.value1);
				break;
			case "beds":
				huts = await hut_dao.getHutWithBeds();
				break;
			case "reach":
				huts = await hut_dao.getHutByReachability(req.query.value1);
				break;
			case "area":
				/* Gets huts that are in a rectangular area with diagonal from bottom-left to upper right */
				huts = await hut_dao.getHutByArea(
					req.query.value1,
					req.query.value2
				);
				break;
			default:
				console.log("wrong filter error");
				return res
					.status(422)
					.json({ error: `Validation of request body failed` })
					.end();
		}
		return res.status(200).json(huts);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
});

router.get("/api/citiesHut", async (req, res) => {
	try {
		const cities = await hut_dao.getHutCities();
		res.status(200).json(cities);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.get("/api/provincesHut", async (req, res) => {
	try {
		const provinces = await hut_dao.getHutProvinces();
		res.status(200).json(provinces);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.get("/api/linkedHut", async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	try {
		const linkedHut = await hut_dao.getHutsLinkedHike();
		res.status(200).json(linkedHut);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.get("/api/linkedHut/:id", async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	try {
		const id = req.params.id;
		const linkedHut = await hut_dao.getHutLinkedToHikeById(id);
		res.status(200).json(linkedHut);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

module.exports = router;
