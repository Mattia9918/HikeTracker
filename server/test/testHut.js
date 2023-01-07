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
const pwd = "password";

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
	name: "Hut a Ivrea",
	address: "Via Ivrea",
	phone_number: "1111",
	email: "hut@mail.it",
	website: "www.hut.it",
	description: "un hut a Ivrea",
	altitude: 400,
	languages: "English",
	bike_friendly: false,
	reachability: "With normal car",
	disabled_services: true,
	rooms: 10,
	bathrooms: 10,
	beds: 15,
	restaurant_services: true,
};
const point1 = {
	latitude: 45.459,
	longitude: 7.873,
	city: "Ivrea",
	province: "Torino",
};
const hut2 = {
	name: "Hut a Bra",
	address: "Via Bra",
	phone_number: "2222",
	email: "hut@mail.it",
	website: "www.hut.it",
	description: "un hut a Bra",
	altitude: 300,
	languages: "French",
	bike_friendly: true,
	reachability: "On foot",
	disabled_services: true,
	rooms: 10,
	bathrooms: 10,
	beds: 15,
	restaurant_services: true,
};
const point2 = {
	latitude: 44.704,
	longitude: 7.8567,
	city: "Bra",
	province: "Cuneo",
};

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
	getHutsByRestaurantService(200);
	getHutsByBikeFriendly(200);
	getHutsByDisabledService(200);
	getHutsByCity(200, "Bra");
	getHutsByProvince(200, "Cuneo");
	getHutsByBeds(200);
	getHutsByReachability(200, "With normal car");
	getHutsByArea(200, "46,8", "43,6");
});

function getHuts(expectedHTTPStatus) {
	it("test getHuts", async () => {
		await agent.get("/api/huts").then(function (res) {
			res.should.have.status(expectedHTTPStatus);
			res.body.length.should.equal(2);
		});
	});
}

function getHutsByAltitude(expectedHTTPStatus, minAltitude) {
	it("test get by altitude", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "altitude",
				value1: minAltitude
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(0);
	});
}

function getHutsByRestaurantService(expectedHTTPStatus) {
	it("test get with restaurant service", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "restaurant_service"
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(0);
	});
}

function getHutsByDisabledService(expectedHTTPStatus) {
	it("test get with disabled services", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "disabled_services"
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(2);
	});
}

function getHutsByBikeFriendly(expectedHTTPStatus) {
	it("test get bike friendly", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "bike_friendly"
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(1);
	});
}

function getHutsByCity(expectedHTTPStatus, city) {
	it("test get by city", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "city",
				value1: city
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(1);
	});
}

function getHutsByProvince(expectedHTTPStatus, province) {
	it("test get by province", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "province",
				value1: province
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(1);
	});
}

function getHutsByBeds(expectedHTTPStatus) {
	it("test get with beds", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "beds"
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(2);
	});
}

function getHutsByReachability(expectedHTTPStatus, reach) {
	it("test get by reachability", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "reachability",
				value1: reach
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(1);
	});
}

function getHutsByArea(expectedHTTPStatus, coor1, coor2) {
	it("test get by area", async () => {
		const res = await agent.post("/api/huts/filter").send(
			[
			  {
				filterName: "area",
				value1: coor1,
				value2: coor2
			  }
			]
		  );
		  
		res.should.have.status(expectedHTTPStatus);
		res.body.length.should.equal(2);
	});
}
