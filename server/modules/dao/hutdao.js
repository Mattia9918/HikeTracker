"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});


// TODO: aggiungere inserimento punto
exports.postHut = (name, address, phone_number, email,
                    website, description, province,
                    altitude, languages, bike_friendly,
                    reachability, disabled_services, rooms, bathrooms,beds, restaurant_services) => {

                        

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO hut(name, address, phone_number, email, web_site,
            description, province, altitude, languages, bike_friendly,
            reachability, disabled_services, rooms,
            bathrooms,beds, restaurant_service) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
		db.run(sql, [name, address, phone_number, email, website,
                    description, province, altitude, languages, bike_friendly,
                    reachability, disabled_services, rooms,
                    bathrooms,beds, restaurant_services], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
}

exports.getHuts = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
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

exports.getHutByCity = (city) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE P.city = ? AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE P.province = ? AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE altitude BETWEEN ? AND ? AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE restaurant_service = 1 AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE disabled_services = 1 AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE bike_friendly = 1 AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE beds > 0 AND H.point_id = P.id"

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
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE H.reachability = ? AND H.point_id = P.id"

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
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {Promise<unknown>}
 */
exports.getHutByArea = (lat1, lon1, lat2, lon2) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT name, address, phone_number, email, web_site, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE (latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?) AND H.point_id = P.id"

		db.all(sql, [lat1, lat2, lon1, lon2], (err, rows) => {
			if (err)
				reject(err);
			else {
				resolve(rows);
			}
		});
	});
};