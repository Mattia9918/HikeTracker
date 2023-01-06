"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const hut_dao = require("../dao/hutdao");
const point_dao = require("../dao/pointdao");
const { check, validationResult } = require("express-validator");
const checkAuth = require("../../authMiddleware");
const functions = require("../functions/functions");

const router = express.Router();
const storage = require('../../storage');

/* -- API -- */

router.get("/api/hikes", async (req, res) => {
	try {
		const hikes = await hike_dao.getHikes();
		return res.status(200).json(hikes);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

router.get("/api/hike/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const hike = await hike_dao.getHikeById(id);
		res.status(200).json(hike);
	} catch (err) {
		res.status(500).end();
	}
});

router.post(`/api/hikes/filter`, async (req, res) => {
	let errFlag = false;
	const filters = req.body;
	try {
		let hikes = await hike_dao.getHikes();
		filters.forEach(async (filter) => {
			switch (filter.filterName) {
				case "none":
					break;
				case "ascent":
					hikes = hikes.filter(
						(hike) =>
							hike.ascent >= filter.value1 &&
							hike.ascent <= filter.value2
					);
					break;
				case "expectedTime":
					hikes = hikes.filter(
						(hike) =>
							Number(hike.estimatedTime) >= filter.value1 &&
							Number(hike.estimatedTime) <= filter.value2
					);
					break;
				case "length":
					hikes = hikes.filter(
						(hike) =>
							hike.length >= filter.value1 &&
							hike.length <= filter.value2
					);
					break;
				case "difficulty":
					hikes = hikes.filter(
						(hike) => hike.difficulty === filter.value1
					);
					break;
				case "city":
					hikes = hikes.filter(
						(hike) => hike.startingPoint.city === filter.value1
					);
					break;
				case "province":
					hikes = hikes.filter(
						(hike) => hike.startingPoint.province === filter.value1
					);
					break;
				case "area":
					const neCoordinates = filter.value1.split(",");
					const swCoordinates = filter.value2.split(",");
					
					hikes = hikes.filter(
						(hike) =>{
							return (hike.startingPoint.latitude > swCoordinates[0] &&
							hike.startingPoint.latitude < neCoordinates[0] &&
							hike.startingPoint.longitude > swCoordinates[1] &&
							hike.startingPoint.longitude < neCoordinates[1])
						}
					);
					console.log("dao by area " + hikes.length);
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
		return res.status(200).json(hikes);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error });
	}
});

//hiking post
router.post('/api/hiking',
    [
        check('length').isNumeric(),
        check('estimatedTime').isNumeric(),
        check('title').notEmpty(),
        check('description').notEmpty(),
        check('difficulty').isIn(["Easy", "Average", "Difficult"]),
        check('ascent').isNumeric(),
        check('startingPoint').notEmpty(),
        check('endingPoint').notEmpty()
    ], 
    checkAuth.isLocalGuide,
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const hikeID = await hike_dao.createHiking(
                req.body.title,
                req.body.length, 
                req.body.description, 
                req.body.difficulty, 
                req.body.estimatedTime, 
                req.body.ascent, 
                req.user.id
            );

			const startingPointID = await hike_dao.postPoint(
				req.body.startingPoint
			);
			const endingPointID = await hike_dao.postPoint(
				req.body.endingPoint
			);
			await hike_dao.postHike_Point(hikeID, "start", startingPointID);
			await hike_dao.postHike_Point(hikeID, "arrive", endingPointID);

			for (let i in req.body.pointsOfInterest) {
				let pointID = await hike_dao.postPoint(
					req.body.pointsOfInterest[i]
				);
				await hike_dao.postHike_Point(hikeID, "interest", pointID);
			}

			return res.status(201).json({ id: hikeID });
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: `Generic error` }).end();
		}
	}
);



