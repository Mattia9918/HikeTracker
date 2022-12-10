const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const hike_dao = require('../modules/dao/hikedao.js');
const user_dao = require('../modules/dao/userdao.js');
const { app } = require('../index');
var agent = chai.request.agent(app);
const bcrypt = require("bcrypt");

const localGuide = {
  name: "Mario",
  surname: "Rossi",
  username: "mariorossi1",
  email: "mario.rossi@mail.it",
  hash: "",
  salt: "",
  password: "password",
  role: "localGuide",
};

async function deleteTables() {
  await hike_dao.deleteHike_Point();
  await hike_dao.deleteHikes();
  await hike_dao.deletePoint();
  await user_dao.deleteUser();
}

async function insertUser() {
 
  localGuide.salt = await bcrypt.genSalt(10);
  localGuide.hash = await bcrypt.hash(localGuide.password, localGuide.salt);

  await user_dao.insertUser(localGuide);
  await user_dao.activateUser(localGuide.email);
}

async function logUser(email, password) {
  await agent
    .post("/api/sessions")
    .send({ username: email, password: password });
}

const logoutUser = async()=> await agent.delete("/api/sessions/current");

const hikeOK = {
  title: "Rifugio Bertorello",
  length: 2.81,
  description: "desc",
  difficulty: "Easy",
  estimatedTime: 0.5,
  ascent: 198.0,
  localguideID: 1,
  startingPoint: {
    latitude: 44.645612034,
    longitude: 7.256143788,
    continent: "Europe",
    lookupSource: "coordinates",
    continentCode: "EU",
    localityLanguageRequested: "en",
    city: "Paesana",
    countryName: "Italy",
    countryCode: "IT",
    postcode: "",
    principalSubdivision: "Piemonte",
    principalSubdivisionCode: "IT-21",
    plusCode: "8FP9J7W4+6F",
    locality: "Paesana",
    localityInfo: {
      administrative: [
        {
          name: "Italy",
          description: "republic in Southern Europe",
          order: 2,
          adminLevel: 2,
          isoCode: "IT",
          wikidataId: "Q38",
          geonameId: 3175395,
        },
        {
          name: "Piemonte",
          description: "region in North-West Italy",
          order: 5,
          adminLevel: 4,
          isoCode: "IT-21",
          wikidataId: "Q1216",
          geonameId: 3170831,
        },
        {
          name: "Provincia di Cuneo",
          description: "province in Italy",
          order: 6,
          adminLevel: 6,
          isoCode: "IT-CN",
          wikidataId: "Q15091",
          geonameId: 3177699,
        },
        {
          name: "Paesana",
          description: "Italian comune",
          order: 8,
          adminLevel: 8,
          wikidataId: "Q20284",
          geonameId: 6536421,
        },
      ],
      informative: [
        {
          name: "Europe",
          description: "continent",
          order: 1,
          isoCode: "EU",
          wikidataId: "Q46",
          geonameId: 6255148,
        },
        {
          name: "Italian Peninsula",
          description: "peninsula of southern Europe",
          order: 3,
          wikidataId: "Q145694",
        },
        {
          name: "Alps",
          description: "European mountain range",
          order: 4,
          wikidataId: "Q1286",
          geonameId: 2661786,
        },
        {
          name: "Cottian Alps",
          description: "mountain range in the South-Western part of the Alps",
          order: 7,
          wikidataId: "Q1251",
          geonameId: 3023403,
        },
      ],
    },
  },
  endingPoint: {
    latitude: 44.636650121,
    longitude: 7.245265664,
    continent: "Europe",
    lookupSource: "coordinates",
    continentCode: "EU",
    localityLanguageRequested: "en",
    city: "Paesana",
    countryName: "Italy",
    countryCode: "IT",
    postcode: "",
    principalSubdivision: "Piemonte",
    principalSubdivisionCode: "IT-21",
    plusCode: "8FP9J6PW+M4",
    locality: "Paesana",
    localityInfo: {
      administrative: [
        {
          name: "Italy",
          description: "republic in Southern Europe",
          order: 2,
          adminLevel: 2,
          isoCode: "IT",
          wikidataId: "Q38",
          geonameId: 3175395,
        },
        {
          name: "Piemonte",
          description: "region in North-West Italy",
          order: 5,
          adminLevel: 4,
          isoCode: "IT-21",
          wikidataId: "Q1216",
          geonameId: 3170831,
        },
        {
          name: "Provincia di Cuneo",
          description: "province in Italy",
          order: 6,
          adminLevel: 6,
          isoCode: "IT-CN",
          wikidataId: "Q15091",
          geonameId: 3177699,
        },
        {
          name: "Paesana",
          description: "Italian comune",
          order: 8,
          adminLevel: 8,
          wikidataId: "Q20284",
          geonameId: 6536421,
        },
      ],
      informative: [
        {
          name: "Europe",
          description: "continent",
          order: 1,
          isoCode: "EU",
          wikidataId: "Q46",
          geonameId: 6255148,
        },
        {
          name: "Italian Peninsula",
          description: "peninsula of southern Europe",
          order: 3,
          wikidataId: "Q145694",
        },
        {
          name: "Alps",
          description: "European mountain range",
          order: 4,
          wikidataId: "Q1286",
          geonameId: 2661786,
        },
        {
          name: "Cottian Alps",
          description: "mountain range in the South-Western part of the Alps",
          order: 7,
          wikidataId: "Q1251",
          geonameId: 3023403,
        },
      ],
    },
  },
};

