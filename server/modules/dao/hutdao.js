"use strict";


/* Data Access Object (DAO) module for accessing hike table */

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
	if (err) throw err;
});



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