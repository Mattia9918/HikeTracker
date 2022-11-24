"use strict";

const express = require("express");
const hike_dao = require("../dao/hikedao");
const manageFile = require("../../manageGpx");
const {resolve} = require("path");

const router = express.Router();

router.post('/upload', async (req, res) => {
    if (req.files === null) {
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
                startPointLong: info.coordinates[0][0][0],
                startPointLat: info.coordinates[0][0][1],
                endingPointLong: info.coordinates[0][info.coordinates[0].length - 1][0],
                endingPointLat: info.coordinates[0][info.coordinates[0].length - 1][1],
                totalDistance: Math.round(info.totalDistance * 100) / 100,
                totalAscent: Math.round(info.totalAscent * 100 / 100),
                difficulty: info.difficulty


            });
        }

    });
});

//POST GPX AS BLOB
router.post('/api/gpx', async (req, res) => {

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
        const content = manageFile.convertBLOB2String(bin.gpxfile);
        const json = manageFile.getGeoJSONbyContent(content);
        res.status(200).json(json);
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

module.exports = router;