const hikeMalformed = {
  title: "Rifugio Bertorello",
  length: 2.81,
  description: "desc",
  difficulty: "Easy",
  estimatedTime: "blaaa",
  ascent: 198.0,
  localguideID: 1,
  startingPoint: {
    latitude: 44.645612034,
    longitude: 7.256143788,
    continent: "Europe",
    lookupSource: "coordinates",
    continentCode: "EU",
    localityLanguageRequested: "en",
    city: "Paesana",
    countryName: "Italy",
    countryCode: "IT",
    postcode: "",
    principalSubdivision: "Piemonte",
    principalSubdivisionCode: "IT-21",
    plusCode: "8FP9J7W4+6F",
    locality: "Paesana",
    localityInfo: {
      administrative: [
        {
          name: "Italy",
          description: "republic in Southern Europe",
          order: 2,
          adminLevel: 2,
          isoCode: "IT",
          wikidataId: "Q38",
          geonameId: 3175395,
        },
        {
          name: "Piemonte",
          description: "region in North-West Italy",
          order: 5,
          adminLevel: 4,
          isoCode: "IT-21",
          wikidataId: "Q1216",
          geonameId: 3170831,
        },
        {
          name: "Provincia di Cuneo",
          description: "province in Italy",
          order: 6,
          adminLevel: 6,
          isoCode: "IT-CN",
          wikidataId: "Q15091",
          geonameId: 3177699,
        },
        {
          name: "Paesana",
          description: "Italian comune",
          order: 8,
          adminLevel: 8,
          wikidataId: "Q20284",
          geonameId: 6536421,
        },
      ],
      informative: [
        {
          name: "Europe",
          description: "continent",
          order: 1,
          isoCode: "EU",
          wikidataId: "Q46",
          geonameId: 6255148,
        },
        {
          name: "Italian Peninsula",
          description: "peninsula of southern Europe",
          order: 3,
          wikidataId: "Q145694",
        },
        {
          name: "Alps",
          description: "European mountain range",
          order: 4,
          wikidataId: "Q1286",
          geonameId: 2661786,
        },
        {
          name: "Cottian Alps",
          description: "mountain range in the South-Western part of the Alps",
          order: 7,
          wikidataId: "Q1251",
          geonameId: 3023403,
        },
      ],
    },
  },
  endingPoint: {
    latitude: 44.636650121,
    longitude: 7.245265664,
    continent: "Europe",
    lookupSource: "coordinates",
    continentCode: "EU",
    localityLanguageRequested: "en",
    city: "Paesana",
    countryName: "Italy",
    countryCode: "IT",
    postcode: "",
    principalSubdivision: "Piemonte",
    principalSubdivisionCode: "IT-21",
    plusCode: "8FP9J6PW+M4",
    locality: "Paesana",
    localityInfo: {
      administrative: [
        {
          name: "Italy",
          description: "republic in Southern Europe",
          order: 2,
          adminLevel: 2,
          isoCode: "IT",
          wikidataId: "Q38",
          geonameId: 3175395,
        },
        {
          name: "Piemonte",
          description: "region in North-West Italy",
          order: 5,
          adminLevel: 4,
          isoCode: "IT-21",
          wikidataId: "Q1216",
          geonameId: 3170831,
        },
        {
          name: "Provincia di Cuneo",
          description: "province in Italy",
          order: 6,
          adminLevel: 6,
          isoCode: "IT-CN",
          wikidataId: "Q15091",
          geonameId: 3177699,
        },
        {
          name: "Paesana",
          description: "Italian comune",
          order: 8,
          adminLevel: 8,
          wikidataId: "Q20284",
          geonameId: 6536421,
        },
      ],
      informative: [
        {
          name: "Europe",
          description: "continent",
          order: 1,
          isoCode: "EU",
          wikidataId: "Q46",
          geonameId: 6255148,
        },
        {
          name: "Italian Peninsula",
          description: "peninsula of southern Europe",
          order: 3,
          wikidataId: "Q145694",
        },
        {
          name: "Alps",
          description: "European mountain range",
          order: 4,
          wikidataId: "Q1286",
          geonameId: 2661786,
        },
        {
          name: "Cottian Alps",
          description: "mountain range in the South-Western part of the Alps",
          order: 7,
          wikidataId: "Q1251",
          geonameId: 3023403,
        },
      ],
    },
  },
};

