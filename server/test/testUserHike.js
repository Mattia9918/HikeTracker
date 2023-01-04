const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const hike_dao = require('../modules/dao/hikedao.js');
const user_dao = require('../modules/dao/userdao.js');
const { app } = require('../index');
let agent = chai.request.agent(app);
const bcrypt = require("bcrypt");

const dateTime = "2023-01-02T17:54:44"; 
const hikerId=1;
const pwd = "password"

const hiker = {
  name: "Giulia",
  surname: "Brambilla",
  username: "giuliabra",
  email: "giulia.brambilla@mail.it",
  hash: "",
  salt: "",
  password: pwd,
  role: "hiker",
};


const hike = {
    id:1,
    title:"Rifugio Bertorello",
    length:2.81,
    description:"The road to the Bertorello refuge, always wide and easy to follow, does not present particular difficulties.",
    difficulty:"Easy",
    estimatedTime:"0.5",
    ascent:198.0,
    localguideID:1,
    imgPath:"hike1.jpg",

}

const hike_point_start = {
    hikeID:1,
    type:"start",
    pointID:1
}
const hike_point_arrive = {
    hikeID:1,
    type:"arrive",
    pointID:2
}

const point_start ={
    latitude:44.645612034,
    longitude:7.256143788,
    locality:"Paesana",
    localityInfo:{
        administrative:[
            {},{},{name:"Provincia di Cuneo"}
        ]
    }
}

const point_arrive ={
    latitude:44.636650121,
    longitude:7.245265664,
    locality:"Paesana",
    localityInfo:{
        administrative:[
            {},{},{name:"Provincia di Cuneo"}
        ]
    }
}

async function deleteTables() {
    await hike_dao.deleteHike_Point();
    await hike_dao.deleteHikes();
    await hike_dao.deletePoint();
    await user_dao.deleteUser(); 
    await hike_dao.deleteHikeUser();
  }
  
async function insertHiker() {

    hiker.salt = await bcrypt.genSalt(10);
    hiker.hash = await bcrypt.hash(hiker.password, hiker.salt);

    await user_dao.insertUser(hiker);
    await user_dao.activateUser(hiker.email);
}

async function logUser(email, password) {
    await agent
        .post("/api/sessions")
        .send({ username: email, password: password });
}
  
const logoutUser = async()=> await agent.delete("/api/sessions/current");
  
async function createHike(){

    //insert Hike
    hike_dao.createHiking(hike.title,hike.length, hike.description,hike.difficulty, hike.estimatedTime, hike.ascent, hike.localguideID);

    //insert starting and ending point of hike 
    hike_dao.postPoint(point_start);
    hike_dao.postPoint(point_arrive);


    //insert hike_point (start,arrive)
    hike_dao.postHike_Point(hike_point_start.hikeID, hike_point_start.type, hike_point_start.pointID);

    hike_dao.postHike_Point(hike_point_arrive.hikeID, hike_point_arrive.type, hike_point_arrive.pointID);

}

//start record hike 
describe('test post /api/hike/:id/record', () => {


    before(async ()=>{
        // delete tables hike, point, hike_point and user
        await deleteTables();

        // create user
        await insertHiker();

        // log hiker
        await logUser("giulia.brambilla@mail.it", "password");

        await createHike();
    }); 

    //TIME EMPTY => VALIDATION ERROR 422  
    startRecordHike(422,"",hike.id);
    
    //DATE NOT VALID => VALIDATION ERROR 422   
    startRecordHike(422,dateTime+"a",hike.id);

    //HIKE ID NOT VALID => HIKE NOT PRESENT => 404 NOT FOUND 
    startRecordHike(404,dateTime,hike.id+1); 
    
    //SUCCESS 201 
    startRecordHike(201,dateTime,hike.id); 
 
    //USER TRY TO START ANOTHER HIKE => 403 you must terminate all ongoing hikes before starting a new one
    startRecordHike(403,dateTime,hike.id); 
 
    
});

//start record hike 
function startRecordHike(expectedHTTPStatus, dateTime, hikeId) {
    it('test post /api/hike/:id/record', async () => {
        await agent.post(`/api/hike/${hikeId}/record`)
            .send({
				time: dateTime,
			})
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);  
            }); 

    })
}


//end record hike 
describe('test put /api/hike/:id/record', () => {


    before(async ()=>{
        // delete tables hike, point, hike_point and user
        await deleteTables();

        // create user
        await insertHiker();

        // log hiker
        await logUser("giulia.brambilla@mail.it", "password");

        await createHike();

        await hike_dao.startHikeByUser(hikerId,hike.id,dateTime);

    }); 

    //TIME EMPTY => VALIDATION ERROR 422  
    endRecordHike(422,"",hike.id);
 
    //DATE NOT VALID => VALIDATION ERROR 422   
    endRecordHike(422,dateTime+"a",hike.id);


    //HIKE NOT RECORDED => 404 NOT FOUND   
    endRecordHike(404,dateTime,hike.id+1);
    
    //SUCCESS OK 
    endRecordHike(200,dateTime,hike.id);

    //TRY TO UPDATE COMPLETED USER HIKE => 403 
    endRecordHike(403,dateTime,hike.id);

});

//end record hike 
function endRecordHike(expectedHTTPStatus, dateTime, hikeId) {
    it('test post /api/hike/:id/record', async () => {
        await agent.put(`/api/hike/${hikeId}/record`)
            .send({
				time: dateTime,
			})
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);  
            }); 

    })
}


