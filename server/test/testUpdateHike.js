const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const hike_dao = require("../modules/dao/hikedao.js");
const user_dao = require("../modules/dao/userdao.js");
const hut_dao = require("../modules/dao/hutdao.js");
const { app } = require("../index");
const { postHut } = require("../modules/dao/hutdao.js");
let agent = chai.request.agent(app);
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
const localGuide2 = {
  name: "Giulia",
  surname: "Brambilla",
  username: "giuliab",
  email: "giulia.brambilla@mail.it",
  hash: "",
  salt: "",
  password: "password",
  role: "localGuide",
};
const hike = {
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

const hike2 = {
  title: "Rifugio Bertorello",
  length: 2.81,
  description: "desc",
  difficulty: "Easy",
  estimatedTime: 0.5,
  ascent: 198.0,
  localguideID: 2,
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

// create hut to set as arrive point
const hut = {
  name: "Rifugio Bertorello endingPoint",
  address: "12034 Paesana CN",
  phone_number: "3892119067",
  email: "bertorello@mail.it",
  website: "www.rifugiobertorello.it",
  description: "Hut in Paesana",
  altitude: 650,
  languages: "french",
  bike_friendly: 1,
  reachability: "normal",
  disabled_services: 0,
  rooms: 25,
  bathrooms: 30,
  beds: 50,
  restaurant_service: 1,
};
const point = {
  city: "Paesana",
  province: "Cuneo",
  latitude: 44.640565841321729,
  longitude: 7.251212596893311,
};

const hut2 = {
  name: "Dollo Zone",
  address: "33333 Dollo Zone ",
  phone_number: "3892119067",
  email: "dollozone@mail.it",
  website: "www.dollozone.it",
  description: "Hut in Dollo Zone",
  altitude: 650,
  languages: "french",
  bike_friendly: 1,
  reachability: "normal",
  disabled_services: 0,
  rooms: 25,
  bathrooms: 30,
  beds: 50,
  restaurant_service: 1,
};

const point2 = {
  city: "Dollo Zone",
  province: "Dollo Zone",
  latitude: 7.429607,
  longitude: 46.003288,
};

async function deleteTables() {
  await hike_dao.deleteHike_Point();
  await hike_dao.deleteHikes();
  await hike_dao.deletePoint();
  await hike_dao.deleteGpx();
  await user_dao.deleteUser();
  await hut_dao.deleteAllHuts(); 

}

async function insertUsers() {
 
  localGuide.salt = await bcrypt.genSalt(10);
  localGuide.hash = await bcrypt.hash(localGuide.password, localGuide.salt);

  await user_dao.insertUser(localGuide);
  await user_dao.activateUser(localGuide.email);

  localGuide2.salt = await bcrypt.genSalt(10);
  localGuide2.hash = await bcrypt.hash(localGuide2.password, localGuide2.salt);

  await user_dao.insertUser(localGuide2);
  await user_dao.activateUser(localGuide2.email);
}

async function logUser(email, password) {
  await agent
    .post("/api/sessions")
    .send({ username: email, password: password });
}

const logoutUser = async()=> await agent.delete("/api/sessions/current"); 
    

async function postHike(fname, hike) {
  // Insert hike to Rifugio Bertorello

  await agent.post("/api/hiking").send(hike);

  const gpx = {
    path: `/uploads/${fname}`,
  };
  await agent.post("/api/gpx").send(gpx);

}

// TEST UPDATE HIKES (starting point) 

describe("test update hike starting point", () => {
  before(async () => {
    // delete hike, point, hike_point, gpx, user
    await deleteTables();

    // create users
    await insertUsers();

    //login & postHike localGuide 2 
    await logUser("giulia.brambilla@mail.it","password");
    await postHike("new (7).gpx",hike2);
    await logoutUser(); 

    //login & postHike_gpx localGuide 1
    await logUser("mario.rossi@mail.it", "password");
    await postHike("Bertorello.gpx",hike);
   

    await agent.post("/api/hut").send({ hut: hut, point: point });
    await agent.post("/api/hut").send({ hut: hut2, point: point2 });
  });

  // success
  updateHike(200, 2, {
    id: 5,
    latitude: point.latitude,
    longitude: point.longitude
  }, "startingPoint");

  //hut troppo distante
  updateHike(422, 2, {
    id: 6,
    latitude: point2.latitude,
    longitude: point2.longitude,
  }, "startingPoint");  

  //hike o gpx non esistente (tutti e 2 usano l'id della hike, quindi basta un test)
  updateHike(404, 1000, {
    id: 5,
    latitude: point.latitude,
    longitude: point.longitude,
  }, "startingPoint"); 

  //modifica di un hike di un'altra localGuide
  updateHike(403, 1, {
    id: 5,
    latitude: point.latitude,
    longitude: point.longitude,
  }, "startingPoint");  

  //campi errati
  updateHike(422, 2, {
    id: "null",
    latitude: point.latitude,
    longitude: point.longitude,
  }, "startingPoint");
});

function updateHike(expectedHTTPStatus, hikeID, point, type) {
  it("test put /api/hike/:id/:type", async () => {
    await agent
      .put(`/api/hike/${hikeID}/${type}`)
      .send({
        id: point.id,
        latitude: point.latitude,
        longitude: point.longitude,
      })
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

// TEST UPDATE HIKES (arrive point) 
describe("test update hike arrival point", () => {
  before(async () => {
    // delete hike, point, hike_point, gpx, user
    await deleteTables();

    // create local guide and hiker
    await insertUsers();

    //login & postHike localGuide 2 
    await logUser("giulia.brambilla@mail.it","password");
    await postHike("new (7).gpx",hike2);
    await logoutUser(); 

    //login & postHike_gpx localGuide 1
    await logUser("mario.rossi@mail.it", "password");
    await postHike("Bertorello.gpx",hike);
   

    await agent.post("/api/hut").send({ hut: hut, point: point });
    await agent.post("/api/hut").send({ hut: hut2, point: point2 });
  
  });

  //success
  updateHike(200, 2, {
    id: 5,
    latitude: point.latitude,
    longitude: point.longitude,
  }, "arrivalPoint"); 

   //hut troppo distante
   updateHike(422, 2, {
    id: 6,
    latitude: point2.latitude,
    longitude: point2.longitude,
  }, "arrivalPoint");  

  //hike o gpx non esistente (tutti e 2 usano l'id della hike, quindi basta un test)
  updateHike(404, 1000, {
    id: 5,
    latitude: point.latitude,
    longitude: point.longitude,
  }, "arrivalPoint"); 

  //modifica di un hike di un'altra localGuide
  updateHike(403, 1, {
    id: 5,
    latitude: point.latitude,
    longitude: point.longitude,
  }, "arrivalPoint");  

  //campi errati
  updateHike(422, 2, {
    id: "null",
    latitude: point.latitude,
    longitude: point.longitude,
  }, "arrivalPoint");
});