describe('test post api/hiking (case success 200)', () => {


    before(async ()=>{
        // delete tables hike, point, hike_point and user
        await deleteTables();

        // create user
        await insertUser();

        // log local guide
        await logUser("mario.rossi@mail.it", "password");
    }); 
    
    postHike(201, hikeOK); 
    
});

describe('test api/hiking (case error 422)', () => {


  before(async ()=>{
    // delete tables hike, point, hike_point and user
    await deleteTables();

    // create user
    await insertUser();

    // log local guide
    await logUser("mario.rossi@mail.it", "password");
  }); 
    
    postHike(422, hikeMalformed);  
});

describe('test api/hiking (case error 401)', () => {
  before(async ()=>{
    // delete tables hike, point, hike_point and user
    await deleteTables();
    // create user
    await insertUser();

    // log local guide
    await logUser("mario.rossi@mail.it", "password");

    // logout
    await logoutUser();
});  

    postHike(401, hikeOK);   
});

//API POST NEW HIKE
function postHike(expectedHTTPStatus, hike) {
    it('test post /api/hiking', async () => {
        await agent.post('/api/hiking')
            .send(hike)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);  
            }); 

    })
}

// GET HIKES 

describe('test Get Hikes', () => {
  beforeEach(async () => {
      // delete tables hike, point, hike_point and user
    await deleteTables();
    // create user
    await insertUser();

    // log local guide
    await logUser("mario.rossi@mail.it", "password");
  });

  const hike1 = {
      "title": "hikone1",
      "length": 10,
      "description": "\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      "difficulty": "Easy",
      "estimatedTime": "10",
      "ascent": 800,
      "localguideID": 1,
      "startingPoint": {
        latitude: 44.645612034,
        longitude: 7.256143788,
        continent: "Europe",
        lookupSource: "coordinates",
        continentCode: "EU",
        localityLanguageRequested: "en",
        city: "Paesana",
        countryName: "Italy",
        countryCode: "IT",
        postcode: "",
        principalSubdivision: "Piemonte",
        principalSubdivisionCode: "IT-21",
        plusCode: "8FP9J7W4+6F",
        locality: "Paesana",
        localityInfo: {
          administrative: [
            {
              name: "Italy",
              description: "republic in Southern Europe",
              order: 2,
              adminLevel: 2,
              isoCode: "IT",
              wikidataId: "Q38",
              geonameId: 3175395,
            },
            {
              name: "Piemonte",
              description: "region in North-West Italy",
              order: 5,
              adminLevel: 4,
              isoCode: "IT-21",
              wikidataId: "Q1216",
              geonameId: 3170831,
            },
            {
              name: "Provincia di Cuneo",
              description: "province in Italy",
              order: 6,
              adminLevel: 6,
              isoCode: "IT-CN",
              wikidataId: "Q15091",
              geonameId: 3177699,
            },
            {
              name: "Paesana",
              description: "Italian comune",
              order: 8,
              adminLevel: 8,
              wikidataId: "Q20284",
              geonameId: 6536421,
            },
          ],
          informative: [
            {
              name: "Europe",
              description: "continent",
              order: 1,
              isoCode: "EU",
              wikidataId: "Q46",
              geonameId: 6255148,
            },
            {
              name: "Italian Peninsula",
              description: "peninsula of southern Europe",
              order: 3,
              wikidataId: "Q145694",
            },
            {
              name: "Alps",
              description: "European mountain range",
              order: 4,
              wikidataId: "Q1286",
              geonameId: 2661786,
            },
            {
              name: "Cottian Alps",
              description: "mountain range in the South-Western part of the Alps",
              order: 7,
              wikidataId: "Q1251",
              geonameId: 3023403,
            },
          ],
        },
      },
      "endingPoint": {
        latitude: 44.636650121,
        longitude: 7.245265664,
        continent: "Europe",
        lookupSource: "coordinates",
        continentCode: "EU",
        localityLanguageRequested: "en",
        city: "Paesana",
        countryName: "Italy",
        countryCode: "IT",
        postcode: "",
        principalSubdivision: "Piemonte",
        principalSubdivisionCode: "IT-21",
        plusCode: "8FP9J6PW+M4",
        locality: "Paesana",
        localityInfo: {
          administrative: [
            {
              name: "Italy",
              description: "republic in Southern Europe",
              order: 2,
              adminLevel: 2,
              isoCode: "IT",
              wikidataId: "Q38",
              geonameId: 3175395,
            },
            {
              name: "Piemonte",
              description: "region in North-West Italy",
              order: 5,
              adminLevel: 4,
              isoCode: "IT-21",
              wikidataId: "Q1216",
              geonameId: 3170831,
            },
            {
              name: "Provincia di Cuneo",
              description: "province in Italy",
              order: 6,
              adminLevel: 6,
              isoCode: "IT-CN",
              wikidataId: "Q15091",
              geonameId: 3177699,
            },
            {
              name: "Paesana",
              description: "Italian comune",
              order: 8,
              adminLevel: 8,
              wikidataId: "Q20284",
              geonameId: 6536421,
            },
          ],
          informative: [
            {
              name: "Europe",
              description: "continent",
              order: 1,
              isoCode: "EU",
              wikidataId: "Q46",
              geonameId: 6255148,
            },
            {
              name: "Italian Peninsula",
              description: "peninsula of southern Europe",
              order: 3,
              wikidataId: "Q145694",
            },
            {
              name: "Alps",
              description: "European mountain range",
              order: 4,
              wikidataId: "Q1286",
              geonameId: 2661786,
            },
            {
              name: "Cottian Alps",
              description: "mountain range in the South-Western part of the Alps",
              order: 7,
              wikidataId: "Q1251",
              geonameId: 3023403,
            },
          ],
        },
      },
  }

  const hike2 = {
      "title": "hikone2",
      "length": 54,
      "description": "\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      "difficulty": "Easy",
      "estimatedTime": "10",
      "ascent": 300,
      "localguideID": 1,
      "startingPoint": {
        latitude: 44.645612034,
        longitude: 7.256143788,
        continent: "Europe",
        lookupSource: "coordinates",
        continentCode: "EU",
        localityLanguageRequested: "en",
        city: "Paesana",
        countryName: "Italy",
        countryCode: "IT",
        postcode: "",
        principalSubdivision: "Piemonte",
        principalSubdivisionCode: "IT-21",
        plusCode: "8FP9J7W4+6F",
        locality: "Paesana",
        localityInfo: {
          administrative: [
            {
              name: "Italy",
              description: "republic in Southern Europe",
              order: 2,
              adminLevel: 2,
              isoCode: "IT",
              wikidataId: "Q38",
              geonameId: 3175395,
            },
            {
              name: "Piemonte",
              description: "region in North-West Italy",
              order: 5,
              adminLevel: 4,
              isoCode: "IT-21",
              wikidataId: "Q1216",
              geonameId: 3170831,
            },
            {
              name: "Provincia di Cuneo",
              description: "province in Italy",
              order: 6,
              adminLevel: 6,
              isoCode: "IT-CN",
              wikidataId: "Q15091",
              geonameId: 3177699,
            },
            {
              name: "Paesana",
              description: "Italian comune",
              order: 8,
              adminLevel: 8,
              wikidataId: "Q20284",
              geonameId: 6536421,
            },
          ],
          informative: [
            {
              name: "Europe",
              description: "continent",
              order: 1,
              isoCode: "EU",
              wikidataId: "Q46",
              geonameId: 6255148,
            },
            {
              name: "Italian Peninsula",
              description: "peninsula of southern Europe",
              order: 3,
              wikidataId: "Q145694",
            },
            {
              name: "Alps",
              description: "European mountain range",
              order: 4,
              wikidataId: "Q1286",
              geonameId: 2661786,
            },
            {
              name: "Cottian Alps",
              description: "mountain range in the South-Western part of the Alps",
              order: 7,
              wikidataId: "Q1251",
              geonameId: 3023403,
            },
          ],
        },
      },
      "endingPoint": {
        latitude: 44.636650121,
        longitude: 7.245265664,
        continent: "Europe",
        lookupSource: "coordinates",
        continentCode: "EU",
        localityLanguageRequested: "en",
        city: "Paesana",
        countryName: "Italy",
        countryCode: "IT",
        postcode: "",
        principalSubdivision: "Piemonte",
        principalSubdivisionCode: "IT-21",
        plusCode: "8FP9J6PW+M4",
        locality: "Paesana",
        localityInfo: {
          administrative: [
            {
              name: "Italy",
              description: "republic in Southern Europe",
              order: 2,
              adminLevel: 2,
              isoCode: "IT",
              wikidataId: "Q38",
              geonameId: 3175395,
            },
            {
              name: "Piemonte",
              description: "region in North-West Italy",
              order: 5,
              adminLevel: 4,
              isoCode: "IT-21",
              wikidataId: "Q1216",
              geonameId: 3170831,
            },
            {
              name: "Provincia di Cuneo",
              description: "province in Italy",
              order: 6,
              adminLevel: 6,
              isoCode: "IT-CN",
              wikidataId: "Q15091",
              geonameId: 3177699,
            },
            {
              name: "Paesana",
              description: "Italian comune",
              order: 8,
              adminLevel: 8,
              wikidataId: "Q20284",
              geonameId: 6536421,
            },
          ],
          informative: [
            {
              name: "Europe",
              description: "continent",
              order: 1,
              isoCode: "EU",
              wikidataId: "Q46",
              geonameId: 6255148,
            },
            {
              name: "Italian Peninsula",
              description: "peninsula of southern Europe",
              order: 3,
              wikidataId: "Q145694",
            },
            {
              name: "Alps",
              description: "European mountain range",
              order: 4,
              wikidataId: "Q1286",
              geonameId: 2661786,
            },
            {
              name: "Cottian Alps",
              description: "mountain range in the South-Western part of the Alps",
              order: 7,
              wikidataId: "Q1251",
              geonameId: 3023403,
            },
          ],
        },
      },
  }

  getHikes(200, hike1, hike2);
  getHikeById(200, hike1);
  getHikesByAscent(200, hike1, hike2, 200, 800);
  getHikesByExpectedTime(200, hike1, hike2, 0, 2);
  getHikesByLength(200, hike1, hike2, 1, 10);
  getHikesByDifficulty(200, hike1, hike2, "easy");
  getHikesByCity(200, hike1, hike2, "Biella");
  getHikesByProvince(200, hike1, hike2, "Biella");
  getHikesByDistance(200, hike1, hike2, 40, 40, 1000);
});

