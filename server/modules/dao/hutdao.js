"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});

exports.postHut = (name, address, phone_number, email,
                    website, description,
                    altitude, languages, bike_friendly,
                    reachability, disabled_services, rooms, bathrooms,beds, restaurant_services, point_id) => {

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO hut(name, address, phone_number, email, web_site,
            description, altitude, languages, bike_friendly,
            reachability, disabled_services, rooms,
            bathrooms,beds, restaurant_service, point_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
		db.run(sql, [name, address, phone_number, email, website,
                    description, altitude, languages, bike_friendly,
                    reachability, disabled_services, rooms,
                    bathrooms,beds, restaurant_services, point_id], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
}


exports.deleteAllHuts = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"DELETE FROM hut";
		db.run(sql, [], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});

		const sql2 =
			"UPDATE sqlite_sequence SET seq=0 WHERE name='hut'";
		db.run(sql2, [], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});

	})
};

exports.getHuts = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE H.point_id = P.id ORDER BY H.id DESC"

			db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutById = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service, point_id " +
			"FROM hut H, point P WHERE H.id = ? AND H.point_id = P.id"

		db.get(sql, [id], (err, row) => {
			if (err)
				reject(err);
			else {
				resolve(row);
			}
		});
	});
};

exports.getHutsLinkedHike = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P, hike_point HP WHERE  H.point_id = HP.pointID "

			db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutLinkedToHikeById = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id AS HutID, HP.HikeID AS HikeID, P.id AS PointID, H.name, H.address,  HP.type, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P, hike_point HP WHERE H.id = ? AND H.point_id = P.id AND HP.pointID = H.point_id " 

		db.get(sql, [id], (err, row) => {
			if (err)
				reject(err);
			else {
				resolve(row);
			}
		});
	});
};

exports.getHutByCity = (city) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE P.city = ? AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [city], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutByProvince = (province) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE P.province = ? AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [province], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutByAltitude = (altitude1, altitude2) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE altitude BETWEEN ? AND ? AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [altitude1, altitude2], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutWithRestaurant = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE restaurant_service = 1 AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutWithDisabledServices = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE disabled_services = 1 AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutBikeFriendly = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE bike_friendly = 1 AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutWithBeds = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE beds > 0 AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

exports.getHutByReachability = (reachability) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE H.reachability = ? AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [reachability], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

/**
 * Gets huts that are in a rectangular area with diagonal from bottom-left to upper right
 */
exports.getHutByArea = (northEastPoint, southWestPoint) => {
	return new Promise((resolve, reject) => {
		const neCoordinates = northEastPoint.split(',');
		const swCoordinates = southWestPoint.split(',');
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?) AND H.point_id = P.id ORDER BY H.id DESC"

		db.all(sql, [Number(swCoordinates[0]), Number(neCoordinates[0]), Number(swCoordinates[1]), Number(neCoordinates[1])], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};

/* Gets all the cities in which there's a hut */
exports.getHutCities = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT DISTINCT P.city FROM hut H, point P WHERE H.point_id = P.id';
		db.all(sql, [], function (err, rows) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				//console.log(rows);
				resolve(rows)
			}
		});
	})
};

/* Gets all the provinces in which there's a hut */
exports.getHutProvinces = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT DISTINCT P.province FROM hut H, point P WHERE H.point_id = P.id';
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