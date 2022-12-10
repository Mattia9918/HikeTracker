"use strict";

const hike_dao = require("../modules/dao/hikedao.js");
const hut_dao = require("../modules/dao/hutdao");

const hut1 = {
	name: "Hut a Ivrea",
	address: "Via Ivrea",
	phone_number: "1111",
	email: "hut@mail.it",
	website: "www.hut.it",
	description: "un hut a Ivrea",
	altitude: 400,
	languages: "Inglese",
	bike_friendly: 0,
	reachability: "normal",
	disabled_services: 1,
	rooms: 10,
	bathrooms: 10,
	beds: 15,
	restaurant_service: 1,
};

const hut2 = {
	name: "Hut a Bra",
	address: "Via Bra",
	phone_number: "2222",
	email: "hut@mail.it",
	website: "www.hut.it",
	description: "un hut a Bra",
	altitude: 300,
	languages: "Francese",
	bike_friendly: 1,
	reachability: "foot",
	disabled_services: 1,
	rooms: 10,
	bathrooms: 10,
	beds: 15,
	restaurant_service: 1,
};

const hut3 = {
	name: "Altro Hut a Bra",
	address: "Via Bra 2",
	phone_number: "3333",
	email: "hut@mail.it",
	website: "www.hut.it",
	description: "un altro hut a Bra",
	altitude: 1500,
	languages: "Francese",
	bike_friendly: 0,
	reachability: "foot",
	disabled_services: 0,
	rooms: 0,
	bathrooms: 10,
	beds: 0,
	restaurant_service: 1,
};

const hut4 = {
	name: "Hut a Barolo",
	address: "Via Barolo 2",
	phone_number: "4444",
	email: "hut@mail.it",
	website: "www.hut.it",
	description: "un hut a Barolo",
	altitude: 3000,
	languages: "Inglese",
	bike_friendly: 1,
	reachability: "cable",
	disabled_services: 0,
	rooms: 0,
	bathrooms: 10,
	beds: 0,
	restaurant_service: 0,
};

const point1 = {
	latitude: 45.459,
	longitude: 7.873,
	type: "hut",
	province: "Torino",
	city: "Ivrea",
};

const point2 = {
	latitude: 44.704,
	longitude: 7.8567,
	type: "hut",
	province: "Cuneo",
	city: "Bra",
};

const point3 = {
	latitude: 44.704,
	longitude: 7.8567,
	type: "hut",
	province: "Cuneo",
	city: "Bra",
};

const point4 = {
	latitude: 44.61666,
	longitude: 7.933333,
	type: "hut",
	province: "Cuneo",
	city: "Barolo",
};

describe("test get huts and add filters", () => {
	beforeEach(async () => {
		await hike_dao.deletePoint();
		await hut_dao.deleteAllHuts();
		try {

			const point1_id = await hike_dao.postPointHut(point1);
			await hut_dao.postHut(hut1, point1_id);

			const point2_id = await hike_dao.postPointHut(point2);
			await hut_dao.postHut(hut2, point2_id);

			const point3_id = await hike_dao.postPointHut(point3);
			await hut_dao.postHut(hut3, point3_id);

			const point4_id = await hike_dao.postPointHut(point4);
			await hut_dao.postHut(hut4, point4_id);

		} catch (err) {
			console.log(err);
		}
	});

	testGetHuts();
	testGetHutById();
	testGetHutsByReachability();
	testGetHutsBikeFriendly();
	testGetHutsByProvince();
	testGetHutsByCity();
	testGetHutsWithDisabledService();
	testGetHutsWithRestaurant();
	testGetHutSByAltitude();
	testGetHutsWithBeds();
	testGetCities();
	testGetProvinces();
	testGetHutsByArea();
});

