"use strict";


/* Data Access Object (DAO) module for accessing point table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});


exports.getPointByHikeId = (id) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT latitude,longitude,H.type FROM hike_point H,point P WHERE H.hikeID=? AND H.pointID=P.id "
		db.all(sql, [id], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};

exports.getPointById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT latitude, longitude, type FROM point WHERE id=?"
		db.get(sql, [id], (err, row) => {
			if(err) reject(err);
			else resolve(row);
		});
	})
}

exports.getHutMap = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT latitude,longitude FROM point P WHERE type='hut'"
			db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};

exports.getParkingMap = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT latitude,longitude FROM point P WHERE type='parking'"
			db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};