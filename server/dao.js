'use strict';

/* Data Access Object (DAO) module for accessing db */

const sqlite = require('sqlite3');
const { Hike } = require('./hike');
// open the database
const db = new sqlite.Database('hiketracker.db', (err) => {
  if (err) throw err;
});

/*** HIKE TABLE ***/

const togeojson = require("@mapbox/togeojson"); //convert from xml->json
const DomParser = require("xmldom").DOMParser; // node doesn't have xml parsing or a dom.
const fs = require("fs"); //file system manager (readFile)


exports.getCoordinates=(file)=>{

    
  if (file) {
  const fileParsedFromDom = new DomParser().parseFromString(fs.readFileSync(file, "utf-8"));
  // Convert GPX to GeoJSON
  const converted = togeojson.gpx(fileParsedFromDom);
  const coordinates = {}; 
  let i=0;
  for(const geometries of converted.features )
  {
      const c = geometries.geometry.coordinates; 
      coordinates[i] = c; 
      
      i+=1; 
  }
  return coordinates; 
  }
  return {}; 

}



// Get Hike info 
exports.getHike = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM hike ORDER BY id ASC';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else{
      const hikes = rows.map(row => new Hike(row.id, row.title, row.lenght, row.description, row.difficulty, row.estimatedTime, row.ascent, row.localguideID)); 
      resolve(hikes);
      }
    })
  })
}




// Get Hike desc 
exports.getHikeDesc = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT description FROM HIKE WHERE id=? ';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    })
  })
}



exports.createHiking = (title, lenght, description, difficulty, estimatedTime, ascent, localguideID) => {

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO hike(title, lenght, description, difficulty, estimatedTime, ascent, localguideID) VALUES(?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [title, lenght, description, difficulty, estimatedTime, ascent, localguideID], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}




exports.deleteHikes = () => {
  return new Promise((resolve, reject) => {
    const sql1 = 'DROP TABLE IF EXISTS hike';
    const sql2 = 'CREATE TABLE IF NOT EXISTS hike(id integer NOT NULL, title text NOT NULL, lenght integer NOT NULL, description text NOT NULL, difficulty text NOT NULL, estimatedTime text NOT NULL, ascent integer NOT NULL, localguideID integer NOT NULL ,PRIMARY KEY(id) ) '
    db.run(sql1, [], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        db.run(sql2, [], function(err) {
          if (err) {
            console.log(err);
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

/*
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


// add a new ticket 
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
    const sql = 'SELECT descption FROM Hike ORDER BY id ASC';
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
*/

