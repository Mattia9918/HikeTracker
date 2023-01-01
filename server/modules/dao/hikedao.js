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
			"SELECT H.id AS hikeID, title, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, imgPath, latitude, longitude, P.type AS pointType, city, province, HP.type AS HPtype, U.username FROM hike H, point P, hike_point HP, user U WHERE H.id = HP.hikeID AND P.id = HP.pointID AND H.localguideID = U.id ORDER BY H.id DESC";
		db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else {
				const hikes = rowJsonMapping(rows);
				resolve(hikes);
			}
		});
	});
};

exports.getHikeById = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT * FROM hike WHERE id = ?"

		db.get(sql, [id], (err, row) => {
			if (err) reject(err);
			else {
				resolve(row);
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
		imgPath,
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
					imgPath: imgPath,
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
			imgPath = rows[r].imgPath;
			localguideUsername = rows[r].username;
			interestingPoints = [];
		}
		firstRow = false;
		point = {
			latitude: rows[r].latitude,
			longitude: rows[r].longitude,
			type: rows[r].pointType,
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
				throw new Error("error type point");
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
		imgPath: imgPath,
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
		const dS = distanceScore(totalDistance);
		const aS = ascentScore(totalAscent);
		const difficulty = estimateDifficulty(dS, aS);
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

function distanceScore(totalDistance){

	if (totalDistance < 3) {
		return 1;
	}
	else if (totalDistance >= 3 && totalDistance < 7) {
		return 2;
	}
	else if (totalDistance >= 7 && totalDistance < 12) {
		return 3;
	} 
	else {
		return 4;
	}
}

function ascentScore(totalAscent){
	if (totalAscent < 0 && totalAscent > -100) {
		return 1;
	}
	else if (totalAscent <= -100 && totalAscent > -300) {
		return 2;
	}
	else if (totalAscent <= -300) {
		return  3;
	}
	else if (totalAscent >= 0 && totalAscent < 100) {
		return 1;
	}
	else if (totalAscent >= 100 && totalAscent < 300) {
		return 2;
	}
	else if (totalAscent >= 300 && totalAscent < 600) {
		return 3;
	}
	else {
		return 4;
	}
}

function estimateDifficulty(distanceScore, ascentScore) {

	const totalScore = distanceScore + ascentScore;
	
	if (totalScore <= 2) {
		return 'Easy'
	} else if (totalScore >= 3 && totalScore <= 5) {
		return 'Average'
	} else {
		return 'Difficult'
	}
}

exports.createHiking = (title, length, description, difficulty, estimatedTime, ascent, localguideID) => {

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO hike(title, length, description, difficulty, estimatedTime, ascent, localguideID) VALUES(?, ?, ?, ?, ?, ?, ?)`;
		db.run(sql, [title, length, description, difficulty, estimatedTime, ascent, localguideID], function (err) {
			if (err) reject(err);
			
			else resolve(this.lastID);
		});
	});
}

exports.insertImg = (id, imgPath) => {

	return new Promise((resolve, reject) => {
		const sql = `UPDATE hike SET imgPath = ? WHERE id = ?`;
		db.run(sql, [imgPath, id], function (err) {
			if (err) reject(err);
			else resolve();
		});
	});
}


exports.deleteHikes = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DELETE FROM hike';
		const sql2 = "UPDATE sqlite_sequence SET seq=0 WHERE name='hike'"
		db.run(sql1, [], function (err) {
			if (err) reject(err);
		
			else {
				db.run(sql2, [], function (err) {
					if (err) reject(err)
					
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
		const sql1 = 'DELETE FROM point';
		const sql2 = "UPDATE sqlite_sequence SET seq=0 WHERE name='point'"
		db.run(sql1, [], function (err) {
			if (err) reject(err);
			
			else {
				db.run(sql2, [], function (err) {
					if (err) reject(err)
					else {
						resolve()
					}
				});
			}
		})
	})

};

exports.postPointHut = (point) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO point(latitude, longitude, type, city, province) VALUES (?, ?, ?, ?, ?)';
		db.run(sql, [
			point.latitude,
			point.longitude,
			"hut",
			point.city,
			point.province
		], function (err) {
			if (err) reject(err);
			
			else {
				resolve(this.lastID)
			}
		});
	})
};

exports.postPoint = (body) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO point(id, latitude, longitude, type, city, province) VALUES (?, ?, ?, ?, ?, ?)';
		db.run(sql, [undefined, body.latitude, body.longitude, "point", body.locality, body.localityInfo.administrative[2].name], function (err) {
			if (err) reject(err);
			else {
				resolve(this.lastID)
			}
		});
	})
};

exports.postParkPoint = (body) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO point(id, latitude, longitude, type, city, province) VALUES (?, ?, ?, ?, ?, ?)';
		db.run(sql, [undefined, body.latitude, body.longitude, body.type, body.city, body.province], function (err) {
			if (err) reject(err);
			else {
				resolve(this.lastID)
			}
		});
	})
};
		

exports.deleteHike_Point = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DELETE FROM hike_point';
		db.run(sql1, [], function (err) {
			if (err) reject(err);
			else {
				resolve(this.changes);
			}
		})
	})

};

exports.postHike_Point = (hikeID, type, pointID) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO hike_point(hikeID, type, pointID) VALUES (?, ?, ?)';
		db.run(sql, [hikeID, type, pointID], function (err) {
			if (err) reject(err);
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
			if (err) reject(err);
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
			if (err) reject(err);
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
			if (err) reject(err);
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
			if (err) reject(err);
			else {
				resolve(rows)
			}
		});
	})
};


exports.deleteGpx = () => {
	return new Promise((resolve, reject) => {
		const sql1 = 'DELETE FROM gpx';
		db.run(sql1, [], function (err) {
			if (err) reject(err);
			else {
				resolve()
			}
		})
	})

};

exports.updateHikePoint = (hikeID, pointID, type) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE hike_point SET pointID = ? WHERE hikeID = ? AND type = ?"
		db.run(sql, [pointID, hikeID, type], function (err) {
			if (err) reject(err)
			else {
				resolve(this.lastID)
			}
		})
	})
}

/** TABLE hike_user */

exports.startHikeByUser = (userID, hikeID, time) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO hike_user(userID, hikeID, start_time) VALUES (?, ?, ?)";
		db.run(sql, [userID, hikeID,  time], function(err) {
			if(err) reject(err)
			else {
				resolve(this.lastID)
			}
		})
	})
}

exports.endHikeByUser = (id, time) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE hike_user SET end_time = ? WHERE id = ?"
		db.run(sql, [time, id], function(err) {
			if(err) reject(err)
			else {
				resolve(this.lastID)
			}
		})
	})
}

exports.getAllHikesRecordedByUser = (userID) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT id, hikeID, start_time, end_time FROM hike_user WHERE userID = ?"
		db.all(sql, [userID], function (err, rows) {
			if(err) reject(err)
			else {
				resolve(rows)
			}
		})
	})
}

exports.getOngoingHikeRecordedByUser = (userID) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT id, hikeID, start_time FROM hike_user WHERE userID = ? AND end_time IS NULL"
		db.get(sql, [userID], function (err, row) {
			if(err) reject(err)
			else {
				resolve(row)
			}
		})
	})
}

exports.getHikeRecordedById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT id, hikeID, start_time, end_time FROM hike_user WHERE id = ?"
		db.get(sql, [id], function (err, row) {
			if(err) reject(err)
			else {
				resolve(row)
			}
		})
	})
}

exports.getHikeStatsById = (userID, hikeID) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT id, hikeID, start_time, end_time FROM hike_user WHERE userID = ? AND hikeID = ?"
		db.all(sql, [userID, hikeID], function (err, row) {
			if(err) reject(err)
			else {
				resolve(row)
			}
		})
	})
}


exports.getCompletedHikesOfHiker = (userID) => {
	return new Promise((resolve, reject) => {
		const sql =
		"SELECT DISTINCT HU.userID, HU.id, P.id AS pointID, HU.hikeID, title, HU.start_time, HU.end_time, length AS len, H.description AS hikeDescription, difficulty, estimatedTime, ascent, localguideID, imgPath, latitude, longitude, P.type AS pointType, city, province, HP.type AS HPtype, U.username  FROM hike_user HU, hike H, user U, point P, hike_point HP INNER JOIN hike_user ON  HU.hikeID= H.id AND HU.hikeID=HP.hikeID AND H.id=HP.hikeID AND U.id = HU.userID  AND P.id = HP.pointID WHERE HU.end_time IS NOT NULL AND  HU.userID = ?  ORDER BY HU.id";
		db.all(sql, [userID], (err, rows) => {
			if (err) reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.deleteHikeUser = () => {
	return new Promise((resolve, reject) => {
		const sql1 =
			"DELETE FROM hike_user" ;
		const sql2 = "UPDATE sqlite_sequence SET seq=0 WHERE name='hike_user'"
		db.run(sql1, [], function (err) {
			if (err) reject(err);
			
			else {
				db.run(sql2, [], function (err) {
					if (err) reject(err)
					else {
						resolve()
					}
				});
			}
		})
	});
};