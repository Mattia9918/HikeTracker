"use strict";

const express = require("express");
const hut_dao = require("../dao/hutdao");
const hike_dao = require("../dao/hikedao"); 
const {check, validationResult} = require("express-validator");

const router = express.Router();


router.post('/api/hut',
    []
    , async (req, res) => {

        
        console.log(req.body); 

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {

            const hutID = await hut_dao.postHut(req.body.name, req.body.address, req.body.phone_number, req.body.email,
                req.body.website, req.body.description, req.body.province, req.body.altitude, req.body.languages,
                req.body.bike_friendly, req.body.reachability, req.body.disabled_services, req.body.rooms, req.body.bathrooms,
                req.body.beds, req.body.restaurant_services ); 

            //await hike_dao.postPoint(); 

            return res.status(201).json({ "id": hutID });
            
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: `Generic error` }).end();
        }


    })


module.exports = router; 