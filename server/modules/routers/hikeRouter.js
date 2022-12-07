"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const {check, validationResult} = require("express-validator");
const checkAuth = require("../../authMiddleware");
const { convertBLOB2String, getGeoJSONbyContent } = require("../../manageGpx");
const haversine = require('haversine-distance');

const router = express.Router();

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

router.get(`/api/hike*`, async (req, res) => {
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
             
                break;
            case "province":
                hikes = await hike_dao.getHikeByProvince(req.query.value1);
               
                break;
            case "area":
                hikes = await hike_dao.getHikesByArea(req.query.value1, req.query.value2);
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

//hiking post
router.post('/api/hiking',
    [check('length').isNumeric(),
        check('estimatedTime').isNumeric()
        ], checkAuth.isLocalGuide, 
        async (req, res) => {

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
router.delete('/api/hiking/delete', async (req, res) => {
    try {
        await hike_dao.deleteHikes();
        return res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

router.delete('/api/points', async (req, res) => {
    try {
        await hike_dao.deleteHike_Point();
        await hike_dao.deletePoint();

        return res.status(201).end();
    } catch (err) {
        res.status(500).end();
    }
});

async function checkConstraints(req) {
    const hike = await hike_dao.getHikeById(req.params.id);
    const gpx = await hike_dao.getFileContentById(req.params.id);
    
    // Check if hike exists
    if (hike === undefined || gpx === undefined) {
        return {status: 404, err: "hike or gpx not found"}
    }

    // Check if it is my hike
    if(hike.localguideID !== req.user.id) {
        return {status: 403, err: "Operation forbidden: you must be creator of the hike"}
    }

    // Check if hut within (maxRadius) km from any of the hike track points
    const blob = convertBLOB2String(gpx.gpxfile);
    const json = getGeoJSONbyContent(blob);
    const coordinates = json.features[0].geometry.coordinates;
    const maxRadius = 5; //radius in km from whatever hike point;
    for (let coordinate of coordinates) {
        let pointA = { latitude: coordinate[1], longitude: coordinate[0] };
        let pointB = { latitude: req.body.latitude, longitude: req.body.longitude};
        if ((haversine(pointA, pointB)/1000) < maxRadius) {
            return {status: 200, err: ""}
        }
    };
    return {status: 422, err: `Selected interest point not within ${maxRadius}km from any point of the hike`}
};

/** APIs to update starting and arrival point of a hut */

router.put('/api/hike/:id/startingPoint', checkAuth.isLocalGuide, 
    [
        check('id').isNumeric(),
        check('latitude').isNumeric(),
        check('longitude').isNumeric(),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            let result = await checkConstraints(req);
            switch (result.status){
                case 403:
                    return res.status(403).json(result.err);
                
                case 404:
                    return res.status(404).json(result.err);
                
                case 422:
                    return res.status(422).json(result.err);
                
                default:
                    //case 200, proceed
                    break;
            }
            await hike_dao.updateHikePoint(req.params.id, req.body.id, 'start')
            return res.status(200).json({msg: "Success: point set as start"})
        } catch (err) {
            console.log(err)
            return res.status(500).json({error: err});
        }
})

router.put('/api/hike/:id/arrivalPoint', checkAuth.isLocalGuide,
    [
        check('id').isNumeric(),
        check('latitude').isNumeric(),
        check('longitude').isNumeric(),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // Aggiungere check sulla distanza

        try {
            let result = await checkConstraints(req);
            switch (result.status){
                case 403:
                    return res.status(403).json(result.err);
                
                case 404:
                    return res.status(404).json(result.err);
                
                case 422:
                    return res.status(422).json(result.err);
                
                default:
                    //case 200, proceed
                    break;
            }
            await hike_dao.updateHikePoint(req.params.id, req.body.id, 'arrive')
            return res.status(200).json({msg: "Success: point set as arrival"})
        } catch (err) {
            return res.status(500).json({error: err});
        }
})

module.exports = router;