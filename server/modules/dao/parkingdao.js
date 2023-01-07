"use strict";

/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});

//PARKING TABLE

// idea: 1 query with join, save the values in common, populate starting and ending and push to add pointsofInterest, when finds a different id pushes in the hike vector and take the new common values

// Get Parks
exports.getParks = () => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT P.id AS parkID, name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable, point_id,  latitude, longitude, PO.type, city, province FROM parking_lot P, point PO WHERE P.point_id = PO.id";
		db.all(sql, [], (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
};

// Get Park
exports.getParkById = (id) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT P.id AS parkID, name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable, point_id,  latitude, longitude, PO.type, city, province FROM parking_lot P, point PO WHERE parkID=? AND P.point_id = PO.id";
		db.get(sql, [id], (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
};

exports.getParkByName = (name) => {
	return new Promise((resolve, reject) => {
		const sql =
			"SELECT P.id AS parkID, name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable, point_id,  latitude, longitude, PO.type, city, province FROM parking_lot P, point PO WHERE name=? AND P.point_id = PO.id";
		db.get(sql, [name], (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
};
exports.createParking = (
	name,
	guarded,
	parking_spaces,
	price_per_hour,
	disabled_parkings,
	timetable,
	point_id
) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO parking_lot(name, guarded, parking_spaces, price_per_hour, disabled_parkings, timetable, point_id) VALUES(?, ?, ?, ?, ?, ?, ?)`;
		db.run(
			sql,
			[
				name,
				guarded,
				parking_spaces,
				price_per_hour,
				disabled_parkings,
				timetable,
				point_id,
			],
			function (err) {
				if (err) reject(err);
					
				else resolve(this.lastID);
			}
		);
	});
};

exports.deleteParks = () => {
	return new Promise((resolve, reject) => {
		const sql = "DELETE FROM parking_lot";
		db.run(sql, [], (err) => {
			if (err) reject(err);
			else {
				resolve(null);
			}
		});
	});
};
