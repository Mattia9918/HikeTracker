const parking_dao = require('../modules/dao/parkingdao.js');
const hike_dao = require('../modules/dao/hikedao.js');

const parking1 = {
    id: undefined,
    name: "5 Guys",
    guarded: 2,
    parking_spaces: 11,
    price_per_hour: 9,
    disabled_parkings: 10,
    timetable: "gunaydin"
}


const parking2 = {
    
    id: undefined,
    name: "4 Guys",
    guarded: 4,
    parking_spaces: 9,
    price_per_hour: 11,
    disabled_parkings: 21,
    timetable: "iyi aksamlar"
}

const point5 = {
    latitude: 67.6,
    longitude: 52.1,
    type: "parking lot",
    description: "Welcome dude!",
    city: "Torino",
    province: "Torino"
    
}

const point6 = {
    latitude: 23.1,
    longitude: 84.1,
    type: "parking lot",
    description: "You are parking!",
    city: "Torino",
    province: "Torino"
        
}

describe("test hikes and filtering", () => {
    beforeEach(async () => {

        await hike_dao.deletePointCCs();
        await parking_dao.deleteParks();

        try {

            let p5=await hike_dao.postParkPoint(point5);
            let p6=await hike_dao.postParkPoint(point6);
            await parking_dao.createParking(parking1.name, parking1.guarded, parking1.parking_spaces, parking1.price_per_hour, parking1.disabled_parkings, parking1.timetable,p5);
            await parking_dao.createParking(parking2.name, parking2.guarded, parking2.parking_spaces, parking2.price_per_hour, parking2.disabled_parkings, parking2.timetable,p6);
            

        } catch (err) {
            console.log(err)
        }
})

testGetParks();
testGetParkById(1);

});

function testGetParks() {

    describe("Testing getParks()", () => {
        test("1 parks posted -> get these 1 parks", async () => {
            let res = await parking_dao.getParks();
            expect(res).toEqual(
                [

                    {
                        parkID: 1,
                        name: "5 Guys",
                        guarded: 2,
                        parking_spaces: 11,
                        price_per_hour: 9,
                        disabled_parkings: 10,
                        timetable: "gunaydin",
                        point_id: 1,
                        latitude: 67.6,
                        longitude: 52.1,
                        type: "parking lot",
                        pointDescription: "Welcome dude!",
                        city: "Torino",
                        province: "Torino"
                        
                    },
                    {
                        parkID: 2,
                        name: "4 Guys",
                        guarded: 4,
                        parking_spaces: 9,
                        price_per_hour: 11,
                        disabled_parkings: 21,
                        timetable: "iyi aksamlar",
                        point_id: 2,
                        latitude: 23.1,
                        longitude: 84.1,
                        type: "parking lot",
                        pointDescription: "You are parking!",
                        city: "Torino",
                        province: "Torino"
                    }
                    
                ]
            )
        })
    })
};

function testGetParkById() {
    describe("Testing getParkById(id)", () => {
        test("specific park_lot depending on Id", async () => {
            let res = await parking_dao.getParkById(1);
            expect(res).toEqual(
                    {
                        parkID: 1,
                        name: "5 Guys",
                        guarded: 2,
                        parking_spaces: 11,
                        price_per_hour: 9,
                        disabled_parkings: 10,
                        timetable: "gunaydin",
                        point_id: 1,
                        latitude: 67.6,
                        longitude: 52.1,
                        type: "parking lot",
                        pointDescription: "Welcome dude!",
                        city: "Torino",
                        province: "Torino"
                    }
            )
        })
    })
}