function testGetHutsByArea() {
	describe("Testing getHutByArea()", () => {
		test("4 huts posted -> get 4 huts by area", async () => {
			let res = await hut_dao.getHutByArea(
				"46.51855590677033,20.800781026482586",
				"38.70837508368838,4.101562276482583"
			);
			expect(res).toEqual([
				{
					id: 4,
					name: "Hut a Barolo",
					address: "Via Barolo 2",
					phone_number: "4444",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Barolo",
					altitude: 3000,
					languages: "Inglese",
					bike_friendly: 1,
					reachability: "cable",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 0,
					latitude: 44.61666,
					longitude: 7.933333,
					province: "Cuneo",
					city: "Barolo",
				},
				{
					id: 3,
					name: "Altro Hut a Bra",
					address: "Via Bra 2",
					phone_number: "3333",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un altro hut a Bra",
					altitude: 1500,
					languages: "Francese",
					bike_friendly: 0,
					reachability: "foot",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
				},
			]);
		});
	});
}

function testGetCities() {
	describe("Test getCities()", () => {
		test('4 huts posted -> get cities Ivrea, Bra, Barolo', async() => {
			let res = await hut_dao.getHutCities();
			expect(res).toEqual([
				{
					city: "Ivrea"
				},
				{
					city: "Bra"
				},
				{
					city: "Barolo"
				}
			])
		})
	})
}

function testGetProvinces() {
	describe("Test getProvinces()", () => {
		test('4 huts posted -> get provinces Torino, Cuneo', async() => {
			let res = await hut_dao.getHutProvinces();
			expect(res).toEqual([
				{
					province: "Torino"
				},
				{
					province: "Cuneo"
				}
			])
		})
	})
}

function testGetHuts() {
	describe("Testing getHuts()", () => {
		test("4 huts posted -> get these 4 huts", async () => {
			let res = await hut_dao.getHuts();
			expect(res).toEqual([
				{
					id: 4,
					name: "Hut a Barolo",
					address: "Via Barolo 2",
					phone_number: "4444",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Barolo",
					altitude: 3000,
					languages: "Inglese",
					bike_friendly: 1,
					reachability: "cable",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 0,
					latitude: 44.61666,
					longitude: 7.933333,
					province: "Cuneo",
					city: "Barolo",
					point_id: 4,
				},
				{
					id: 3,
					name: "Altro Hut a Bra",
					address: "Via Bra 2",
					phone_number: "3333",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un altro hut a Bra",
					altitude: 1500,
					languages: "Francese",
					bike_friendly: 0,
					reachability: "foot",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
					point_id: 3,
				},
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
					point_id: 2,
				},
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
					point_id: 1,
				},
			]);
		});
	});
}

function testGetHutById() {
	describe("Testing getHutById()", () => {
		test("get these hut with id 2", async () => {
			let res = await hut_dao.getHutById(2);
			expect(res).toEqual({
				id: 2,
				name: "Hut a Bra",
				address: "Via Bra",
				phone_number: "2222",
				email: "hut@mail.it",
				web_site: "www.hut.it",
				description: "un hut a Bra",
				altitude: 300,
				languages: "Francese",
				bike_friendly: 1,
				reachability: "foot",
				disabled_services: 1,
				rooms: 10,
				bathrooms: 10,
				beds: 15,
				restaurant_service: 1,
				latitude: 44.704,
				longitude: 7.8567,
				province: "Cuneo",
				city: "Bra",
				point_id: 2,
			});
		});
	});
}

