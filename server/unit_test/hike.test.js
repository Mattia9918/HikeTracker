const dao = require('../dao');

describe("test hikes and filtering", () => {
    beforeEach(async () => {
        await dao.dropTableHike();
        await dao.dropTableUsers();

        let hike1 = {
            id: undefined,
            title: "Hike1",
            length: 10,
            description: "I'm Hike1!",
            difficulty: "Easy",
            estimatedTime: 1,
            ascent: 120,
            localguideID: 1
        }
        let hike2 = {
            id: undefined,
            title: "Hike2",
            length: 20,
            description: "I'm Hike2!",
            difficulty: "Average",
            estimatedTime: 2,
            ascent: 400,
            localguideID: 2
        }

        let hike3 = {
            id: undefined,
            title: "Hike3",
            length: 30,
            description: "I'm Hike3!",
            difficulty: "Difficult",
            estimatedTime: 3,
            ascent: 800,
            localguideID: 1
        }

        let hike4 = {
            id: undefined,
            title: "Hike4",
            length: 40,
            description: "I'm Hike4!",
            difficulty: "Easy",
            estimatedTime: 4,
            ascent: 1500,
            localguideID: 2
        }

        let localguide1 = {
            id: undefined,
            email: "lg1@polito.it",
            hash: "foo",
            salt: "foo",
            role: "local guide",
            username: "Francescone",
            isActive: 1,
            name: "Francescone",
            surname: "Bianchi"
        }

        let localguide2 = {
            id: undefined,
            email: "lg2@polito.it",
            hash: "foo",
            salt: "foo",
            role: "local guide",
            username: "Franceschino",
            isActive: 1,
            name: "Franceschino",
            surname: "Neri"
        }
        
        try {
            await dao.createTableHike();
            await dao.postHike(hike1);
            await dao.postHike(hike2);
            await dao.postHike(hike3);
            await dao.postHike(hike4);
            await dao.insertUser(localguide1);
            await dao.insertUser(localguide2);


        } catch (err) {
            console.log(err)
        }
    })

    testGetHikes();
    testGetHikeByDiffculty();
    testGetHikeByExpectedTime();
    testGetHikeByLength();
    testGetHikeByAscent();
});

function testGetHikes() {

    describe("Testing getHikes()", () => {
        test("4 hikes posted -> get these 4 hikes", async () => {
            let res = await dao.getHikes();
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        title: "Hike1",
                        length: 10,
                        description: "I'm Hike1!",
                        difficulty: "Easy",
                        estimatedTime: 1,
                        ascent: 120,
                        localguideID: 1,
                        localguideUsername: "Francescone",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 2,
                        title: "Hike2",
                        length: 20,
                        description: "I'm Hike2!",
                        difficulty: "Average",
                        estimatedTime: 2,
                        ascent: 400,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                        
                    },
                    {
                        id: 3,
                        title: "Hike3",
                        length: 30,
                        description: "I'm Hike3!",
                        difficulty: "Difficult",
                        estimatedTime: 3,
                        ascent: 800,
                        localguideID: 1,
                        localguideUsername: "Francescone",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 4,
                        title: "Hike4",
                        length: 40,
                        description: "I'm Hike4!",
                        difficulty: "Easy",
                        estimatedTime: 4,
                        ascent: 1500,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    }
                ]
            )
        })
    })
}

function testGetHikeByDiffculty() {

    describe("Testing getHikeByDifficulty()", () => {
        test("Getting only 'Easy' hikes", async () => {
            let res = await dao.getHikeByDiffculty("Easy");
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        title: "Hike1",
                        length: 10,
                        description: "I'm Hike1!",
                        difficulty: "Easy",
                        estimatedTime: 1,
                        ascent: 120,
                        localguideID: 1,
                        localguideUsername: "Francescone",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 4,
                        title: "Hike4",
                        length: 40,
                        description: "I'm Hike4!",
                        difficulty: "Easy",
                        estimatedTime: 4,
                        ascent: 1500,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    }
                ]
            )
        })
    })
}

function testGetHikeByExpectedTime() {

    describe("Testing getHikeByExpectedTime()", () => {
        test("Getting only hikes with estimatedTime between 1 and 2", async () => {
            let res = await dao.getHikeByExpectedTime(1,2);
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        title: "Hike1",
                        length: 10,
                        description: "I'm Hike1!",
                        difficulty: "Easy",
                        estimatedTime: 1,
                        ascent: 120,
                        localguideID: 1,
                        localguideUsername: "Francescone",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 2,
                        title: "Hike2",
                        length: 20,
                        description: "I'm Hike2!",
                        difficulty: "Average",
                        estimatedTime: 2,
                        ascent: 400,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    }
                ]
            )
        })
    })
}

function testGetHikeByLength() {

    describe("Testing getHikeByLength()", () => {
        test("Getting only hikes with length between 30 km and 40 km", async () => {
            let res = await dao.getHikeByLength(30,40);
            expect(res).toEqual(
                [
                    {
                        id: 3,
                        title: "Hike3",
                        length: 30,
                        description: "I'm Hike3!",
                        difficulty: "Difficult",
                        estimatedTime: 3,
                        ascent: 800,
                        localguideID: 1,
                        localguideUsername: "Francescone",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 4,
                        title: "Hike4",
                        length: 40,
                        description: "I'm Hike4!",
                        difficulty: "Easy",
                        estimatedTime: 4,
                        ascent: 1500,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    }
                ]
            )
        })
    })
}

function testGetHikeByAscent() {

    describe("Testing getHikeByAscent()", () => {
        test("Getting only hikes with ascent between 400 km and 1500 km", async () => {
            let res = await dao.getHikeByAscent(400,1500);
            expect(res).toEqual(
                [
                    {
                        id: 2,
                        title: "Hike2",
                        length: 20,
                        description: "I'm Hike2!",
                        difficulty: "Average",
                        estimatedTime: 2,
                        ascent: 400,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 3,
                        title: "Hike3",
                        length: 30,
                        description: "I'm Hike3!",
                        difficulty: "Difficult",
                        estimatedTime: 3,
                        ascent: 800,
                        localguideID: 1,
                        localguideUsername: "Francescone",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    },
                    {
                        id: 4,
                        title: "Hike4",
                        length: 40,
                        description: "I'm Hike4!",
                        difficulty: "Easy",
                        estimatedTime: 4,
                        ascent: 1500,
                        localguideID: 2,
                        localguideUsername: "Franceschino",
                        startingPoint: "",
					    endingPoint: "",
					    pointsOfInterest: []
                    }
                ]
            )
        })
    })
}