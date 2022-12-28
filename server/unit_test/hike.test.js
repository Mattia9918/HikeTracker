const hike_dao = require("../modules/dao/hikedao.js");
const user_dao = require("../modules/dao/userdao.js");

const hike1 = {
	id: undefined,
	title: "Hike1",
	length: 10,
	description: "I'm Hike1!",
	difficulty: "Easy",
	estimatedTime: "1",
	ascent: 120,
	localguideID: 1,
	imgPath: "hike1.jpg"
};
const hike2 = {
	id: undefined,
	title: "Hike2",
	length: 20,
	description: "I'm Hike2!",
	difficulty: "Average",
	estimatedTime: "2",
	ascent: 400,
	localguideID: 2,
	imgPath: "hike2.jpg"
};

const hike3 = {
	id: undefined,
	title: "Hike3",
	length: 30,
	description: "I'm Hike3!",
	difficulty: "Difficult",
	estimatedTime: "3",
	ascent: 800,
	localguideID: 1,
	imgPath: "hike3.jpg"
};

const hike4 = {
	id: undefined,
	title: "Hike4",
	length: 40,
	description: "I'm Hike4!",
	difficulty: "Easy",
	estimatedTime: "4",
	ascent: 1500,
	localguideID: 2,
	imgPath: "hike4.jpg"
};

const point1 = {
	latitude: 1.1,
	longitude: 2.1,
	type: "point",
	locality: "Torino",
	localityInfo: {
		administrative: [{}, {}, { name: "Torino" }],
	},
};

const point2 = {
	latitude: 3.1,
	longitude: 4.1,
	type: "point",
	locality: "Torino",
	localityInfo: {
		administrative: [{}, {}, { name: "Torino" }],
	},
};

const point3 = {
	latitude: 5.1,
	longitude: 6.1,
	type: "point",
	locality: "Grugliasco",
	localityInfo: {
		administrative: [{}, {}, { name: "Torino" }],
	},
};

const point4 = {
	latitude: 7.1,
	longitude: 8.1,
	type: "point",
	locality: "Grugliasco",
	localityInfo: {
		administrative: [{}, {}, { name: "Torino" }],
	},
};

const localguide1 = {
	id: undefined,
	email: "lg1@polito.it",
	hash: "foo",
	salt: "foo",
	role: "local guide",
	username: "Francescone",
	isActive: 1,
	name: "Francescone",
	surname: "Bianchi",
};

const localguide2 = {
	id: undefined,
	email: "lg2@polito.it",
	hash: "foo",
	salt: "foo",
	role: "local guide",
	username: "Franceschino",
	isActive: 1,
	name: "Franceschino",
	surname: "Neri",
};

const gpx1 = {
	hikeID: undefined,
	gpxfile: "111100 111111",
};

describe("test hikes and filtering", () => {
	beforeEach(async () => {
		await user_dao.deleteUser();
		await hike_dao.deleteHikes();
		await hike_dao.deletePoint();
		await hike_dao.deleteHike_Point();
		await hike_dao.deleteGpx();

		try {
			const id1 = await hike_dao.createHiking(
				hike1.title,
				hike1.length,
				hike1.description,
				hike1.difficulty,
				hike1.estimatedTime,
				hike1.ascent,
				hike1.localguideID
			);
			await hike_dao.insertImg(id1, hike1.imgPath);
			const id2 = await hike_dao.createHiking(
				hike2.title,
				hike2.length,
				hike2.description,
				hike2.difficulty,
				hike2.estimatedTime,
				hike2.ascent,
				hike2.localguideID
			);
			await hike_dao.insertImg(id2, hike2.imgPath);
			const id3 = await hike_dao.createHiking(
				hike3.title,
				hike3.length,
				hike3.description,
				hike3.difficulty,
				hike3.estimatedTime,
				hike3.ascent,
				hike3.localguideID
			);
			await hike_dao.insertImg(id3, hike3.imgPath);
			const id4 = await hike_dao.createHiking(
				hike4.title,
				hike4.length,
				hike4.description,
				hike4.difficulty,
				hike4.estimatedTime,
				hike4.ascent,
				hike4.localguideID
			);
			await hike_dao.insertImg(id4, hike4.imgPath);
			await hike_dao.postPoint(point1);
			await hike_dao.postPoint(point2);
			await hike_dao.postPoint(point3);
			await hike_dao.postPoint(point4);
			await hike_dao.postHike_Point(1, "start", 1);
			await hike_dao.postHike_Point(1, "arrive", 2);
			await hike_dao.postHike_Point(2, "start", 3);
			await hike_dao.postHike_Point(2, "arrive", 4);
			await hike_dao.postHike_Point(3, "start", 1);
			await hike_dao.postHike_Point(3, "arrive", 2);
			await hike_dao.postHike_Point(4, "start", 3);
			await hike_dao.postHike_Point(4, "arrive", 4);
			await user_dao.insertUser(localguide1);
			await user_dao.insertUser(localguide2);
			await hike_dao.saveFile(gpx1.gpxfile);
		} catch (err) {
			console.log(err);
		}
	});

	testGetHikes();
	testSaveFile();
	testGetFileContentById(1);
	testGetGpxInfo("./unit_test/testfile.gpx");
	testGetHikeCities();
	testGetHikeProvinces();
	testGetHikeById();
	testUpdateHikePoint(1, 1, "start");
	testInsertImg(1, "hike5.jpg")
});

