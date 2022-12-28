"use strict";

const express = require("express");
const hut_dao = require("../dao/hutdao");
const { check, validationResult } = require("express-validator");
const hike_dao = require("../dao/hikedao");
const checkAuth = require("../../authMiddleware");
const functions = require("../functions/functions");

const router = express.Router();
var storage = require('../../storage');

router.post(
	"/api/hut",
	checkAuth.isLocalGuide,
	[
		check("hut.email").isEmail(),
		check("hut.website").isURL(),
		check("hut.description").notEmpty(),
		check("hut.altitude").isNumeric(),
		check("hut.languages").isIn(["French", "English", "German"]),
		check("hut.reachability").isIn(["With normal car","With off-road car","On foot","Cableway"]),
		check("hut.rooms").isNumeric(),
		check("hut.bathrooms").isNumeric(),
		check("hut.beds").isNumeric(),
		check("hut.bike_friendly").isIn([true, false]),
		check("hut.disabled_services").isIn([true, false]),
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

router.put("/api/hut/:id/image", storage.uploadImg, async (req, res) => {
	console.log("ciao sono nella put")
    try {
        console.log("Informazioni sull'immagine inserita:");
        console.log(req.file);
        await hut_dao.insertHutImg(req.params.id, req.file.filename);
        res.status(201).end()
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

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
			const maxRadius = 5;
			if (
				!(await functions.checkRadiusDistance(
					req.body.hikeid,
					req.body,
					maxRadius
				))
			)
				return res
					.status(422)
					.json(
						`Selected interest point not within ${maxRadius} km from any point of the hike`
					);
			const hikeID = await hike_dao.postHike_Point(
				req.body.hikeid,
				"hut",
				hut.point_id
			);
			return res.status(201).json({ id: hikeID });
		} catch (err) {
			res.status(500).json({ error: "Generic error" }).end();
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

router.post(`/api/huts/filter`, async (req, res) => {
	let errFlag = false;
	const filters = req.body;
	try {
		let huts = await hut_dao.getHuts()
		filters.forEach(async (filter) => {
			switch (filter.filterName) {
				case "none":
					break;
				case "altitude":
					huts = huts.filter(
						(hut) =>
							hut.altitude >= filter.value1 &&
							hut.altitude <= filter.value2
					)
					break;

				case "restaurant_service":
					huts = huts.filter(
						(hut) =>
							hut.restaurant_service == 1
					)
					break;
				case "disabled_services":
					huts = huts.filter(
						(hut) =>
							hut.disabled_services == 1
					)
					break;
				case "bike_friendly":
					huts = huts.filter(
						(hut) =>
							hut.bike_friendly == 1
					)
					break;
				case "city":
					huts = huts.filter(
						(hut) =>
							hut.city == filter.value1
					)
					break;
				case "province":
					huts = huts.filter(
						(hut) =>
							hut.province == filter.value1
					)
					break;
				case "beds":
					huts = huts.filter(
						(hut) =>
							hut.beds > 0
					)
					break;
				case "reachability":
					huts = huts.filter(
						(hut) =>
							hut.reachability == filter.value1
					)
					break;
				case "area":
					const neCoordinates = filter.value1.split(",");
					const swCoordinates = filter.value2.split(",");

					huts = huts.filter(
						(hut) =>
							hut.latitude > swCoordinates[0] &&
							hut.latitude < neCoordinates[0] &&
							hut.longitude > swCoordinates[1] &&
							hut.longitude > neCoordinates[1]
					);
					break;
				default:
					console.log("wrong filter error");
					errFlag = true;
					break;
			}
		});
		if (errFlag) {
			return res.status(422).json({ error: `Validation of request body failed` });
		}
		return res.status(200).json(huts);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error });
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

module.exports = router;
