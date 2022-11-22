const dao = require('../modules/dao/hikedao');



describe("test user", () => {

    beforeEach(async () => {



        try {

            //await dao.deleteHikes();

            //add 2 services
            // await dao.createHiking(service1.name, service1.estimatedTime);
            // await dao.createHiking(service2.name, service1.estimatedTime)

        } catch (err) {
            console.log(err)
        }
    })

    testCreateHiking();
    testgetHike();
});





function testCreateHiking() {
    test("create a hiking", async () => {
        const hike5 = {
            title: "hike1",
            lenght: "10",
            description: "sometimes maybe good sometimes maybe shit",
            difficulty: "hard",
            estimatedTime: "2",
            ascent:"1024",
            localguideID: "1"
        }
        let id = await dao.createHiking(hike5.title,hike5.lenght, hike5.description, hike5.difficulty, hike5.estimatedTime, hike5.ascent, hike5.localguideID);

        let res = await dao.getHikeDesc(id);
        expect(res).toEqual({

            description: "sometimes maybe good sometimes maybe shit",

        });
    });
}


function testgetHike() {
    test("Testing getHike", async () => {
        let res = await dao.getHikes();
        expect(res).toEqual(
            [
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
                    startingPoint: {
                        latitude: 1.1,
                        longitude: 2.1,
                        type: "hut",
                        description: "foo",
                        city: "Torino",
                        province: "Torino",
                    },
                    endingPoint: {
                        latitude: 3.1,
                        longitude: 4.1,
                        type: "hut",
                        description: "foo",
                        city: "Torino",
                        province: "Torino",
                    },
                    pointsOfInterest: []
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
                    startingPoint: {
                        latitude: 5.1,
                        longitude: 6.1,
                        type: "hut",
                        description: "foo",
                        city: "Grugliasco",
                        province: "Torino",
                    },
                    endingPoint: {
                        latitude: 7.1,
                        longitude: 8.1,
                        type: "hut",
                        description: "foo",
                        city: "Grugliasco",
                        province: "Torino",
                    },
                    pointsOfInterest: []
                    
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
                    startingPoint: {
                        latitude: 1.1,
                        longitude: 2.1,
                        type: "hut",
                        description: "foo",
                        city: "Torino",
                        province: "Torino",
                    },
                    endingPoint: {
                        latitude: 3.1,
                        longitude: 4.1,
                        type: "hut",
                        description: "foo",
                        city: "Torino",
                        province: "Torino",
                    },
                    pointsOfInterest: []
                },
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
                    startingPoint: {
                        latitude: 5.1,
                        longitude: 6.1,
                        type: "hut",
                        description: "foo",
                        city: "Grugliasco",
                        province: "Torino",
                    },
                    endingPoint: {
                        latitude: 7.1,
                        longitude: 8.1,
                        type: "hut",
                        description: "foo",
                        city: "Grugliasco",
                        province: "Torino",
                    },
                    pointsOfInterest: []
                }
            ]
        )
    })
}

function testGetHikeDescById() {
    describe("Testing getHikeByAscent()", () => {
        test("Getting only hikes with ascent between 400 km and 1500 km", async () => {
            let res = await dao.getHikeDesc(2);
            expect(res).toEqual(
                [
                    {
                        description: "I'm Hike1!"
                    }
                ]
            )
        })
    })
}