function testGetHutsByReachability() {
	describe("Testing getHutsByReachability()", () => {
		test("4 huts posted -> get 2 huts reachable foot", async () => {
			let res = await hut_dao.getHutByReachability("foot");
			expect(res).toEqual([
				{
					id: 3,
					name: "Altro Hut a Bra",
					address: "Via Bra 2",
					phone_number: "3333",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un altro hut a Bra",
					altitude: 1500,
					languages: "Francese",
					bike_friendly: 0,
					reachability: "foot",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
			]);
		});
	});
}

function testGetHutsBikeFriendly() {
	describe("Testing getHutBikeFriendly()", () => {
		test("4 huts posted -> get 2 huts bike_friendly", async () => {
			let res = await hut_dao.getHutBikeFriendly();
			expect(res).toEqual([
				{
					id: 4,
					name: "Hut a Barolo",
					address: "Via Barolo 2",
					phone_number: "4444",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Barolo",
					altitude: 3000,
					languages: "Inglese",
					bike_friendly: 1,
					reachability: "cable",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 0,
					latitude: 44.61666,
					longitude: 7.933333,
					province: "Cuneo",
					city: "Barolo",
				},
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
			]);
		});
	});
}

function testGetHutsByProvince() {
	describe("Testing getHutByProvince()", () => {
		test("4 huts posted -> get 3 huts with province Cuneo", async () => {
			let res = await hut_dao.getHutByProvince("Cuneo");
			expect(res).toEqual([
				{
					id: 4,
					name: "Hut a Barolo",
					address: "Via Barolo 2",
					phone_number: "4444",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Barolo",
					altitude: 3000,
					languages: "Inglese",
					bike_friendly: 1,
					reachability: "cable",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 0,
					latitude: 44.61666,
					longitude: 7.933333,
					province: "Cuneo",
					city: "Barolo",
				},
				{
					id: 3,
					name: "Altro Hut a Bra",
					address: "Via Bra 2",
					phone_number: "3333",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un altro hut a Bra",
					altitude: 1500,
					languages: "Francese",
					bike_friendly: 0,
					reachability: "foot",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
			]);
		});
	});
}

function testGetHutsByCity() {
	describe("Testing getHutByCity()()", () => {
		test("4 huts posted -> get 1 hut with city Ivrea", async () => {
			let res = await hut_dao.getHutByCity("Ivrea");
			expect(res).toEqual([
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
				},
			]);
		});
	});
}

function testGetHutsWithDisabledService() {
	describe("Testing getHutWithDisabledService()", () => {
		test("4 huts posted -> get 2 huts with disabled services", async () => {
			let res = await hut_dao.getHutWithDisabledServices();
			expect(res).toEqual([
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
				},
			]);
		});
	});
}

function testGetHutsWithRestaurant() {
	describe("Testing getHutWithRestaurant()", () => {
		test("4 huts posted -> get 3 huts with restaurant service", async () => {
			let res = await hut_dao.getHutWithRestaurant();
			expect(res).toEqual([
				{
					id: 3,
					name: "Altro Hut a Bra",
					address: "Via Bra 2",
					phone_number: "3333",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un altro hut a Bra",
					altitude: 1500,
					languages: "Francese",
					bike_friendly: 0,
					reachability: "foot",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
				},
			]);
		});
	});
}

function testGetHutSByAltitude() {
	describe("Testing getHutByAltitude()", () => {
		test("4 huts posted -> get 2 huts with altitude between 350 and 2000", async () => {
			let res = await hut_dao.getHutByAltitude(350, 2000);
			expect(res).toEqual([
				{
					id: 3,
					name: "Altro Hut a Bra",
					address: "Via Bra 2",
					phone_number: "3333",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un altro hut a Bra",
					altitude: 1500,
					languages: "Francese",
					bike_friendly: 0,
					reachability: "foot",
					disabled_services: 0,
					rooms: 0,
					bathrooms: 10,
					beds: 0,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
				},
			]);
		});
	});
}

function testGetHutsWithBeds() {
	describe("Testing getHutWithBeds()", () => {
		test("4 huts posted -> get 2 huts with beds", async () => {
			let res = await hut_dao.getHutWithBeds();
			expect(res).toEqual([
				{
					id: 2,
					name: "Hut a Bra",
					address: "Via Bra",
					phone_number: "2222",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Bra",
					altitude: 300,
					languages: "Francese",
					bike_friendly: 1,
					reachability: "foot",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 44.704,
					longitude: 7.8567,
					province: "Cuneo",
					city: "Bra",
				},
				{
					id: 1,
					name: "Hut a Ivrea",
					address: "Via Ivrea",
					phone_number: "1111",
					email: "hut@mail.it",
					web_site: "www.hut.it",
					description: "un hut a Ivrea",
					altitude: 400,
					languages: "Inglese",
					bike_friendly: 0,
					reachability: "normal",
					disabled_services: 1,
					rooms: 10,
					bathrooms: 10,
					beds: 15,
					restaurant_service: 1,
					latitude: 45.459,
					longitude: 7.873,
					province: "Torino",
					city: "Ivrea",
				},
			]);
		});
	});
}
