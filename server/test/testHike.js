const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const dao = require('../dao.js');
const { app } = require('../index');
var agent = chai.request.agent(app);



describe('test api/hiking (case success 200)', () => {


    before(async ()=>{
        await dao.deleteHikes(); 
        await dao.deleteHike_Point();
        await dao.deletePoint(); 
    }); 

    const hike = {
        "title":"Titolo",
        "length":10,
        "description":"desc",
        "difficulty":"hard",
        "estimatedTime":12,
        "ascent":"ascent",
        "localguideID":12,
        "startingPoint":{
            "latitude": 32.14,
            "longitude": 22.6,
            "continent": "Africa",
            "lookupSource": "coordinates",
            "continentCode": "AF",
            "localityLanguageRequested": "en');",
            "city": "",
            "countryName": "Libya",
            "countryCode": "LY",
            "postcode": "",
            "principalSubdivision": "Derna District",
            "principalSubdivisionCode": "LY-DR",
            "plusCode": "8G444JR2+22",
            "locality": "Derna District",
            "localityInfo": {
              "administrative": [
                {
                  "name": "Libya",
                  "description": "sovereign state in north Africa",
                  "isoName": "Libya",
                  "order": 4,
                  "adminLevel": 2,
                  "isoCode": "LY",
                  "wikidataId": "Q1016",
                  "geonameId": 2215636
                },
                {
                  "name": "Derna District",
                  "description": "district of Libya",
                  "isoName": "Darnah",
                  "order": 6,
                  "adminLevel": 4,
                  "isoCode": "LY-DR",
                  "wikidataId": "Q26124",
                  "geonameId": 87204
                }
              ],
              "informative": [
                {
                  "name": "Africa",
                  "description": "continent on the Earth's northern and southern hemispheres",
                  "order": 1,
                  "isoCode": "AF",
                  "wikidataId": "Q15",
                  "geonameId": 6255146
                },
                {
                  "name": "Maghreb",
                  "description": "region",
                  "order": 2
                },
                {
                  "name": "Libyan Desert",
                  "description": "North-eastern part of the Sahara comprising desert areas in Egypt, Libya and Sudan",
                  "order": 3,
                  "wikidataId": "Q181528",
                  "geonameId": 353306
                },
                {
                  "name": "Libyan Plateau",
                  "description": "plateau in Libya",
                  "order": 5,
                  "wikidataId": "Q27489229",
                  "geonameId": 85417
                }
              ]
            }
        },
        "endingPoint": {
            "latitude": 32.14,
            "longitude": 22.3,
            "continent": "Africa",
            "lookupSource": "coordinates",
            "continentCode": "AF",
            "localityLanguageRequested": "en');",
            "city": "",
            "countryName": "Libya",
            "countryCode": "LY",
            "postcode": "",
            "principalSubdivision": "Derna District",
            "principalSubdivisionCode": "LY-DR",
            "plusCode": "8G4448R2+22",
            "locality": "Derna District",
            "localityInfo": {
              "administrative": [
                {
                  "name": "Libya",
                  "description": "sovereign state in north Africa",
                  "isoName": "Libya",
                  "order": 4,
                  "adminLevel": 2,
                  "isoCode": "LY",
                  "wikidataId": "Q1016",
                  "geonameId": 2215636
                },
                {
                  "name": "Derna District",
                  "description": "district of Libya",
                  "isoName": "Darnah",
                  "order": 6,
                  "adminLevel": 4,
                  "isoCode": "LY-DR",
                  "wikidataId": "Q26124",
                  "geonameId": 87204
                }
              ],
              "informative": [
                {
                  "name": "Africa",
                  "description": "continent on the Earth's northern and southern hemispheres",
                  "order": 1,
                  "isoCode": "AF",
                  "wikidataId": "Q15",
                  "geonameId": 6255146
                },
                {
                  "name": "Maghreb",
                  "description": "region",
                  "order": 2
                },
                {
                  "name": "Libyan Desert",
                  "description": "North-eastern part of the Sahara comprising desert areas in Egypt, Libya and Sudan",
                  "order": 3,
                  "wikidataId": "Q181528",
                  "geonameId": 353306
                },
                {
                  "name": "Libyan Plateau",
                  "description": "plateau in Libya",
                  "order": 5,
                  "wikidataId": "Q27489229",
                  "geonameId": 85417
                }
              ]
            }
        }
    
    }
    
    postHike(201,hike); 
    
});
describe('test api/hiking (case success 422)', () => {


    before(async ()=>{
        await dao.deleteHikes(); 
        await dao.deleteHike_Point();
        await dao.deletePoint(); 
    }); 

    const hike = {
        "title":"Titolo",
        "length":"length",
        "description":"desc",
        "difficulty":"hard",
        "estimatedTime":"time",
        "ascent":"ascent",
        "localguideID":12,
        "startingPoint":{
            "latitude": 32.14,
            "longitude": 22.6,
            "continent": "Africa",
            "lookupSource": "coordinates",
            "continentCode": "AF",
            "localityLanguageRequested": "en');",
            "city": "",
            "countryName": "Libya",
            "countryCode": "LY",
            "postcode": "",
            "principalSubdivision": "Derna District",
            "principalSubdivisionCode": "LY-DR",
            "plusCode": "8G444JR2+22",
            "locality": "Derna District",
            "localityInfo": {
              "administrative": [
                {
                  "name": "Libya",
                  "description": "sovereign state in north Africa",
                  "isoName": "Libya",
                  "order": 4,
                  "adminLevel": 2,
                  "isoCode": "LY",
                  "wikidataId": "Q1016",
                  "geonameId": 2215636
                },
                {
                  "name": "Derna District",
                  "description": "district of Libya",
                  "isoName": "Darnah",
                  "order": 6,
                  "adminLevel": 4,
                  "isoCode": "LY-DR",
                  "wikidataId": "Q26124",
                  "geonameId": 87204
                }
              ],
              "informative": [
                {
                  "name": "Africa",
                  "description": "continent on the Earth's northern and southern hemispheres",
                  "order": 1,
                  "isoCode": "AF",
                  "wikidataId": "Q15",
                  "geonameId": 6255146
                },
                {
                  "name": "Maghreb",
                  "description": "region",
                  "order": 2
                },
                {
                  "name": "Libyan Desert",
                  "description": "North-eastern part of the Sahara comprising desert areas in Egypt, Libya and Sudan",
                  "order": 3,
                  "wikidataId": "Q181528",
                  "geonameId": 353306
                },
                {
                  "name": "Libyan Plateau",
                  "description": "plateau in Libya",
                  "order": 5,
                  "wikidataId": "Q27489229",
                  "geonameId": 85417
                }
              ]
            }
        },
        "endingPoint": {
            "latitude": 32.14,
            "longitude": 22.3,
            "continent": "Africa",
            "lookupSource": "coordinates",
            "continentCode": "AF",
            "localityLanguageRequested": "en');",
            "city": "",
            "countryName": "Libya",
            "countryCode": "LY",
            "postcode": "",
            "principalSubdivision": "Derna District",
            "principalSubdivisionCode": "LY-DR",
            "plusCode": "8G4448R2+22",
            "locality": "Derna District",
            "localityInfo": {
              "administrative": [
                {
                  "name": "Libya",
                  "description": "sovereign state in north Africa",
                  "isoName": "Libya",
                  "order": 4,
                  "adminLevel": 2,
                  "isoCode": "LY",
                  "wikidataId": "Q1016",
                  "geonameId": 2215636
                },
                {
                  "name": "Derna District",
                  "description": "district of Libya",
                  "isoName": "Darnah",
                  "order": 6,
                  "adminLevel": 4,
                  "isoCode": "LY-DR",
                  "wikidataId": "Q26124",
                  "geonameId": 87204
                }
              ],
              "informative": [
                {
                  "name": "Africa",
                  "description": "continent on the Earth's northern and southern hemispheres",
                  "order": 1,
                  "isoCode": "AF",
                  "wikidataId": "Q15",
                  "geonameId": 6255146
                },
                {
                  "name": "Maghreb",
                  "description": "region",
                  "order": 2
                },
                {
                  "name": "Libyan Desert",
                  "description": "North-eastern part of the Sahara comprising desert areas in Egypt, Libya and Sudan",
                  "order": 3,
                  "wikidataId": "Q181528",
                  "geonameId": 353306
                },
                {
                  "name": "Libyan Plateau",
                  "description": "plateau in Libya",
                  "order": 5,
                  "wikidataId": "Q27489229",
                  "geonameId": 85417
                }
              ]
            }
        }
    
    }
    
    postHike(422,hike); 
    
});

