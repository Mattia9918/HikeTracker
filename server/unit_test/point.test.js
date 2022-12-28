const hike_dao = require("../modules/dao/hikedao.js");
const point = require("../modules/dao/pointdao.js");

const hike1 = {
	id: undefined,
	title: "Hike1",
	length: 10,
	description: "I'm Hike1!",
	difficulty: "Easy",
	estimatedTime: "1",
	ascent: 120,
	localguideID: 1,
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
	latitude: 5.1,
	longitude: 6.1,
	type: "point",
	locality: "Grugliasco",
	localityInfo: {
		administrative: [{}, {}, { name: "Torino" }],
	},
};

describe("test point", () => {
	beforeEach(async () => {
		await hike_dao.deleteHikes();
		await hike_dao.deletePoint();
		await hike_dao.deleteHike_Point();

		try {
			await hike_dao.createHiking(
				hike1.title,
				hike1.length,
				hike1.description,
				hike1.difficulty,
				hike1.estimatedTime,
				hike1.ascent,
				hike1.localguideID
			);

			await hike_dao.postPoint(point1);
			await hike_dao.postPoint(point2);
			await hike_dao.postHike_Point(1, "start", 1);
			await hike_dao.postHike_Point(1, "arrive", 2);
		} catch (err) {
			console.log(err);
		}
	});

	testGetPointByHikeId(1);
	testGetPointById(1);
});

function testGetPointByHikeId(id) {
	describe("Testing getPointByHikeId(id)", () => {
		test("Getting coordinates of points linked to a hike", async () => {
			let res = await point.getPointByHikeId(id);
			expect(res).toEqual(
                    [
					    {
                            latitude:1.1,
                            longitude:2.1,
							type: "start"
                        },
                        {
                            latitude:5.1,
                            longitude:6.1,
							type: "arrive"
                        }
                    ]
                );
            });
        });
    }

function testGetPointById(id) {
	describe("Testing getPointById(id)", () => {
		test("Getting coordinates of point", async () => {
			let res = await point.getPointById(id);
			expect(res).toEqual(
					{
						latitude:1.1,
						longitude:2.1
					}
				);
			});
		});
	}
