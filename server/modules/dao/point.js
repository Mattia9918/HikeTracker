"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});


exports.getPointByHikeId = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT latitude,longitude FROM hike_point H,point P WHERE H.hikeID=? AND H.pointID=P.id "
		db.all(sql, [id], (err, rows) => {
			if (err) reject(err);
			else {
				resolve(rows);
			}
		});
	});
};