const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const parkDao = require("../modules/dao/parkdao.js");
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
    "point_id": 1,
    "latitude": 45.459,
    "longitude": 7.873,
    "type": "hut",
    "pointDescription": "descrizione",
    "city": "Ivrea",
    "province": "Torino"
};
const park2 = {
	"parkID": 2,
  "name": "4 Guys",
  "guarded": 4,
  "parking_spaces": 9,
  "price_per_hour": 11,
  "disabled_parkings": 21,
  "timetable": "iyi aksamlar",
  "point_id": 2,
  "latitude": 44.704,
  "longitude": 7.8567,
  "type": "hut",
  "pointDescription": "descrizione",
  "city": "Bra",
  "province": "Cuneo"
};

describe("test api/parking (case success 20(0-4))", () => {
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