function testGetHikes() {
	describe("Testing getHikes()", () => {
		test("4 hikes posted -> get these 4 hikes", async () => {
			let res = await hike_dao.getHikes();
			expect(res).toEqual([
				{
					id: 4,
					title: "Hike4",
					length: 40,
					description: "I'm Hike4!",
					difficulty: "Easy",
					estimatedTime: "4",
					ascent: 1500,
					localguideID: 2,
					localguideUsername: "Franceschino",
					imgPath: "hike4.jpg",
					startingPoint: {
						latitude: 5.1,
						longitude: 6.1,
						type: "point",
						city: "Grugliasco",
						province: "Torino",
					},
					endingPoint: {
						latitude: 7.1,
						longitude: 8.1,
						type: "point",
						city: "Grugliasco",
						province: "Torino",
					},
					pointsOfInterest: [],
				},
				{
					id: 3,
					title: "Hike3",
					length: 30,
					description: "I'm Hike3!",
					difficulty: "Difficult",
					estimatedTime: "3",
					ascent: 800,
					localguideID: 1,
					localguideUsername: "Francescone",
					imgPath: "hike3.jpg",
					startingPoint: {
						latitude: 1.1,
						longitude: 2.1,
						type: "point",
						city: "Torino",
						province: "Torino",
					},
					endingPoint: {
						latitude: 3.1,
						longitude: 4.1,
						type: "point",
						city: "Torino",
						province: "Torino",
					},
					pointsOfInterest: [],
				},
				{
					id: 2,
					title: "Hike2",
					length: 20,
					description: "I'm Hike2!",
					difficulty: "Average",
					estimatedTime: "2",
					ascent: 400,
					localguideID: 2,
					localguideUsername: "Franceschino",
					imgPath: "hike2.jpg",
					startingPoint: {
						latitude: 5.1,
						longitude: 6.1,
						type: "point",
						city: "Grugliasco",
						province: "Torino",
					},
					endingPoint: {
						latitude: 7.1,
						longitude: 8.1,
						type: "point",
						city: "Grugliasco",
						province: "Torino",
					},
					pointsOfInterest: [],
				},
				{
					id: 1,
					title: "Hike1",
					length: 10,
					description: "I'm Hike1!",
					difficulty: "Easy",
					estimatedTime: "1",
					ascent: 120,
					localguideID: 1,
					localguideUsername: "Francescone",
					imgPath: "hike1.jpg",
					startingPoint: {
						latitude: 1.1,
						longitude: 2.1,
						type: "point",
						city: "Torino",
						province: "Torino",
					},
					endingPoint: {
						latitude: 3.1,
						longitude: 4.1,
						type: "point",
						city: "Torino",
						province: "Torino",
					},
					pointsOfInterest: [],
				},
			]);
		});
	});
}

function testSaveFile() {
	describe("Testing saveFile(gpxbinary)", () => {
		test("Posting a gpx as a blob", async () => {
			let gpx2 = {
				hikeID: undefined,
				gpxfile: "111111 000111",
			};
			await hike_dao.saveFile(gpx2.gpxfile);
			let res = await hike_dao.getFileContentById(2);
			expect(res).toEqual({
				gpxfile: "111111 000111",
			});
		});
	});
}

function testGetFileContentById(id) {
	describe("Testing getContentById(id)", () => {
		test("Getting a specific gpxfile of given id", async () => {
			let res = await hike_dao.getFileContentById(id);
			expect(res).toEqual({
				gpxfile: "111100 111111",
			});
		});
	});
}

