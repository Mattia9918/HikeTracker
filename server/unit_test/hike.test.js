const hike_dao = require('../modules/dao/hikedao.js');
const user_dao = require('../modules/dao/userdao.js');

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
    locality: "Torino",
    principalSubdivision: "Torino",
}

const point2 = {
    latitude: 3.1,
    longitude: 4.1,
    type: "hut",
    description: "foo",
    locality: "Torino",
    principalSubdivision: "Torino",
}

const point3 = {
    latitude: 5.1,
    longitude: 6.1,
    type: "hut",
    description: "foo",
    locality: "Grugliasco",
    principalSubdivision: "Torino",
}

const point4 = {
    latitude: 7.1,
    longitude: 8.1,
    type: "hut",
    description: "foo",
    locality: "Grugliasco",
    principalSubdivision: "Torino",
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
        await user_dao.deleteUser();
        await hike_dao.deleteHikes();
        await hike_dao.deletePoint();
        await hike_dao.deleteHike_Point();
        
        try {
            
            await hike_dao.createHiking(hike1.title, hike1.length, hike1.description, hike1.difficulty, hike1.estimatedTime, hike1.ascent, hike1.localguideID);
            await hike_dao.createHiking(hike2.title, hike2.length, hike2.description, hike2.difficulty, hike2.estimatedTime, hike2.ascent, hike2.localguideID);
            await hike_dao.createHiking(hike3.title, hike3.length, hike3.description, hike3.difficulty, hike3.estimatedTime, hike3.ascent, hike3.localguideID);
            await hike_dao.createHiking(hike4.title, hike4.length, hike4.description, hike4.difficulty, hike4.estimatedTime, hike4.ascent, hike4.localguideID);
            await hike_dao.postPoint(point1)
            await hike_dao.postPoint(point2)
            await hike_dao.postPoint(point3)
            await hike_dao.postPoint(point4)
            await hike_dao.postHike_Point(1, 'start', 1)
            await hike_dao.postHike_Point(1, 'arrive', 2)
            await hike_dao.postHike_Point(2, 'start', 3)
            await hike_dao.postHike_Point(2, 'arrive', 4)
            await hike_dao.postHike_Point(3, 'start', 1)
            await hike_dao.postHike_Point(3, 'arrive', 2)
            await hike_dao.postHike_Point(4, 'start', 3)
            await hike_dao.postHike_Point(4, 'arrive', 4)
            await user_dao.insertUser(localguide1.email, localguide1.hash, localguide1.salt, localguide1.role, localguide1.name, localguide1.surname, localguide1.username);
            await user_dao.insertUser(localguide2.email, localguide2.hash, localguide2.salt, localguide2.role, localguide2.name, localguide2.surname, localguide2.username);
            


        } catch (err) {
            console.log(err)
        }
    })

   testGetHikes();
   testGetHikeByDiffculty();
   testGetHikeByExpectedTime();
   testGetHikeByLength();
   testGetHikeByAscent();
   testGetHikeDescById
});

function testGetHikes() {

    describe("Testing getHikes()", () => {
        test("4 hikes posted -> get these 4 hikes", async () => {
            let res = await hike_dao.getHikes();
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
            let res = await hike_dao.getHikeByDiffculty("Easy");
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
            let res = await hike_dao.getHikeByExpectedTime(1,2);
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
            let res = await hike_dao.getHikeByLength(30,40);
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

function testGetHikeDescById() {
    describe("Testing getHikeByAscent()", () => {
        test("Getting only hikes with ascent between 400 km and 1500 km", async () => {
            let res = await hike_dao.getHikeDesc(2);
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

function testGetHikeByAscent() {

    describe("Testing getHikeByAscent()", () => {
        test("Getting only hikes with ascent between 400 km and 1500 km", async () => {
            let res = await hike_dao.getHikeByAscent(400,1500);
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