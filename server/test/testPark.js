const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const park_dao = require("../modules/dao/parkingdao.js");
const hike_dao = require("../modules/dao/hikedao.js");
const user_dao = require("../modules/dao/userdao.js");
const { app } = require("../index");
let agent = chai.request.agent(app);
const bcrypt = require("bcrypt");
const pwd = "password"

const localGuide = {
	name: "Mario",
	surname: "Rossi",
	username: "mariorossi1",
	email: "mario.rossi@mail.it",
	hash: "",
	salt: "",
	password: pwd,
	role: "localGuide",
  };

const park1 = {
    "parkID": 1,
	"name": "5 Guys",
	"guarded": 2,
	"parking_spaces": 11,
	"price_per_hour": 9,
	"disabled_parkings": 10,
	"timetable": "gunaydin",
	"parkingPoint": {
		"latitude": 23.1,
		"longitude": 84.1,
		"type": "parking lot",
		"description": "Welcome Dude!",
		"city": "Torino",
		"province": "Torino"
	}
};
const park2 = {
	"parkID": 2,
	"name": "4 Guys",
	"guarded": 4,
	"parking_spaces": 9,
	"price_per_hour": 11,
	"disabled_parkings": 21,
	"timetable": "iyi aksamlar",
	"parkingPoint": {
		"latitude": 23.1,
		"longitude": 84.1,
		"type": "parking lot",
		"description": "You are parking!",
		"city": "Torino",
		"province": "Torino"
	}
};

async function deleteTables() {
	await hike_dao.deletePoint();
	await user_dao.deleteUser();
	await park_dao.deleteParks(); 
  }
  
  async function insertUsers() {
   
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

describe("test api/parking (case success 20(0-4))", () => {
	beforeEach(async () => {
		await deleteTables();

		await insertUsers();

		await logUser("mario.rossi@mail.it", "password")
	});

    getParks(200, park1, park2);
});

function getParks(expectedHTTPStatus, park1, park2) {
	it("test getParks", async () => {
		await agent
			.post("/api/parking")
			.send(park1)
		await agent
			.post("/api/parking")
			.send(park2)

		await agent.get("/api/parking").then(function (res) {
            console.log(res.body);
			res.should.have.status(expectedHTTPStatus);
		
		});
	});
}
