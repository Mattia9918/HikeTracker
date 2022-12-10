const { convertBLOB2String, getGeoJSONbyContent } = require("../../manageGpx");
const haversine = require('haversine-distance');
const hike_dao = require('../dao/hikedao');

exports.checkRadiusDistance = async (hikeId, pointLatLng, maxRadius) => {
    const gpx = await hike_dao.getFileContentById(hikeId);

    // Check if hut within (maxRadius) km from any of the hike track points
    const blob = convertBLOB2String(gpx.gpxfile);
    const json = getGeoJSONbyContent(blob);
    const coordinates = json.features[0].geometry.coordinates;
    for (let coordinate of coordinates) {
        let pointA = { latitude: coordinate[1], longitude: coordinate[0] };
        let pointB = { latitude: pointLatLng.latitude, longitude: pointLatLng.longitude};
        if ((haversine(pointA, pointB)/1000) < maxRadius) {
            return true
        }
    };
    return false;
}
