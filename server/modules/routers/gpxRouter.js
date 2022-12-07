"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const point = require("../dao/point");
const manageFile = require("../../manageGpx");
const {resolve} = require("path");
const fileUpload = require('express-fileupload');
const checkAuth = require("../../authMiddleware");

const router = express.Router();
router.use(fileUpload());

router.post('/upload', checkAuth.isLocalGuide, async (req, res) => {

    if (req.files === undefined) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;
    let random = String(Math.floor(Math.random() * 1000)) + '.gpx' //per randomizzare il fileName ed evitare le collisioni}`
    await file.mv(`../client/public/uploads/${random}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        } else {
            const info = hike_dao.getGpxInfo(`../client/public/uploads/${random}`);
            res.json({
                fileName: random,
                filePath: `/uploads/${random}`,
                startPointLong: info.startingPoint.longitude,
                startPointLat: info.startingPoint.latitude,
                endingPointLong: info.endingPoint.longitude,
                endingPointLat: info.endingPoint.latitude,
                totalDistance: Math.round(info.totalDistance * 100) / 100,
                totalAscent: Math.round(info.totalAscent * 100 / 100),
                difficulty: info.difficulty
            });
        }

    });
});

//POST GPX AS BLOB
router.post('/api/gpx', checkAuth.isLocalGuide, async (req, res) => {

    try {

        const path = req.body.path;
        const bin = manageFile.castFileToBinary(resolve(`../client/public${path}`));
        await hike_dao.saveFile(bin);
        return res.status(201).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Generic error` }).end();
    }
})

//GET BLOB FROM GPX TABLE AND CONVERT BLOB TO GEOJSON
router.get("/api/gpx/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const bin = await hike_dao.getFileContentById(id);
        if(bin!==undefined)
        {
            const content = manageFile.convertBLOB2String(bin.gpxfile);
            const json = manageFile.getGeoJSONbyContent(content);
            res.status(200).json(json);
        }
        else 
            res.status(404).json({err:"Not Found"}); 

    } catch (err) {
        res.status(500).end();
    }
});


router.get("/api/point/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const coord = await point.getPointByHikeId(id);
        if(coord)
            res.status(200).json(coord);
        else 
            res.status(404).json({err:"Not Found"}); 

    } catch (err) {
        res.status(500).end();
    }
});

module.exports = router;
