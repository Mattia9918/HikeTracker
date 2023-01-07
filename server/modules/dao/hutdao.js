"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});

exports.postHut = (hut, point_id) => {

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO hut(name, address, phone_number, email, web_site,
            description, altitude, languages, bike_friendly,
            reachability, disabled_services, rooms,
            bathrooms,beds, restaurant_service, point_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
		db.run(sql, 
			[
				hut.name,
				hut.address,
				hut.phone_number,
				hut.email,
				hut.website,
				hut.description,
				hut.altitude,
				hut.languages,
				hut.bike_friendly,
				hut.reachability,
				hut.disabled_services,
				hut.rooms,
                hut.bathrooms,
				hut.beds,
				hut.restaurant_service, 
				point_id
			], function (err) {
			if (err) reject(err);
			else resolve(this.lastID);
		});
	});
}

exports.insertHutImg = (id, imgPath) => {

	return new Promise((resolve, reject) => {
		const sql = `UPDATE hut SET imgPath = ? WHERE id = ?`;
		db.run(sql, [imgPath, id], function (err) {
			if (err) reject(err);
			else resolve();
		});
	});
}


exports.deleteAllHuts = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"DELETE FROM hut";
		db.run(sql, [], function (err) {
			if (err) reject(err);
			else resolve();
		});

		const sql2 =
			"UPDATE sqlite_sequence SET seq=0 WHERE name='hut'";
		db.run(sql2, [], function (err) {
			if (err) reject(err);
			else resolve();
		});

	})
};

exports.deleteHikeLinkedHut= () => {
	return new Promise((resolve, reject) => {
		const sql =
			"DELETE FROM  hike_point  WHERE type='hut'  ";
		db.run(sql, [], function (err) {
			if (err) reject(err);
			else resolve();
		});
	})
};

exports.getHuts = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, imgPath, H.description, P.id AS point_id, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P WHERE H.point_id = P.id ORDER BY H.id DESC"

			db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};

exports.getHutById = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, imgPath, H.description, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service, point_id " +
			"FROM hut H, point P WHERE H.id = ? AND H.point_id = P.id"

		db.get(sql, [id], (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
};

exports.getHutsLinkedHike = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT H.id, name, address, phone_number, email, web_site, imgPath, H.description, P.latitude, P.longitude, P.city, P.province,  point_id, altitude, languages, " +
			"bike_friendly, reachability, disabled_services, rooms, bathrooms, beds, restaurant_service " +
			"FROM hut H, point P, hike_point HP WHERE HP.type='hut' AND H.point_id = HP.pointID  AND H.point_id = P.id"

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
			"SELECT H.id AS HutID, HP.HikeID AS HikeID, P.id AS PointID, H.name, H.web_site, H.address,  HP.type, P.latitude, P.longitude, P.city, P.province, altitude, languages, " +
			"bike_friendly, reachability, description, email, phone_number, disabled_services, rooms, bathrooms, beds, restaurant_service, imgPath " +
			"FROM hut H, point P, hike_point HP WHERE H.id = ? AND HP.type='hut' AND H.point_id = P.id AND HP.pointID = H.point_id " 

		db.get(sql, [id], (err, row) => {
			if (err)
				reject(err);
			else {
				resolve(row);
			}
		});
	});
};

/* Gets all the cities in which there's a hut */
exports.getHutCities = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT DISTINCT P.city FROM hut H, point P WHERE H.point_id = P.id';
		db.all(sql, [], function (err, rows) {
			if (err) reject(err);
			else {
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
			if (err) reject(err);
			else {
				resolve(rows)
			}
		});
	})
};