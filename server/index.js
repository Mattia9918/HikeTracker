const express = require("express"); 
const dao = require('./dao');
const fileUpload = require("express-fileupload");
const cors = require('cors'); 
const app = express();
const port = 3001;

app.use(express.json());
app.use(fileUpload());
app.use(cors()); 

// FILE UPLOAD(.gpx*)
app.post('/upload', async(req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  

  file.mv(`../client/public/uploads/${file}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
        
  });

  const a = dao.getCoordinates(`../client/public/uploads/${file.name}`);
  
  res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, startPointLong: a[0][1][0], startPointLat: a[0][1][1], endingPointLong: a[0][a[0].length-1][0], endingPointLat: a[0][a[0].length-1][1] });
});
/*
app.get(`${__dirname}/upload`, (req,res)=> {
    res.download("./uploads/location.gpx");
});
*/

// HIKING TABLE 
app.get('/api/hiking', async (req, res) => {
  try {
    const hike = await dao.getHike();
    return res.status(200).json(hike);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
    
  }
});

// hiking desc
app.get("/api/hiking/:id", async (req, res) => {
  try {
    const hikedesc = await dao.getHikeDesc(req.params.id);
    res.status(200).json(hikedesc);
  } catch (err) {
    res.status(500).end();
  }
});

//hiking post 
app.post('/api/hiking', async (req, res) => {
    try {
      const status = await dao.createHiking(req.body.title, req.body.length, req.body.description, req.body.difficulty, req.body.estimatedTime, req.body.ascent, req.body.localguideID);
      if (status === '422')
        res.status(422).json({ error: `Validation of request body failed` }).end();
      else
        return res.status(201).end();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: `Generic error` }).end();
    }
  })

  // hiking delete 
  app.delete('/api/hiking/delete', async (req, res) => {
    try {
      const status = await dao.deleteHikes();
    if (status === '404'){
      console.log(status);
      res.status(404).json({ error: `Validation of request body failed` }).end();
    }
      else{
      return res.status(201).end();}
    } catch (err) {
      res.status(500).end();
    }
  });

  


/* -- SERVER ACTIVATION -- */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/* Objects to export */
module.exports = {
  app: app, 
};











/*'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dao = require('./dao');

//-- SERVER AND MIDDLEWARE CONFIGURATION //

// Express server init 
const app = new express();
const port = 3001;

// Middlewares //
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// -- API -- //

app.get('/api/service', async (req, res) => {
  try {
    const services = await dao.getServices();
    return res.status(200).json(services);
  } catch (err) {
    return res.status(500).json({ error: err });
    
  }
});

app.post('/api/ticket/:serviceId', async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const myTicketId = await dao.postTicket(serviceId);
    return res.status(201).json(myTicketId);
  } catch (err) {
    return res.status(503).json({ error: err });
  }
});

app.post(`/api/serviceType`, async (req, res) => {

  try {

    const status = await dao.createServiceType(req.body.name, req.body.estimatedTime);
    if (status === '422')
      res.status(422).json({ error: `Validation of request body failed` }).end();
    else
      return res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Generic error` }).end();
  }
})

// Waiting Queue
app.get("/api/queue/:id", async (req, res) => {
  try {
    const ticket = await dao.getTicket(req.params.id);
    const queue = await dao.getQueue(ticket.id, ticket.service_type, ticket.issued_at);
    res.status(200).json(queue);
  } catch (err) {
    res.status(500).end();
  }
});

app.delete("/api/ticket/delete", async (req, res) => {
  try {
    await dao.deleteTicket();
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
});

app.delete("/api/services/delete", async (req, res) => {
  try {
    await dao.deleteServices();
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
});

// -- SERVER ACTIVATION -- //
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Objects to export //
module.exports = {
  app: app, 
};

*/