function testGetGpxInfo(file) {
	describe("Testing getGpxInfo(file)", () => {
		test("Getting gpx info given gpx file", async () => {
			let res = hike_dao.getGpxInfo(file);
			expect(res).toEqual({
				endingPoint: {
					latitude: 45.295813,
					longitude: 7.395708,
				},
				startingPoint: {
					latitude: 45.313864,
					longitude: 7.30556,
				},
				totalAscent: -393.20000000000005,
				totalDistance: 13.40820509184726,
				difficulty: "Difficult",
			});
		});
	});
}

function testGetHikeCities() {
	describe("Testing getHikeCities()", () => {
		test("Getting the list of cities where there's a hike starting point", async () => {
			const hike5 = {
				id: undefined,
				title: "Hike5!",
				length: 20,
				description: "I'm Hike5!",
				difficulty: "Easy",
				estimatedTime: "3",
				ascent: 1100,
				localguideID: 2,
			};

			const point5 = {
				latitude: 5.0,
				longitude: 6.0,
				type: "point",
				locality: "Alba",
				localityInfo: {
					administrative: [{}, {}, { name: "Provincia di Cuneo" }],
				},
			};

			const point6 = {
				latitude: 7.0,
				longitude: 8.0,
				type: "point",
				locality: "Biella",
				localityInfo: {
					administrative: [{}, {}, { name: "Provincia di Biella" }],
				},
			};
			await hike_dao.createHiking(
				hike5.title,
				hike5.length,
				hike5.description,
				hike5.difficulty,
				hike5.estimatedTime,
				hike5.ascent,
				hike5.localguideID
			);
			await hike_dao.postPoint(point5);
			await hike_dao.postPoint(point6);
			await hike_dao.postHike_Point(5, "start", 5);
			await hike_dao.postHike_Point(5, "arrive", 6);
			let res = await hike_dao.getHikeCities();
			expect(res).toEqual([
				{ city: "Torino" },
				{ city: "Grugliasco" },
				{ city: "Alba" },
			]);
		});
	});
}

function testGetHikeProvinces() {
	describe("Testing getHikeProvinces()", () => {
		test("Getting the list of provinces where there's a hike starting point", async () => {
			const hike5 = {
				id: undefined,
				title: "Hike5!",
				length: 20,
				description: "I'm Hike5!",
				difficulty: "Easy",
				estimatedTime: "3",
				ascent: 1100,
				localguideID: 2,
			};

			const point5 = {
				latitude: 5.0,
				longitude: 6.0,
				type: "point",
				locality: "Alba",
				localityInfo: {
					administrative: [{}, {}, { name: "Provincia di Cuneo" }],
				},
			};

			const point6 = {
				latitude: 7.0,
				longitude: 8.0,
				type: "point",
				locality: "Biella",
				localityInfo: {
					administrative: [{}, {}, { name: "Provincia di Biella" }],
				},
			};
			await hike_dao.createHiking(
				hike5.title,
				hike5.length,
				hike5.description,
				hike5.difficulty,
				hike5.estimatedTime,
				hike5.ascent,
				hike5.localguideID
			);
			await hike_dao.postPoint(point5);
			await hike_dao.postPoint(point6);
			await hike_dao.postHike_Point(5, "start", 5);
			await hike_dao.postHike_Point(5, "arrive", 6);
			let res = await hike_dao.getHikeProvinces();
			expect(res).toEqual([
				{ province: "Torino" },
				{ province: "Provincia di Cuneo" },
			]);
		});
	});
}

function testUpdateHikePoint(hikeId, pointId, type) {
	describe("Testing updateHikePoint()", () => {
		test("Update Hike Start point", async () => {
			let res = await hike_dao.updateHikePoint(hikeId, pointId, type);
			expect(res).toEqual(hikeId);
		});
	});
}

function testGetHikeById() {
	describe("Testing getHikeById()", () => {
		test("Testing get Hike by Id getting the hike with id = 1", async () => {
			let res = await hike_dao.getHikeById(1);
			expect(res).toEqual({
				id: 1,
				title: "Hike1",
				length: 10,
				description: "I'm Hike1!",
				difficulty: "Easy",
				estimatedTime: "1",
				ascent: 120,
				localguideID: 1,
				imgPath: "hike1.jpg",
			});
		});
	});
}

function testInsertImg(hikeId, imgPath) {
	describe("Testing insertImg()", () => {
		test("Update hike img", async () => {
			await hike_dao.insertImg(hikeId, imgPath)
			const h = await hike_dao.getHikeById(hikeId)
			expect(h.imgPath).toEqual(imgPath);
		});
	});
}
