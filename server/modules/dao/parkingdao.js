"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});


//PARKING TABLE 

exports.createParking= (name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable) => {

	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO parking_lot(name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable) VALUES(?, ?, ?, ?, ?, ?)`;
		db.run(sql, [name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable], function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve(this.lastID);
		});
	});
};
