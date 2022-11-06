'use strict';

/* Data Access Object (DAO) module for accessing db */

const sqlite = require('sqlite3');
const { ServiceType } = require('./Classes/ServiceType');

// open the database
const db = new sqlite.Database('oqm.db', (err) => {
  if (err) throw err;
});

/*** TICKET TABLE ***/

// Get Ticket from id
exports.getTicket = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM TICKET WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    })
  })
}

// Get person in queue
exports.getQueue = (id, service_type, issued_at) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT count(*) as numUtenti FROM TICKET WHERE service_type = ? AND issued_at <= ? AND state = 'open' AND id != ?";
    db.get(sql, [service_type, issued_at, id], (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    })
  })
}

exports.createServiceType = (name, estimatedTime) => {

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO SERVICE_TYPE(name, estimated_time) VALUES(?, ?)`;
    db.run(sql, [name, estimatedTime], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}


// get all Services
exports.getServices = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SERVICE_TYPE ORDER BY name ASC';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        const services = rows.map(row => new ServiceType(row.id, row.name, row.estimated_time));
        resolve(services);
      }
    });
  });
};


//get specific service type // Would be usefull(?)
exports.getSService = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SERVICE_TYPE WHERE id=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
};


/* add a new ticket */
exports.postTicket = (serviceId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO TICKET(id, service_type, state, issued_at, counter) VALUES(?, ?, ?, ? ,?)'; 
    var current = new Date();
    db.run(sql, [null, serviceId, 'open', `${current.toLocaleString()}`, 1], function (err) {;
      if (err) {
        reject(err);
      }
      else {
        resolve(this.lastID);
      }
    });
  });
};



// get all Tickets // Would be useful(?) 
exports.getTickets = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM TICKET ORDER BY id ASC';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        const tickets = rows.map(row => new TICKET(row.id, row.service_type, row.state, row.issued_at, row.counter)); // ID can be removed(?)
        resolve(tickets);
      }
    });
  });
};


//get specific ticket  // Would be usefull(?) // When the ticket retrieved by customer
exports.getSTicket = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM TICKET WHERE id=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {

        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
};

exports.deleteTicket = () => {
  return new Promise((resolve, reject) => {
    const sql1 = 'DELETE FROM TICKET';
    db.run(sql1, [], function (err) {;
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
    const sql2 = "UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='TICKET'";
    db.run(sql2, [], function (err) {;
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

exports.deleteServices = () => {
  return new Promise((resolve, reject) => {
    const sql1 = 'DROP TABLE SERVICE_TYPE';
    const sql2 = 'CREATE TABLE SERVICE_TYPE(id integer NOT NULL, name text NOT NULL, estimated_time text, PRIMARY KEY(id) ) '
    db.run(sql1, [], function (err) {
      if (err) {
        reject(err);
      }
      else {
        db.run(sql2, [], function(err) {
          if (err) {
            reject(err)
          }
          else {
            resolve()
          }
    });
  }
})
  }) 
};

