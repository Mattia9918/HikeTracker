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
	reachability: "With normal car",
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
	reachability: "On foot",
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
	reachability: "On foot",
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
	reachability: "Cableway",
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
		await hut_dao.deleteHikeLinkedHut();
		try {

			const point1_id = await hike_dao.postPointHut(point1);
			const hut1_id = await hut_dao.postHut(hut1, point1_id);
			await hut_dao.insertHutImg(hut1_id, "hut1.jpg");

			const point2_id = await hike_dao.postPointHut(point2);
			const hut2_id = await hut_dao.postHut(hut2, point2_id);
			await hut_dao.insertHutImg(hut2_id, "hut2.jpg");

			const point3_id = await hike_dao.postPointHut(point3);
			const hut3_id = await hut_dao.postHut(hut3, point3_id);
			await hut_dao.insertHutImg(hut3_id, "hut3.jpg");

			const point4_id = await hike_dao.postPointHut(point4);
			const hut4_id = await hut_dao.postHut(hut4, point4_id);
			await hut_dao.insertHutImg(hut4_id, "hut4.jpg");

			await hike_dao.postHike_Point(5,"hut", point2_id);

			await hike_dao.postHike_Point(6,"hut", point4_id);

		} catch (err) {
			console.log(err);
		}
	});

	testGetHuts();
	testGetHutById();
	testGetHutsLinkedHike();
	testGetHutsLinkedHikeById();
	testGetCities();
	testGetProvinces();
	testUpdateHutImg(1, "hut10.jpg")
});

function testUpdateHutImg(id, imgPath) {
	describe("Testing insertImg()", () => {
		test("Update hut img", async () => {
			await hut_dao.insertHutImg(id, imgPath)
			const h = await hut_dao.getHutById(id)
			expect(h.imgPath).toEqual(imgPath);
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
					reachability: "Cableway",
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
					imgPath: "hut4.jpg"
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
					reachability: "On foot",
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
					imgPath: "hut3.jpg"
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
					reachability: "On foot",
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
					imgPath: "hut2.jpg"
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
					reachability: "With normal car",
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
					imgPath: "hut1.jpg"
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
				reachability: "On foot",
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
				imgPath: "hut2.jpg"
			});
		});
	});
}

function testGetHutsLinkedHike() {
	describe("Testing getHutsLinkedHike()", () => {
		test("get these hutsLinked", async () => {
			let res = await hut_dao.getHutsLinkedHike();
			expect(res).toEqual([{
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
				reachability: "On foot",
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
				imgPath: "hut2.jpg"
			},
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
				reachability: "Cableway",
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
				imgPath: "hut4.jpg"
			}]);
		});
	});
}

function testGetHutsLinkedHikeById() {
	describe("Testing getHutsLinkedHikeByID()", () => {
		test("get hutsLinked with ID", async () => {
			let res = await hut_dao.getHutLinkedToHikeById(2);
			expect(res).toEqual({
				HikeID: 5,
				HutID:2,
				PointID:2,
				name: "Hut a Bra",
				address: "Via Bra",
				phone_number: "2222",
				email: "hut@mail.it",
				web_site: "www.hut.it",
				description: "un hut a Bra",
				altitude: 300,
				languages: "Francese",
				bike_friendly: 1,
				reachability: "On foot",
				disabled_services: 1,
				rooms: 10,
				bathrooms: 10,
				beds: 15,
				restaurant_service: 1,
				latitude: 44.704,
				longitude: 7.8567,
				province: "Cuneo",
				city: "Bra",
				type: "hut",
				imgPath: "hut2.jpg"
			});
		});
	});
}
