"use strict";

const express = require("express");
const hut_dao = require("../dao/hutdao");
const {check, validationResult} = require("express-validator");

const router = express.Router();

// TODO: aggiungere inserimento punto
router.post('/api/hut',
    []
    , async (req, res) => {

        if (req.user === undefined)
            return res.status(401).json({ error: 'not authenticated!' });

        if(req.user.role !== "localGuide")
            return res.status(401).json({ error: 'not authorized!' });

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

/** Get all huts **/
router.get("/api/huts", async (req, res) => {

    if (req.user === undefined)
        return res.status(401).json({ error: 'not authenticated!' });

    try {
        const huts = await hut_dao.getHuts();
        return res.status(200).json(huts);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

/** Get hut by id **/
router.get("/api/hut/:id", async (req, res) => {

    if (req.user === undefined)
        return res.status(401).json({ error: 'not authenticated!' });

    try {
        const id = req.params.id;
        const hut = await hut_dao.getHutById(id);
        if(hut === undefined) {
            return res.status(404).json({error: "Hut not found!"})
        }
        return res.status(200).json(hut);
    } catch (err) {
        return res.status(500).end();
    }
});

/** Get huts with filters **/
router.get(`/api/hut*`, async (req, res) => {

    if (req.user === undefined)
        return res.status(401).json({ error: 'not authenticated!' });

    try {
        let huts;
        const filter = req.query.filter;
        switch (filter) {
            case "none":
                huts = await hut_dao.getHuts();
                break;
            case "altitude":
                huts = await hut_dao.getHutByAltitude(req.query.value1, req.query.value2);
                break;
            case "restaurant_service":
                huts = await hut_dao.getHutWithRestaurant()
                break;
            case "disabled_services":
                huts = await hut_dao.getHutWithDisabledServices()
                break;
            case "bike_friendly":
                huts = await hut_dao.getHutBikeFriendly()
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
                huts = await hut_dao.getHutByArea(req.query.value1, req.query.value2, req.query.value3, req.query.value4);
                break;
            default:
                console.log("wrong filter error");
                return res.status(422).json({ error: `Validation of request body failed` }).end();
        }
        return res.status(200).json(huts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
});




module.exports = router; 