"use strict";

/* Data Access Object (DAO) module for accessing user and activation table */

const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");

// open the database
const db = new sqlite.Database("hiketracker.db", (err) => {
    if (err) throw err;
});

/** USER AND ACTIVATION **/

exports.insertUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql =
            "INSERT INTO user(email, hash, role, username, isActive, salt, name, surname) VALUES(?, ?, ?, ?, 0, ?, ?, ?)";
        db.run(sql, 
            [
                user.email,
                user.hash, 
                user.role, 
                user.username, 
                user.salt, 
                user.name, 
                user.surname
            ], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

exports.insertActivation = (email, code) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO activation(email, code) VALUES(?, ?)";
        db.run(sql, [email, code], function (err) {
            if (err) reject(err);
            else resolve(code);
        });
    });
};

exports.getActivationByCode = (code) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM activation WHERE code = ?";
        db.get(sql, [code], function (err, row) {
            if (err) reject(err);
             else {
                resolve(row);
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE id = ?";
        db.get(sql, [id], function (err, row) {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "User not found." });
            } else {
                resolve(row);
            }
        });
    });
};

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE email = ?";
        db.get(sql, [email], function (err, row) {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

exports.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE username = ?";
        db.get(sql, [username], function (err, row) {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

exports.getUserByCredentials = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE email = ?";
        db.get(sql, [email], function (err, row) {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                console.log("User not found");
                resolve(false); // user not found
            } else {
                bcrypt.compare(password, row.hash).then((result) => {
                    if (result)
                        // password matches
                        resolve(row);
                    else {
                        console.log("Password not matching");
                        resolve(false); // password not matching
                    }
                });
            }
        });
    });
};

exports.activateUser = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE user SET isActive = 1 WHERE email = ?";
        db.run(sql, [email], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

exports.deleteActivation = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM activation WHERE email = ?";
        db.run(sql, [email], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.deleteUser = () => {
    return new Promise((resolve, reject) => {
        const sql =
            "DELETE FROM user";
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });

        const sql2 =
            "UPDATE sqlite_sequence SET seq=0 WHERE name='user'";
        db.run(sql2, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });

    })
};

exports.deleteTableActivation = () => {
    return new Promise((resolve, reject) => {
        const sql =
            "DELETE FROM activation";
        db.run(sql, [], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    })
};