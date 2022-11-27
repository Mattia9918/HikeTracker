const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const parkDao = require("../modules/dao/parkingdao.js");
const hikeDao = require("../modules/dao/hikedao.js");
const { app } = require("../index");
var agent = chai.request.agent(app);

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

describe("test api/parking (case success 20(0-4))", () => {
	beforeEach(async () => {
		await hikeDao.deletePointCCs();
        await parkDao.deleteParks();
	});



    getParks(200, park1, park2);
	// getHutsByAltitude(200, hut1, hut2, 300);
	// getHutsByResturantService(200, hut1, hut2);
	// getHutsByBikeFriendly(200, hut1, hut2);
	// getHutsByDIsabledService(200, hut1, hut2);
	// getHutsByCity(200, hut1, hut2, "Bra");
	// getHutsByProvince(200, hut1, hut2, "Cuneo");
	// getHutsByBeds(200, hut1, hut2, 2);
	// getHutsByReachability(200, hut1, hut2, "By Car");

});

function getParks(expectedHTTPStatus, park1, park2) {
	it("test getParks", async () => {
		let parkID1, parkID2;
		await agent
			.post("/api/parking")
			.send(park1)
			.then(function (res) {
				parkID1 = res.body.id;
                console.log(parkID1);
			});
		await agent
			.post("/api/parking")
			.send(park2)
			.then(function (res) {
				parkID2 = res.body.id;
			});

		await agent.get("/api/parking").then(function (res) {
            console.log(res.body);
			res.should.have.status(expectedHTTPStatus);
		
		});
	});
}

/*
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
*/