"use strict";

const express = require("express");
const parking_dao = require("../dao/parkingdao");
const {check, validationResult} = require("express-validator");

const router = express.Router();

//PARKING_LOT TABLE

router.get("/api/parking", async (req, res) => {
    try {
        const parks = await parking_dao.getParks();
        return res.status(200).json(parks);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

router.get("/api/parking/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const park = await parking_dao.getParkById(id);
        res.status(200).json(park);
    } catch (err) {
        res.status(500).end();
    }
});

router.post('/api/parking',
[check('guarded').isNumeric(),
    check('parking_spaces').isNumeric()]
, async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {

        const parkID = await parking_dao.createParking(req.body.name, req.body.guarded, req.body.parking_spaces, req.body.price_per_hour, req.body.disabled_parkings, req.body.timetable);
        
        // const endingPointID = await hike_dao.postPoint(req.body.endingPoint);
       
        // await hike_dao.postHike_Point(hikeID, "arrive", endingPointID);

        // for (let i in req.body.pointsOfInterest) {
        //     let pointID = await hike_dao.postPoint(req.body.pointsOfInterest[i]);
        //     await hike_dao.postHike_Point(hikeID, "interest", pointID);
        // }
        return res.status(201).json(parkID );
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Generic error` }).end();
    }


});

// hiking delete
router.delete('/api/parking/delete', async (req, res) => {
    try {
        await parking_dao.deleteParks();
        return res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});


module.exports = router;