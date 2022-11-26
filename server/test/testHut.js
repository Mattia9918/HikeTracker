const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const hutDao = require("../modules/dao/hutdao.js");
const hikeDao = require("../modules/dao/hikedao.js");
const { app } = require("../index");
var agent = chai.request.agent(app);

const hut1 = {
	"name": "Hut a Ivrea",
	"address": "Via Ivrea",
	"phone_number": "1111",
	"email": "hut@mail.it",
	"website": "www.hut.it",
	"description": "un hut a Ivrea",
	"latitude": 45.459,
	"longitude": 7.873,
	"city": "Ivrea",
	"province": "Torino",
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
const hut2 = {
	"name": "Hut a Bra",
	"address": "Via Bra",
	"phone_number": "2222",
	"email": "hut@mail.it",
	"website": "www.hut.it",
	"description": "un hut a Bra",
	"latitude": 44.704,
	"longitude": 7.8567,
	"city": "Bra",
	"province": "Cuneo",
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

describe("test api/huts (case success 200)", () => {
	beforeEach(async () => {
		await hutDao.deleteAllHuts();
		await hikeDao.deletePoint();
	});



    getHuts(200, hut1, hut2);
	getHutsByAltitude(200, hut1, hut2, 300);
	getHutsByResturantService(200, hut1, hut2);
	getHutsByBikeFriendly(200, hut1, hut2);
	getHutsByDIsabledService(200, hut1, hut2);
	getHutsByCity(200, hut1, hut2, "Bra");
	getHutsByProvince(200, hut1, hut2, "Cuneo");
	getHutsByBeds(200, hut1, hut2, 2);
	getHutsByReachability(200, hut1, hut2, "By Car");

});

function getHuts(expectedHTTPStatus, hut1, hut2) {
	it("test getHuts", async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

		await agent.get("/api/huts").then(function (res) {
            console.log(res.body);
			res.should.have.status(expectedHTTPStatus);
			res.body.length.should.equal(2);
			res.body[0].name.should.equal("Hut a Ivrea");
		});
	});
}

function getHutsByAltitude(expectedHTTPStatus, hut1, hut2, minALtitude) {
	it('test get by altitude', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=altitude&value1=${minALtitude}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByResturantService(expectedHTTPStatus, hut1, hut2) {
	it('test get by altitude', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=resturant_service&value1=true`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByDIsabledService(expectedHTTPStatus, hut1, hut2) {
	it('test get by disabled service', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=disabled_services&value1=true`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByBikeFriendly(expectedHTTPStatus, hut1, hut2) {
	it('test get by bike friendly', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=bike_friendly&value1=true`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByCity(expectedHTTPStatus, hut1, hut2, city) {
	it('test get by city', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=city&value1=${city}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByProvince(expectedHTTPStatus, hut1, hut2, province) {
	it('test get by province', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=province&value1=${province}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByBeds(expectedHTTPStatus, hut1, hut2, minBeds) {
	it('test get by province', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=beds&value1=${minBeds}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}

function getHutsByReachability(expectedHTTPStatus, hut1, hut2, reach) {
	it('test get by province', async () => {
		let hutID1, hutID2;
		await agent
			.post("/api/hut")
			.send(hut1)
			.then(function (res) {
				hutID1 = res.body.id;
                console.log(hutID1);
			});
		await agent
			.post("/api/hut")
			.send(hut2)
			.then(function (res) {
				hutID2 = res.body.id;
			});

			await agent.get(`/api/huts?filter=reach&value1=${reach}`).then( function (res) {
				res.should.have.status(expectedHTTPStatus);
	});
});
}



