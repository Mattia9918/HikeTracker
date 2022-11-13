const dao = require('../dao.js');

const hike1 = {
    id: undefined,
    title: "Hike1",
    length: 10,
    description: "I'm Hike1!",
    difficulty: "Easy",
    estimatedTime: "1",
    ascent: 120,
    localguideID: 1
 }
 const hike2 = {
     id: undefined,
     title: "Hike2",
     length: 20,
     description: "I'm Hike2!",
     difficulty: "Average",
     estimatedTime: "2",
     ascent: 400,
     localguideID: 2
 }

 const hike3 = {
     id: undefined,
     title: "Hike3",
     length: 30,
     description: "I'm Hike3!",
     difficulty: "Difficult",
     estimatedTime: "3",
     ascent: 800,
     localguideID: 1
 }

 const hike4 = {
     id: undefined,
     title: "Hike4",
     length: 40,
     description: "I'm Hike4!",
     difficulty: "Easy",
     estimatedTime: "4",
     ascent: 1500,
     localguideID: 2
 }

 const point1 = {
    latitude: 1.1,
    longitude: 2.1,
    type: "hut",
    description: "foo",
    city: "Torino",
    province: "Torino",
}

const point2 = {
    latitude: 3.1,
    longitude: 4.1,
    type: "hut",
    description: "foo",
    city: "Torino",
    province: "Torino",
}

const point3 = {
    latitude: 5.1,
    longitude: 6.1,
    type: "hut",
    description: "foo",
    city: "Grugliasco",
    province: "Torino",
}

const point4 = {
    latitude: 7.1,
    longitude: 8.1,
    type: "hut",
    description: "foo",
    city: "Grugliasco",
    province: "Torino",
}

 const localguide1 = {
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

 const localguide2 = {
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

describe("test hikes and filtering", () => {
    beforeEach(async () => {
        await dao.deleteUser();
        await dao.deleteHikes();
        await dao.deletePoint();
        await dao.deleteHike_Point();
        
        try {
            
            await dao.createHiking(hike1.title, hike1.length, hike1.description, hike1.difficulty, hike1.estimatedTime, hike1.ascent, hike1.localguideID);
            await dao.createHiking(hike2.title, hike2.length, hike2.description, hike2.difficulty, hike2.estimatedTime, hike2.ascent, hike2.localguideID);
            await dao.createHiking(hike3.title, hike3.length, hike3.description, hike3.difficulty, hike3.estimatedTime, hike3.ascent, hike3.localguideID);
            await dao.createHiking(hike4.title, hike4.length, hike4.description, hike4.difficulty, hike4.estimatedTime, hike4.ascent, hike4.localguideID);
            await dao.postPoint(point1)
            await dao.postPoint(point2)
            await dao.postPoint(point3)
            await dao.postPoint(point4)
            await dao.postHike_Point(1, 'start', 1)
            await dao.postHike_Point(1, 'arrive', 2)
            await dao.postHike_Point(2, 'start', 3)
            await dao.postHike_Point(2, 'arrive', 4)
            await dao.postHike_Point(3, 'start', 1)
            await dao.postHike_Point(3, 'arrive', 2)
            await dao.postHike_Point(4, 'start', 3)
            await dao.postHike_Point(4, 'arrive', 4)
            await dao.insertUser(localguide1.email, localguide1.hash, localguide1.salt, localguide1.role, localguide1.name, localguide1.surname, localguide1.username);
            await dao.insertUser(localguide2.email, localguide2.hash, localguide2.salt, localguide2.role, localguide2.name, localguide2.surname, localguide2.username);
            


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
                        startingPoint:{
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
    })
}