router.put("/api/image/:hikeId", storage.uploadImg, async (req, res) => {
	try {
		console.log("Informazioni sull'immagine inserita:");
		console.log(req.file);
		await hike_dao.insertImg(req.params.hikeId, req.file.filename);
		res.status(201).end()
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

// Saves an image for a Hut
router.put("/api/hut/:id/image", storage.uploadImg, async (req, res) => {
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



router.get("/api/cities", async (req, res) => {
	try {
		const cities = await hike_dao.getHikeCities();
		res.status(200).json(cities);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.get("/api/provinces", async (req, res) => {
	try {
		const provinces = await hike_dao.getHikeProvinces();
		res.status(200).json(provinces);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

// hiking delete
router.delete("/api/hiking/delete", async (req, res) => {
	try {
		await hike_dao.deleteHikes();
		return res.status(204).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.delete("/api/points", async (req, res) => {
	try {
		await hike_dao.deleteHike_Point();
		await hike_dao.deletePoint();

		return res.status(201).end();
	} catch (err) {
		res.status(500).end();
	}
});

async function checkConstraints(req) {
	// Check validation constraints
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return { status: 422, err: errors.array() };
	}

	const hike = await hike_dao.getHikeById(req.params.id);

	// Check if hike exists
	if (hike === undefined) {
		return { status: 404, err: "hike not found" };
	}

	// Check if it is my hike
	if (hike.localguideID !== req.user.id) {
		return {
			status: 403,
			err: "Operation forbidden: you must be creator of the hike",
		};
	}

	const point = await point_dao.getPointById(req.body.id);

	// Check if point exists and coordinates are correct
	if (point === undefined) {
		return { status: 404, err: "point not found" };
	}

	const maxRadius = 5;
	if (await functions.checkRadiusDistance(req.params.id, point, maxRadius))
		return { status: 200, err: "" };
	return {
		status: 422,
		err: `Selected interest point not within ${maxRadius} km from any point of the hike`,
	};
}

/** APIs to update starting and arrival point of a hut */

router.put(
	"/api/hike/:id/startingPoint",
	checkAuth.isLocalGuide,
	[check("id").isNumeric()],
	async (req, res) => {
		try {
			let result = await checkConstraints(req);
			if (result.status !== 200)
				return res.status(result.status).json(result.err);

			await hike_dao.updateHikePoint(req.params.id, req.body.id, "start");
			return res.status(200).json({ msg: "Success: point set as start" });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ error: err });
		}
	}
);

router.put(
	"/api/hike/:id/arrivalPoint",
	checkAuth.isLocalGuide,
	[check("id").isNumeric()],
	async (req, res) => {
		try {
			let result = await checkConstraints(req);
			if (result.status !== 200)
				return res.status(result.status).json(result.err);

			await hike_dao.updateHikePoint(
				req.params.id,
				req.body.id,
				"arrive"
			);
			return res
				.status(200)
				.json({ msg: "Success: point set as arrival" });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ error: err });
		}
	}
);

/** 
 * Start to record a hike
 */
router.post(
	"/api/hike/:id/record",
	checkAuth.isHiker,
	[
        check("time").notEmpty()
    ],
	async (req, res) => {

        // Check validation constraints
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		try {
			// Check if time is a valid date
			const time = new Date(req.body.time);
			if(time.toString() === "Invalid Date") {
				return res.status(422).json({ error: "Invalid Date" });
			}

            // Check if hike exists
            const hike = await hike_dao.getHikeById(req.params.id);
            if(hike === undefined) {
                return res.status(404).json({error: "hike not found"})
            }
            
            // Check if user has ongoing hikes
            const ongoing_hikes = await hike_dao.getOngoingHikeRecordedByUser(req.user.id)
            if(ongoing_hikes !== undefined) {
                return res.status(403)
                .json({error: "you must terminate all ongoing hikes before starting a new one"})
            }

            // Start new recorded hike
            const id = await hike_dao.startHikeByUser(
                req.user.id,
                req.params.id,
                req.body.time
            )
            return res.status(201).json({msg: "Record hike's start with id = " + id})
		} catch (err) {
			console.log(err);
			return res.status(500).json({ error: err });
		}
	}
);

router.put(
    "/api/hike/:id/record",
	checkAuth.isHiker,
	[
        check("time").notEmpty()
    ],
    async (req, res) => {

        // Check validation constraints
        const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		try {
			// Check if time is a valid date
			const time = new Date(req.body.time);
			if(time.toString() === "Invalid Date") {
				return res.status(422).json({ error: "Invalid Date" });
			}

             // Check if record of hike exists and it's still ongoing
             const record = await hike_dao.getHikeRecordedById(req.params.id);
             if(record === undefined) {
                 return res.status(404).json({error: "hike record not found"})
             }
             if(record.end_time !== null) {
                 return res.status(403)
                 .json({error: "you cannot end if you don't start"})
             }
			 
			 // Check if end time is after start time
			 const start_time = new Date(record.start_time);
			 if(time < start_time) {
				return res.status(403)
                 .json({error: "end time must be after start time"})
			 }

             // Update recorded hike
             await hike_dao.endHikeByUser(req.params.id, req.body.time);
             return res.status(200).json({msg: "Record hike's end with id = " + req.params.id})
		} catch (err) {
			console.log(err);
			return res.status(500).json({ error: err });
		}
	}
)

router.get("/api/hike/:id/stats", checkAuth.isHiker, async (req, res) => {
	try {
		const hikes = await hike_dao.getHikeStatsById(req.user.id, req.params.id);
		hikes.map((h) => {
			h.start_time = h.start_time.replace("T", " ");

			if(h.end_time !== null) {
				h.end_time = h.end_time.replace("T", " ");
			}
		})
		return res.status(200).json(hikes);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

router.get("/api/ongoingHike", checkAuth.isHiker, async (req, res) => {
	try {
		const hike = await hike_dao.getOngoingHikeRecordedByUser(req.user.id);
		return res.status(200).json(hike);
	} catch (err) {
        console.log(err)
		return res.status(500).json({ error: err });
	}
});

router.get("/api/notFinishedHike", checkAuth.isHiker, async (req, res) => {
	try {
		const hike = await hike_dao.getNotFinishedHikesByUser(req.user.id);
		return res.status(200).json(hike);
	} catch (err) {
        console.log(err)
		return res.status(500).json({ error: err });
	}
});

router.get("/api/completedHikes",  checkAuth.isHiker,async (req, res) => {
	try {
		const hikes = await hike_dao.getCompletedHikesOfHiker(req.user.id);
		hikes.map((h) => {
			h.start_time = h.start_time.replace("T", " ");
			h.end_time = h.end_time.replace("T", " ");
		})
		return res.status(200).json(hikes);
	} catch (err) {
        console.log(err)
		return res.status(500).json({ error: err });
	}
});

router.delete("/api/completedHikes", async (req, res) => {
	try {
		await hike_dao.deleteHikeUser();

		return res.status(201).end();
	} catch (err) {
		res.status(500).end();
	}
});

module.exports = router;


