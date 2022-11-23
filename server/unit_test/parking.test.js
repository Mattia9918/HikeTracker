const parking_dao = require('../modules/dao/parkingdao.js');



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
    name: "4 guys",
    guarded: 4,
    parking_spaces: 9,
    price_per_hour: 11,
    disabled_parkings: 21,
    timetable: "iyi aksamlar"
}

describe("test hikes and filtering", () => {
    beforeEach(async () => {
        await parking_dao.deleteParks();

        try {

            await parking_dao.createParking(parking1.name, parking1.guarded, parking1.parking_spaces, parking1.price_per_hour, parking1.disabled_parkings, parking1.timetable);
            await parking_dao.createParking(parking2.name, parking2.guarded, parking2.parking_spaces, parking2.price_per_hour, parking2.disabled_parkings, parking2.timetable);


        } catch (err) {
            console.log(err)
        }
})

testGetParks();
testGetParkById(1);

});

function testGetParks() {

    describe("Testing getParks()", () => {
        test("2 parks posted -> get these 2 parks", async () => {
            let res = await parking_dao.getParks();
            expect(res).toEqual(
                [
                    {
                        id: 1,
                        name: "5 Guys",
                        guarded: 2,
                        parking_spaces: 11,
                        price_per_hour: 9,
                        disabled_parkings: 10,
                        timetable: "gunaydin"
                    },
                    {
                        id: 2,
                        name: "4 guys",
                        guarded: 4,
                        parking_spaces: 9,
                        price_per_hour: 11,
                        disabled_parkings: 21,
                        timetable: "iyi aksamlar"
                
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
                        id: 1,
                        name: "5 Guys",
                        guarded: 2,
                        parking_spaces: 11,
                        price_per_hour: 9,
                        disabled_parkings: 10,
                        timetable: "gunaydin"
                    }
            )
        })
    })
}