describe('test api/hiking (case success 500)', () => {


    before(async ()=>{
        await dao.deleteHikes(); 
        await dao.deleteHike_Point();
        await dao.deletePoint(); 
    }); 

    const hike = {
        "title":"Titolo",
        "length":10,
        "description":"desc",
        "difficulty":"hard",
        "estimatedTime":10,
        "ascent":"ascent",
        "localguideID":12,
        "startingPoint":{
            "latitude": 32.14,
            "longitude": 22.6,
            "continent": "Africa",
            "lookupSource": "coordinates",
            "continentCode": "AF",
            "localityLanguageRequested": "en');",
            "city": "",
            "countryName": "Libya",
            "countryCode": "LY",
            "postcode": "",
            "principalSubdivision": "Derna District",
            "principalSubdivisionCode": "LY-DR",
            "plusCode": "8G444JR2+22",
            "locality": "Derna District",
            "localityInfo": {
              "administrative": [
                {
                  "name": "Libya",
                  "description": "sovereign state in north Africa",
                  "isoName": "Libya",
                  "order": 4,
                  "adminLevel": 2,
                  "isoCode": "LY",
                  "wikidataId": "Q1016",
                  "geonameId": 2215636
                },
                {
                  "name": "Derna District",
                  "description": "district of Libya",
                  "isoName": "Darnah",
                  "order": 6,
                  "adminLevel": 4,
                  "isoCode": "LY-DR",
                  "wikidataId": "Q26124",
                  "geonameId": 87204
                }
              ],
              "informative": [
                {
                  "name": "Africa",
                  "description": "continent on the Earth's northern and southern hemispheres",
                  "order": 1,
                  "isoCode": "AF",
                  "wikidataId": "Q15",
                  "geonameId": 6255146
                },
                {
                  "name": "Maghreb",
                  "description": "region",
                  "order": 2
                },
                {
                  "name": "Libyan Desert",
                  "description": "North-eastern part of the Sahara comprising desert areas in Egypt, Libya and Sudan",
                  "order": 3,
                  "wikidataId": "Q181528",
                  "geonameId": 353306
                },
                {
                  "name": "Libyan Plateau",
                  "description": "plateau in Libya",
                  "order": 5,
                  "wikidataId": "Q27489229",
                  "geonameId": 85417
                }
              ]
            }
        }
        
    
    }
    
    postHike(500,hike); 
    
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
      await agent.delete('/api/points');
      await agent.delete('/api/hiking/delete');
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
          "latitude": 54,
          "longitude": 90,
          "type": "fdsfds",
          "description": "suer",
          "city": "nonBiella",
          "province": "noBiella"
      },
      "endingPoint": {
          "latitude": 23,
          "longitude": 754,
          "type": "hut",
          "description": "hut located in a sure place",
          "city": "Ivrea",
          "province": "Torino"
      },
      "pointsOfInterest": [
          {
              "latitude": 5432,
              "longitude": 343,
              "type": "hut",
              "description": "well, hut",
              "city": "Alba",
              "province": "Cuneo"
          },
          {
              "latitude": 63,
              "longitude": 36,
              "type": "hut",
              "description": "warm hut where to drink something",
              "city": "Cuneo",
              "province": "Cuneo"
          }
      ]
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
          "latitude": 43,
          "longitude": 10,
          "type": "fdsfds",
          "description": "suer",
          "city": "nonBiella",
          "province": "noBiella"
      },
      "endingPoint": {
          "latitude": 543,
          "longitude": 4343,
          "type": "hut",
          "description": "hut located in a sus place",
          "city": "NANANANA",
          "province": "sus"
      },
      "pointsOfInterest": [
          {
              "latitude": 53223,
              "longitude": 6545,
              "type": "hut",
              "description": "well, hut",
              "city": "Alba",
              "province": "Cuneo"
          },
          {
              "latitude": 4354,
              "longitude": 4534,
              "type": "hut",
              "description": "warm huh where to drink something",
              "city": "Cuneo",
              "province": "Cuneo"
          }
      ]
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
          hike1ID = res.body.id;
      });

      await agent.get('/api/hikes').then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          res.body.length.should.equal(2);
          res.body[0].title.should.equal("hikone1");
      });
  });
}

function getHikeById(expectedHTTPStatus, hike1) {
  it('test getHikes', async () => {
      await agent.post('/api/hiking').send(hike1);

      await agent.get('/api/hike/'+`${hike1.id}`).then( function (res) {
          res.should.have.status(expectedHTTPStatus);
          res.body.length.should.equal(1);
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
          // res.body.should.eql([]);
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