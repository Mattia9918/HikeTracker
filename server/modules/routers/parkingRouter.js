"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const parking_dao = require("../dao/parkingdao");
const {check, validationResult} = require("express-validator");
const checkAuth = require("../../authMiddleware");

const router = express.Router();

//PARKING_LOT TABLE

router.get("/api/parking", checkAuth.isLoggedIn, async (req, res) => {

    try {
        const parks = await parking_dao.getParks();
        return res.status(200).json(parks);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get("/api/parking/:id", checkAuth.isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        const park = await parking_dao.getParkById(id);
        res.status(200).json(park);
    } catch (err) {
        res.status(500).end();
    }
});

router.post('/api/parking', checkAuth.isLocalGuide, 
[
    check('guarded').isNumeric(),
    check('parking_spaces').isNumeric()
]
, async (req, res) => {

    try {
       
        const parkingPointID = await hike_dao.postParkPoint(req.body.parkingPoint);
        if(parkingPointID){
          const id=await parking_dao.createParking(req.body.name, req.body.guarded, req.body.parking_spaces, req.body.price_per_hour, req.body.disabled_parkings, req.body.timetable, parkingPointID);
          return res.status(201).json(id);
        }
       
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Generic error` }).end();
    }


});

// parking delete
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