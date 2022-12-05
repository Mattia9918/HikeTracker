"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});

/* To calculate the distance between coordinates */
const haversine = require('haversine-distance');

/** HIKES **/

// idea: 1 query with join, save the values in common, populate starting and ending and push to add pointsofInterest, when finds a different id pushes in the hike vector and take the new common values
exports.getHikes = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id ORDER BY H.id DESC";
		db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};



exports.getHikeByAscent = (ascent1, ascent2) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id AND H.ascent BETWEEN ? AND ? ORDER BY H.id DESC";
		db.all(sql, [ascent1, ascent2], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByDiffculty = (diff) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id AND H.difficulty = ? ORDER BY H.id DESC";
		db.all(sql, [diff], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByLength = (minLen, maxLen) => {
 

	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id AND H.length >= ? AND H.length <= ? ORDER BY H.id DESC";
		db.all(sql, [minLen, maxLen], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByExpectedTime = (minTime, maxTime) => {

	const start = parseFloat(minTime);
	const end = parseFloat(maxTime);
	
	// AND H.estimatedTime >= ? AND H.estimatedTime <= ? 
	
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id ORDER BY H.id DESC";
		
		db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else {

				let hikes = rowJsonMapping(rows);
				hikes = hikes.filter(h=>
				{
					const hikeTime = parseFloat(h.estimatedTime); 

					if (hikeTime>=start && hikeTime<=end)
					{
						//console.log(hikeTime);
						return h; 
						
					}
						
				}
				); 
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByProvince = (province) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id AND H.id IN (SELECT H.id FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID AND P.province = ? AND HP.type = 'start') ORDER BY H.id DESC"
		db.all(sql, [province], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};

exports.getHikeByCity = (city) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id AND H.id IN (SELECT H.id FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID AND P.city = ? AND HP.type = 'start') ORDER BY H.id DESC"
		db.all(sql, [city], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};

exports.getHikesByArea = (northEastPoint, southWestPoint) => {
	return new Promise((resolve, reject) => {
		const neCoordinates = northEastPoint.split(',');
		const swCoordinates = southWestPoint.split(',');
		const sql =
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, latitude, longitude, P.type AS pointType, P.description AS pointDescription, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id AND H.id IN (SELECT H.id FROM hike H, point P, hike_point HP WHERE H.id = HP.hikeID AND P.id = HP.pointID AND HP.type = 'start' AND P.latitude BETWEEN ? AND ? AND P.longitude BETWEEN ? AND ?) ORDER BY H.id DESC";
		db.all(sql, [Number(swCoordinates[0]), Number(neCoordinates[0]), Number(swCoordinates[1]), Number(neCoordinates[1])], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};
const rowJsonMapping = (rows) => {
	let id,
		title,
		len,
		description,
		difficulty,
		estimatedTime,
		ascent,
		localguideID,
		localguideUsername,
		startingPoint,
		endingPoint,
		point;
	let firstRow = true;
	let interestingPoints = [];
	const hikes = [];
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
					localguideUsername: localguideUsername,
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
			localguideUsername = rows[r].username;
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
			case "hut":
				interestingPoints.push(point);
				break;
			default:
				console.log("error type point");
				throw "error type point";
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
		localguideUsername: localguideUsername,
		startingPoint: startingPoint,
		endingPoint: endingPoint,
		pointsOfInterest: interestingPoints,
	});
	return hikes;
};


/*** HIKE TABLE ***/

const togeojson = require("@mapbox/togeojson"); //convert from xml->json
const DomParser = require("xmldom").DOMParser; // node doesn't have xml parsing or a dom.
const fs = require("fs"); //file system manager (readFile)

exports.getGpxInfo = (file) => {
	if (file) {
		const fileParsedFromDom = new DomParser().parseFromString(fs.readFileSync(file, "utf-8"));
		// Convert GPX to GeoJSON
		const converted = togeojson.gpx(fileParsedFromDom);
		const coordinates = converted.features[0].geometry.coordinates;
		const start = coordinates[0];
		const end = coordinates[coordinates.length-1];
		const startingPoint = {
			latitude: start[1],
			longitude: start[0]
		};
		const endingPoint = {
			latitude: end[1],
			longitude: end[0]
		}
		const {totalDistance, totalAscent} = calculateDistanceAndAscent(coordinates);
		const difficulty = estimateDifficulty(totalDistance, totalAscent);
		return {startingPoint: startingPoint, endingPoint: endingPoint, totalDistance: totalDistance, totalAscent: totalAscent, difficulty: difficulty};
	}
	return {};

}

function calculateDistanceAndAscent(coordinates) {
	let distance = 0;
	let ascent = 0;
	for (let i = 0; i < coordinates.length-1; i++) {
		let pointA = {latitude: coordinates[i][0], longitude: coordinates[i][1]}
		let pointB = {latitude: coordinates[i+1][0], longitude: coordinates[i+1][1]}
		let relativeAscent = coordinates[i+1][2] - coordinates[i][2]
		distance = distance + haversine(pointA, pointB)/1000; //in kilometers
		ascent = ascent + relativeAscent; //in meters
	}
	return {totalDistance: distance, totalAscent: ascent}
} 

function estimateDifficulty(totalDistance, totalAscent) {
	let difficultyScore = 0;

	if (totalDistance < 3) {
		difficultyScore += 1;
	}
	else if (totalDistance >= 3 && totalDistance < 7) {
		difficultyScore += 2;
	}
	else if (totalDistance >= 7 && totalDistance < 12) {
		difficultyScore += 3;
	} 
	else {
		difficultyScore += 4;
	}


	if (totalAscent < 0 && totalAscent > -100) {
		difficultyScore += 1;
	}
	else if (totalAscent <= -100 && totalAscent > -300) {
		difficultyScore += 2;
	}
	else if (totalAscent <= -300) {
		difficultyScore += 3;
	}
	else if (totalAscent >= 0 && totalAscent < 100) {
		difficultyScore += 1;
	}
	else if (totalAscent >= 100 && totalAscent < 300) {
		difficultyScore += 2;
	}
	else if (totalAscent >= 300 && totalAscent < 600) {
		difficultyScore += 3;
	}
	else {
		difficultyScore += 4;
	}
	
	if (difficultyScore <= 2) {
		return 'Easy'
	} else if (difficultyScore >= 3 && difficultyScore <= 5) {
		return 'Average'
	} else {
		return 'Difficult'
	}
}



// Get Hike desc
exports.getHikeDesc = (id) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT description FROM HIKE WHERE id=? ';
		db.get(sql, [id], (err, row) => {
			if (err)
				reject(err);
			else
				resolve(row);
		})
	})
}

exports.createHiking = (title, length, description, difficulty, estimatedTime, ascent, localguideID) => {

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO hike(title, length, description, difficulty, estimatedTime, ascent, localguideID) VALUES(?, ?, ?, ?, ?, ?, ?)`;
		db.run(sql, [title, length, description, difficulty, estimatedTime, ascent, localguideID], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
}




exports.deleteHikes = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DROP TABLE IF EXISTS hike';
		const sql2 = 'CREATE TABLE IF NOT EXISTS hike(id INTEGER, title text NOT NULL, length real NOT NULL, description text NOT NULL, difficulty text NOT NULL, estimatedTime text NOT NULL, ascent real NOT NULL, localguideID integer NOT NULL ,PRIMARY KEY(id) ) '
		db.run(sql1, [], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				db.run(sql2, [], function (err) {
					if (err) {
						console.log(err);
						reject(err)
					}
					else {
						resolve()
					}
				});
			}
		})
	})

};

exports.deletePoint = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DROP TABLE IF EXISTS point';
		const sql2 = 'CREATE TABLE IF NOT EXISTS point(id INTEGER, latitude real NOT NULL, longitude real NOT NULL, type text NOT NULL, description text NOT NULL, city text NOT NULL, province text NOT NULL, PRIMARY KEY(id) ) '
		db.run(sql1, [], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				db.run(sql2, [], function (err) {
					if (err) {
						console.log(err);
						reject(err)
					}
					else {
						resolve()
					}
				});
			}
		})
	})

};

exports.deletePointCCs = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DELETE FROM point';
		db.run(sql1, [], function (err) {
				db.run(sql1, [], function (err) {
					if (err) {
						console.log(err);
						reject(err)
					}
					else {
						resolve()
					}
				});
			
		})
	})
};

exports.postPointHut = (latitude, longitude, city, province) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO point(latitude, longitude, type, description, city, province) VALUES (?, ?, ?, ?, ?, ?)';
		db.run(sql, [latitude, longitude, "hut", "descrizione", city, province], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(this.lastID)
			}
		});
	})
};



exports.postPoint = (body) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO point(id, latitude, longitude, type, description, city, province) VALUES (?, ?, ?, ?, ?, ?, ?)';
		db.run(sql, [undefined, body.latitude, body.longitude, "hut", "da sostituire", body.locality, body.localityInfo.administrative[2].name], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(this.lastID)
			}
		});
	})
};

exports.postParkPoint = (body) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO point(id, latitude, longitude, type, description, city, province) VALUES (?, ?, ?, ?, ?, ?, ?)';
		db.run(sql, [undefined, body.latitude, body.longitude, body.type, body.description, body.city, body.province], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(this.lastID)
			}
		});
	})
};
		

exports.deleteHike_Point = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DROP TABLE IF EXISTS hike_point';
		const sql2 = 'CREATE TABLE IF NOT EXISTS hike_point(hikeID INTEGER, type text NOT NULL, pointID integer NOT NULL, PRIMARY KEY(hikeID, pointID)) '
		db.run(sql1, [], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				db.run(sql2, [], function (err) {
					if (err) {
						console.log(err);
						reject(err)
					}
					else {
						resolve()
					}
				});
			}
		})
	})

};

/*
exports.deleteHike_Point_Hut = () => {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM hike_point HP, hut H WHERE HP.pointID = H.point_id';
		db.run(sql, [], (err) => {
		if (err)
			reject(err);
		else {
			resolve(null);
		}
		});
	});
};
 */

/*
exports.deleteHike_Point_Hut_Id = (id) => {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM hike_point HP, hut H WHERE HP.pointID = H.point_id AND hikeID=?';
		db.run(sql, [id], (err) => {
		if (err)
			reject(err);
		else {
			resolve(null);
		}
		});
	});
};

 */

exports.postHike_Point = (hikeID, type, pointID) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO hike_point(hikeID, type, pointID) VALUES (?, ?, ?)';
		db.run(sql, [hikeID, type, pointID], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(this.lastID)
			}
		});
	})
};

exports.saveFile = (bin) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO gpx(gpxfile) VALUES (?)';
		db.run(sql, [bin], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve()
			}
		});
	})
};

exports.getFileContentById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT gpxfile FROM gpx WHERE hikeID = ? ';
		db.get(sql, [id], function (err, row) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(row)
			}
		});
	})
};

/* Gets all the cities in which there's an hike */
exports.getHikeCities = () => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT DISTINCT city FROM point WHERE id IN (SELECT pointID FROM hike_point WHERE type = 'start')";
		db.all(sql, [], function (err, rows) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(rows)
			}
		});
	})
};

/* Gets all the provinces in which there's an hike */
exports.getHikeProvinces = () => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT DISTINCT province FROM point WHERE id IN (SELECT pointID FROM hike_point WHERE type = 'start')";
		db.all(sql, [], function (err, rows) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				resolve(rows)
			}
		});
	})
};


exports.deleteGpx = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DROP TABLE IF EXISTS gpx';
		const sql2 = "CREATE TABLE IF NOT EXISTS gpx(hikeID INTEGER, gpxfile blob NOT NULL, PRIMARY KEY(hikeID))"
		db.run(sql1, [], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				db.run(sql2, [], function (err) {
					if (err) {
						console.log(err);
						reject(err)
					}
					else {
						resolve()
					}
				});
			}
		})
	})

};



