"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const parking_dao = require("../dao/parkingdao");
const {check, validationResult} = require("express-validator");
const checkAuth = require("../../authMiddleware");
const functions = require("../functions/functions");

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
    check('parking_spaces').isInt(),
    check('name').notEmpty(),
    check('price_per_hour').isNumeric(),
    check('disabled_parkings').isNumeric(),
    check('timetable').notEmpty(),
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


/* Gets all parking in 5km from a specific hike*/
router.get("/api/parksDistantFromHike/:hikeId", async (req, res) => {
	try {
	
		//join with point and hut
		//get array of huts (hutId,name,pointId,latitude,longitude)
		const p = await parking_dao.getParks();

		let parks = p.map(park=> {
			return {
			parkId:park.parkID,
			name:park.name,
			pointId:park.point_id,
			latitude:park.latitude,
			longitude:park.longitude,
            city:park.city,
			province:park.province
			}
		});

		//get only huts distant 5 km from specific hike
		const filteredParks = await functions.getItemDistantFromHike(req.params.hikeId,parks,5);
		
		//hikeId not valid => hike not defined in gpx table
		if(filteredParks.length===1 && filteredParks[0].err!==undefined)	
			res.status(404).json(filteredParks[0].err);
		
		else 
			res.status(200).json(filteredParks);
		 

		
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});


module.exports = router;