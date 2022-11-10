"use strict";

const e = require("express");
/* Data Access Object (DAO) module for accessing db */

const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");
// const { ServiceType } = require('./Classes/ServiceType');

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});

/** USER **/

exports.insertUser = (email, hash, salt, role, name, surname) => {
	return new Promise((resolve, reject) => {
		const sql =
			"INSERT INTO user(email, hash, role, isActive, salt, name, surname) VALUES(?, ?, ?, 0, ?, ?, ?)";
		db.run(sql, [email, hash, role, salt, name, surname], function(err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this);
		})
	})
}

exports.insertActivation = (email, code) => {
	return new Promise((resolve, reject) => {
		const sql =
			"INSERT INTO activation(email, code) VALUES(?, ?)";
		db.run(sql, [email, code], function(err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(code);
		})
	})
}

exports.getActivationByCode = (code) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM activation WHERE code = ?"
		db.get(sql, [code], function(err, row) {
			if(err) {
				reject(err);
			}
			else {
				resolve(row);
			}
		})
	})
}

exports.getUserById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM user WHERE id = ?"
		db.get(sql, [id], function(err, row) {
			if(err) {
				reject(err);
			}
			else if (row === undefined) {
				resolve({error: 'User not found.'});
			}
			else {
				resolve(row);
			}
		})
	})
}

exports.getUserByEmail = (email) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM user WHERE email = ?"
		db.get(sql, [email], function(err, row) {
			if(err) {
				reject(err);
			}
			else {
				resolve(row);
			}
		})
	})
}

exports.getUserByCredentials = (email, password) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM user WHERE email = ?"
		db.get(sql, [email], function(err, row) {
			if(err) {
				reject(err);
			}
			else if (row === undefined) {
				console.log("User not found")
				resolve(false); // user not found
			}
			else {
				bcrypt.compare(password, row.hash).then(result => {
					if (result) // password matches
						resolve(row);
					else
					{   console.log("Password not matching")
						resolve(false); // password not matching
					}
				})
			}
		})
	})
}

exports.activateUser = (email) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE user SET isActive = 1 WHERE email = ?"
		db.run(sql, [email], function(err) {
			if(err) {
				reject(err);
			}
			else {
				resolve(this);
			}
		})
	})
}

exports.deleteActivation = (email) => {
	return new Promise((resolve, reject) => {
		const sql = "DELETE FROM activation WHERE email = ?"
		db.run(sql, [email], function(err) {
			if(err) {
				reject(err);
			} else {
				resolve(this.changes)
			}
		})
	})
}


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
