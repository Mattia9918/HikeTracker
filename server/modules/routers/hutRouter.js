"use strict";

const express = require("express");
const hut_dao = require("../dao/hutdao");
const point_dao = require("../dao/pointdao");
const { check, validationResult } = require("express-validator");
const hike_dao = require("../dao/hikedao");
const checkAuth = require("../../authMiddleware");
const functions = require("../functions/functions");

const router = express.Router();
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

// Post the Hike_Point linked with Hut
router.post(
	"/api/hutLinkHike",
	checkAuth.isLocalGuide,
	[
		check("hikeid").isInt(),
		check("pointid").isInt()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		try {
			const hike = await hike_dao.getHikeById(req.body.hikeid);
			// Check if hike exists
			if (hike === undefined) {
				return res.status(404).json({ error: "Hike not found"});
			}

			// Check if it is my hike
			if (hike.localguideID !== req.user.id) {
				return res.status(403).json({ error: "Operation forbidden: you must be creator of the hike" });
			}

			const point = await point_dao.getPointById(req.body.pointid);
			// Check if point exists
			if (point === undefined) {
				return res.status(404).json({ error: "Point not found"});
			}
			// Check if point is a hut
			if(point.type !== "hut") {
				return res.status(422).json({ error: "Point to link is not a hut" });
			}

			const maxRadius = 5;
			if (
				!(await functions.checkRadiusDistance(
					req.body.hikeid,
					point,
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
				req.body.pointid
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

/* Gets all huts in 5km from a specific hike*/
router.get("/api/hutsDistantFromHike/:hikeId", async (req, res) => {
	try {
	
		//join with point and hut
		//get array of huts (hutId,name,pointId,latitude,longitude)
		const h = await hut_dao.getHuts();

		let huts = h.map(hut=> {
			return {
			hutId:hut.id,
			name:hut.name,
			pointId:hut.point_id,
			latitude:hut.latitude,
			longitude:hut.longitude,
			city:hut.city,
			province:hut.province
			}
		});
		//get only huts distant 5 km from specific hike
		const filteredHuts = await functions.getItemDistantFromHike(req.params.hikeId,huts,5);
		
		//hikeId not valid => hike not defined in gpx table
		if(filteredHuts.length===1 && filteredHuts[0].err!==undefined)	
			res.status(404).json(filteredHuts[0].err);
		
		else 
			res.status(200).json(filteredHuts);
		
		
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});


module.exports = router;
