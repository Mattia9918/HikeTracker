const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const hut_dao = require("../modules/dao/hutdao.js");
const hike_dao = require("../modules/dao/hikedao.js");
const user_dao = require("../modules/dao/userdao.js");
const bcrypt = require("bcrypt");
const { app } = require("../index");
let agent = chai.request.agent(app);
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

const hut1 = {
	"name": "Hut a Ivrea",
	"address": "Via Ivrea",
	"phone_number": "1111",
	"email": "hut@mail.it",
	"website": "www.hut.it",
	"description": "un hut a Ivrea",
	"altitude": 400,
	"languages": "Inglese",
	"bike_friendly": 0,
	"reachability": "normal",
	"disabled_services": 1,
	"rooms": 10,
	"bathrooms": 10,
	"beds": 15,
	"restaurant_services": 1
};
const point1 = {
	"latitude": 45.459,
	"longitude": 7.873,
	"city": "Ivrea",
	"province": "Torino", 
}
const hut2 = {
	"name": "Hut a Bra",
	"address": "Via Bra",
	"phone_number": "2222",
	"email": "hut@mail.it",
	"website": "www.hut.it",
	"description": "un hut a Bra",
	"altitude": 300,
	"languages": "Francese",
	"bike_friendly": 1,
	"reachability": "foot",
	"disabled_services": 1,
	"rooms": 10,
	"bathrooms": 10,
	"beds": 15,
	"restaurant_services": 1
};
const point2 = {
	"latitude": 44.704,
	"longitude": 7.8567,
	"city": "Bra",
	"province": "Cuneo",
}

async function deleteTables() {
	await hike_dao.deletePoint();
	await user_dao.deleteUser();
	await hut_dao.deleteAllHuts(); 
  
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

describe("test api/huts (case success 200)", () => {
	before(async () => {
		// delete tables hut, point, user
		await deleteTables();

		await insertUsers();

		await logUser("mario.rossi@mail.it", "password");
		
		await agent.post("/api/hut").send({ hut: hut1, point: point1 });
    	await agent.post("/api/hut").send({ hut: hut2, point: point2 });
	});



    getHuts(200);
	getHutsByAltitude(200, 300);
	getHutsByResturantService(200);
	getHutsByBikeFriendly(200);
	getHutsByDIsabledService(200);
	getHutsByCity(200, "Bra");
	getHutsByProvince(200, "Cuneo");
	getHutsByBeds(200, 2);
	getHutsByReachability(200, "normal");

});

function getHuts(expectedHTTPStatus) {
	it("test getHuts", async () => {

		await agent.get("/api/huts").then(function (res) {
            res.should.have.status(expectedHTTPStatus);
			res.body.length.should.equal(2);
		});
	});
}

function getHutsByAltitude(expectedHTTPStatus, minALtitude) {
	it('test get by altitude', async () => {

			await agent.get(`/api/huts?filter=altitude&value1=${minALtitude}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByResturantService(expectedHTTPStatus) {
	it('test get by altitude', async () => {
			await agent.get(`/api/huts?filter=resturant_service&value1=true`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByDIsabledService(expectedHTTPStatus) {
	it('test get by disabled service', async () => {
		await agent.get(`/api/huts?filter=disabled_services&value1=true`).then( function (res) {
			res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByBikeFriendly(expectedHTTPStatus) {
	it('test get by bike friendly', async () => {
			await agent.get(`/api/huts?filter=bike_friendly&value1=true`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByCity(expectedHTTPStatus, city) {
	it('test get by city', async () => {
			await agent.get(`/api/huts?filter=city&value1=${city}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByProvince(expectedHTTPStatus, province) {
	it('test get by province', async () => {
			await agent.get(`/api/huts?filter=province&value1=${province}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByBeds(expectedHTTPStatus, minBeds) {
	it('test get by beds', async () => {
			await agent.get(`/api/huts?filter=beds&value1=${minBeds}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByReachability(expectedHTTPStatus, reach) {
	it('test get by reachability', async () => {

			await agent.get(`/api/huts?filter=reach&value1=${reach}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}



