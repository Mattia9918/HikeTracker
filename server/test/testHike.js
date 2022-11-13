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

