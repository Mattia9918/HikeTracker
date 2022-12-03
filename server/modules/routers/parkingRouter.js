"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const parking_dao = require("../dao/parkingdao");
const {check, validationResult} = require("express-validator");

const router = express.Router();

const isLocalGuide = (req, res, next) => {
	if(req.isAuthenticated()) {
        if(req.user.role === 'localGuide')
            return next();
	}
	return res.status(401).json({error: 'Not authorized'});
}

const isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
	    return next();
	}
	return res.status(401).json({error: 'Not authorized'});
}

//PARKING_LOT TABLE

router.get("/api/parking", isLoggedIn, async (req, res) => {

    try {
        const parks = await parking_dao.getParks();
        return res.status(200).json(parks);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});

router.get("/api/parking/:id", isLoggedIn, async (req, res) => {
    try {
        const id = req.params.id;
        const park = await parking_dao.getParkById(id);
        res.status(200).json(park);
    } catch (err) {
        res.status(500).end();
    }
});

router.post('/api/parking', isLocalGuide, 
[/*check('guarded').isNumeric(),
    check('parking_spaces').isNumeric()*/]
, async (req, res) => {

    try {
        const parkingPointID = await hike_dao.postParkPoint(req.body.parkingPoint);
        if(parkingPointID){
          await parking_dao.createParking(req.body.name, req.body.guarded, req.body.parking_spaces, req.body.price_per_hour, req.body.disabled_parkings, req.body.timetable, parkingPointID);
        }
       
        return res.status(201).json();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Generic error` }).end();
    }


});

// hiking delete
router.delete('/api/parking/delete', isLocalGuide, async (req, res) => {
    try {
        await parking_dao.deleteParks();
        return res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});


module.exports = router;