function getHikes(expectedHTTPStatus, hike1, hike2) {
  it('test getHikes', async () => {
      let hike1ID, hike2ID;
      await agent.post('/api/hiking').send(hike1).then(function (res) {
          hike1ID = res.body.id;
      });
      await agent.post('/api/hiking').send(hike2).then(function (res) {
          hike2ID = res.body.id;
      });

      await agent.get('/api/hikes').then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          res.body.length.should.equal(2);
      });
  });
}

function getHikeById(expectedHTTPStatus, hike1) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);

      await agent.get('/api/hike/1').then( function (res) {
          res.should.have.status(expectedHTTPStatus);
      });
  });
}

function getHikesByAscent(expectedHTTPStatus, hike1, hike2, minAscent, maxAscent) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=ascent&value1=${minAscent}&value2=${maxAscent}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          
      });
  });
}

function getHikesByExpectedTime(expectedHTTPStatus, hike1, hike2, minTime, maxTime) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=expectedTime&value1=${minTime}&value2=${maxTime}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
      });
  });
}

function getHikesByLength(expectedHTTPStatus, hike1, hike2, minLen, maxLen) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=length&value1=${minLen}&value2=${maxLen}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          // res.body.should.eql([]);
      });
  });
}

function getHikesByDifficulty(expectedHTTPStatus, hike1, hike2, difficulty) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=difficulty&value1=${difficulty}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          // res.body.should.eql([]);
      });
  });
}

function getHikesByCity(expectedHTTPStatus, hike1, hike2, city) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=city&value1=${city}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          // res.body.should.eql([]);
      });
  });
}

function getHikesByProvince(expectedHTTPStatus, hike1, hike2, province) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=ascent&province=${province}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          // res.body.should.eql([]);
      });
  });
}

function getHikesByDistance(expectedHTTPStatus, hike1, hike2, latitude, longitude, maxDist) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);
      await agent.post('/api/hiking').send(hike2);

      await agent.get(`/api/hikes?filter=distance&longitude=${longitude}&latitude=${latitude}&maxDist=${maxDist}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          // res.body.should.eql([]);
      });
  });
}