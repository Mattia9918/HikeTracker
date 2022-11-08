"use strict";

const e = require("express");
/* Data Access Object (DAO) module for accessing db */

const sqlite = require("sqlite3");
// const { ServiceType } = require('./Classes/ServiceType');

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});

/** HIKES **/

// idea: 1 query with join, save the values in common, populate starting and ending and push to add pointsofInterest, when finds a different id pushes in the hike vector and take the new common values
exports.getHikes = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID";
		db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else {
				let id,
					title,
					len,
					description,
					difficulty,
					estimatedTime,
					ascent,
					localguideID,
					startingPoint,
					endingPoint,
					point;
				let firstRow = true;
				let interestingPoints = [];
				const hikes = [];
				console.log(rows);
				for (let r in rows) {
					if (rows[r].hikeID !== id) {
						if (!firstRow) {
							hikes.push({
								id: id,
								title: title,
								length: len,
								description: description,
								difficulty: difficulty,
								estimatedTime: estimatedTime,
								ascent: ascent,
								localguideID: localguideID,
								startingPoint: startingPoint,
								endingPoint: endingPoint,
								pointsOfInterest: interestingPoints,
							});
						}
						id = rows[r].hikeID;
						title = rows[r].title;
						len = rows[r].len;
						description = rows[r].hikeDescription;
						difficulty = rows[r].difficulty;
						estimatedTime = rows[r].estimatedTime;
						ascent = rows[r].ascent;
						localguideID = rows[r].localguideID;
						interestingPoints = [];
					}
					firstRow = false;
					point = {
						latitude: rows[r].latitude,
						longitude: rows[r].longitude,
						type: rows[r].pointType,
						description: rows[r].pointDescription,
						city: rows[r].city,
						province: rows[r].province,
					};
					switch (rows[r].HPtype) {
						case "start":
							startingPoint = point;
							break;
						case "arrive":
							endingPoint = point;
							break;
						case "interest":
							interestingPoints.push(point);
							break;
						default:
							console.log("error type point");
							break;
					}
				}
				hikes.push({
					id: id,
					title: title,
					length: len,
					description: description,
					difficulty: difficulty,
					estimatedTime: estimatedTime,
					ascent: ascent,
					localguideID: localguideID,
					startingPoint: startingPoint,
					endingPoint: endingPoint,
					pointsOfInterest: interestingPoints,
				});
				resolve(hikes);
			}
		});
	});
};

exports.getHikeById = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.id = ?";
		db.all(sql, [id], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = [];
				let point;
				let interestingPoints = [];
				let startingPoint, endingPoint;
				for (let r in rows) {
					point = {
						latitude: rows[r].latitude,
						longitude: rows[r].longitude,
						type: rows[r].pointType,
						description: rows[r].pointDescription,
						city: rows[r].city,
						province: rows[r].province,
					};
					switch (rows[r].HPtype) {
						case "start":
							startingPoint = point;
							break;
						case "arrive":
							endingPoint = point;
							break;
						case "interest":
							interestingPoints.push(point);
							break;
						default:
							console.log("error type point");
							break;
					}
				}
				hikes.push({
					id: rows[0].hikeID,
					title: rows[0].title,
					len: rows[0].len,
					description: rows[0].hikeDescription,
					difficulty: rows[0].difficulty,
					estimatedTime: rows[0].estimatedTime,
					ascent: rows[0].ascent,
					localguideID: rows[0].localguideID,
					startingPoint: startingPoint,
					endingPoint: endingPoint,
					pointsOfInterest: interestingPoints,
				});
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByAscent = (ascen) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.ascent = ?";
		db.all(sql, [ascen], (err, rows) => {
			if (err) reject(err);
			else {
				let id,
					title,
					len,
					description,
					difficulty,
					estimatedTime,
					ascent,
					localguideID,
					startingPoint,
					endingPoint,
					point;
				let firstRow = true;
				let interestingPoints = [];
				const hikes = [];
				console.log(rows);
				for (let r in rows) {
					if (rows[r].hikeID !== id) {
						if (!firstRow) {
							hikes.push({
								id: id,
								title: title,
								length: len,
								description: description,
								difficulty: difficulty,
								estimatedTime: estimatedTime,
								ascent: ascent,
								localguideID: localguideID,
								startingPoint: startingPoint,
								endingPoint: endingPoint,
								pointsOfInterest: interestingPoints,
							});
						}
						id = rows[r].hikeID;
						title = rows[r].title;
						len = rows[r].len;
						description = rows[r].hikeDescription;
						difficulty = rows[r].difficulty;
						estimatedTime = rows[r].estimatedTime;
						ascent = rows[r].ascent;
						localguideID = rows[r].localguideID;
						interestingPoints = [];
					}
					firstRow = false;
					point = {
						latitude: rows[r].latitude,
						longitude: rows[r].longitude,
						type: rows[r].pointType,
						description: rows[r].pointDescription,
						city: rows[r].city,
						province: rows[r].province,
					};
					switch (rows[r].HPtype) {
						case "start":
							startingPoint = point;
							break;
						case "arrive":
							endingPoint = point;
							break;
						case "interest":
							interestingPoints.push(point);
							break;
						default:
							console.log("error type point");
							break;
					}
				}
				hikes.push({
					id: id,
					title: title,
					length: len,
					description: description,
					difficulty: difficulty,
					estimatedTime: estimatedTime,
					ascent: ascent,
					localguideID: localguideID,
					startingPoint: startingPoint,
					endingPoint: endingPoint,
					pointsOfInterest: interestingPoints,
				});
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByAscent = (diff) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.difficulty = ?";
		db.all(sql, [diff], (err, rows) => {
			if (err) reject(err);
			else {
				let id,
					title,
					len,
					description,
					difficulty,
					estimatedTime,
					ascent,
					localguideID,
					startingPoint,
					endingPoint,
					point;
				let firstRow = true;
				let interestingPoints = [];
				const hikes = [];
				console.log(rows);
				for (let r in rows) {
					if (rows[r].hikeID !== id) {
						if (!firstRow) {
							hikes.push({
								id: id,
								title: title,
								length: len,
								description: description,
								difficulty: difficulty,
								estimatedTime: estimatedTime,
								ascent: ascent,
								localguideID: localguideID,
								startingPoint: startingPoint,
								endingPoint: endingPoint,
								pointsOfInterest: interestingPoints,
							});
						}
						id = rows[r].hikeID;
						title = rows[r].title;
						len = rows[r].len;
						description = rows[r].hikeDescription;
						difficulty = rows[r].difficulty;
						estimatedTime = rows[r].estimatedTime;
						ascent = rows[r].ascent;
						localguideID = rows[r].localguideID;
						interestingPoints = [];
					}
					firstRow = false;
					point = {
						latitude: rows[r].latitude,
						longitude: rows[r].longitude,
						type: rows[r].pointType,
						description: rows[r].pointDescription,
						city: rows[r].city,
						province: rows[r].province,
					};
					switch (rows[r].HPtype) {
						case "start":
							startingPoint = point;
							break;
						case "arrive":
							endingPoint = point;
							break;
						case "interest":
							interestingPoints.push(point);
							break;
						default:
							console.log("error type point");
							break;
					}
				}
				hikes.push({
					id: id,
					title: title,
					length: len,
					description: description,
					difficulty: difficulty,
					estimatedTime: estimatedTime,
					ascent: ascent,
					localguideID: localguideID,
					startingPoint: startingPoint,
					endingPoint: endingPoint,
					pointsOfInterest: interestingPoints,
				});
				resolve(hikes);
			}
		});
	});
};
