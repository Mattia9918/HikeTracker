"use strict";

const hike_dao = require('../modules/dao/hikedao.js');
const hut_dao = require("../modules/dao/hutdao");

const hut1 = {
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
    restaurant_service: 1
}

const hut2 = {
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
    restaurant_service: 1
}

const hut3 = {
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
    restaurant_service: 1
}

const hut4 = {
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
    restaurant_service: 0
}

const point1 = {
    latitude: 45.459,
    longitude: 7.873,
    type: "hut",
    description: "da sostituire",
    province: "Torino",
    city: "Ivrea",
}

const point2 = {
    latitude: 44.704,
    longitude: 7.8567,
    type: "hut",
    description: "da sostituire",
    province: "Cuneo",
    city: "Bra",
}

const point3 = {
    latitude: 44.704,
    longitude: 7.8567,
    type: "hut",
    description: "da sostituire",
    province: "Cuneo",
    city: "Bra",
}

const point4 = {
    latitude: 44.61666,
    longitude: 7.933333,
    type: "hut",
    description: "da sostituire",
    province: "Cuneo",
    city: "Barolo",
}

describe("test get huts and add filters", () => {
    beforeEach(async () => {
        await hike_dao.deletePoint();
        await hut_dao.deleteAllHuts();

        try {
            const point1_id = await hike_dao.postPointHut(
                point1.latitude,
                point1.longitude,
                point1.city,
                point1.province)
            await hut_dao.postHut(
                hut1.name,
                hut1.address,
                hut1.phone_number,
                hut1.email,
                hut1.web_site,
                hut1.description,
                hut1.altitude,
                hut1.languages,
                hut1.bike_friendly,
                hut1.reachability,
                hut1.disabled_services,
                hut1.rooms,
                hut1.bathrooms,
                hut1.beds,
                hut1.restaurant_service,
                point1_id
            )

            const point2_id = await hike_dao.postPointHut(
                point2.latitude,
                point2.longitude,
                point2.city,
                point2.province)
            await hut_dao.postHut(
                hut2.name,
                hut2.address,
                hut2.phone_number,
                hut2.email,
                hut2.web_site,
                hut2.description,
                hut2.altitude,
                hut2.languages,
                hut2.bike_friendly,
                hut2.reachability,
                hut2.disabled_services,
                hut2.rooms,
                hut2.bathrooms,
                hut2.beds,
                hut2.restaurant_service,
                point2_id
            )

            const point3_id = await hike_dao.postPointHut(
                point3.latitude,
                point3.longitude,
                point3.city,
                point3.province)
            await hut_dao.postHut(
                hut3.name,
                hut3.address,
                hut3.phone_number,
                hut3.email,
                hut3.web_site,
                hut3.description,
                hut3.altitude,
                hut3.languages,
                hut3.bike_friendly,
                hut3.reachability,
                hut3.disabled_services,
                hut3.rooms,
                hut3.bathrooms,
                hut3.beds,
                hut3.restaurant_service,
                point3_id
            )

            const point4_id = await hike_dao.postPointHut(
                point4.latitude,
                point4.longitude,
                point4.city,
                point4.province)
            await hut_dao.postHut(
                hut4.name,
                hut4.address,
                hut4.phone_number,
                hut4.email,
                hut4.web_site,
                hut4.description,
                hut4.altitude,
                hut4.languages,
                hut4.bike_friendly,
                hut4.reachability,
                hut4.disabled_services,
                hut4.rooms,
                hut4.bathrooms,
                hut4.beds,
                hut4.restaurant_service,
                point4_id
            )

        } catch (err) {
            console.log(err)
        }
    })

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

});

function testGetHuts() {

    describe("Testing getHuts()", () => {
        test("4 huts posted -> get these 4 huts", async () => {
            let res = await hut_dao.getHuts();
            expect(res).toEqual(
                [
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
                        city: "Ivrea"
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
                    }
                ]
            )
        })
    })
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
                })
        })
    })
}

function testGetHutsByReachability() {

    describe("Testing getHutsByReachability()", () => {
        test("4 huts posted -> get 2 huts reachable foot", async () => {
            let res = await hut_dao.getHutByReachability("foot");
            expect(res).toEqual(
                [
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
                    }
                ]
            )
        })
    })
}

function testGetHutsBikeFriendly() {

    describe("Testing getHutBikeFriendly()", () => {
        test("4 huts posted -> get 2 huts bike_friendly", async () => {
            let res = await hut_dao.getHutBikeFriendly();
            expect(res).toEqual(
                [
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
                    }
                ]
            )
        })
    })
}

function testGetHutsByProvince() {

    describe("Testing getHutByProvince()", () => {
        test("4 huts posted -> get 3 huts with province Cuneo", async () => {
            let res = await hut_dao.getHutByProvince("Cuneo");
            expect(res).toEqual(
                [
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
                    }
                ]
            )
        })
    })
}

function testGetHutsByCity() {

    describe("Testing getHutByCity()()", () => {
        test("4 huts posted -> get 1 hut with city Ivrea", async () => {
            let res = await hut_dao.getHutByCity("Ivrea");
            expect(res).toEqual(
                [
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
                        city: "Ivrea"
                    }
                ]
            )
        })
    })
}

function testGetHutsWithDisabledService() {

    describe("Testing getHutWithDisabledService()", () => {
        test("4 huts posted -> get 2 huts with disabled services", async () => {
            let res = await hut_dao.getHutWithDisabledServices();
            expect(res).toEqual(
                [
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
                        city: "Ivrea"
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
                    }
                ]
            )
        })
    })
}

function testGetHutsWithRestaurant() {

    describe("Testing getHutWithRestaurant()", () => {
        test("4 huts posted -> get 3 huts with restaurant service", async () => {
            let res = await hut_dao.getHutWithRestaurant();
            expect(res).toEqual(
                [
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
                        city: "Ivrea"
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
                    }
                ]
            )
        })
    })
}

function testGetHutSByAltitude() {

    describe("Testing getHutByAltitude()", () => {
        test("4 huts posted -> get 2 huts with altitude between 350 and 2000", async () => {
            let res = await hut_dao.getHutByAltitude(350, 2000);
            expect(res).toEqual(
                [
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
                        city: "Ivrea"
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
                    }
                ]
            )
        })
    })
}

function testGetHutsWithBeds() {

    describe("Testing getHutWithBeds()", () => {
        test("4 huts posted -> get 2 huts with beds", async () => {
            let res = await hut_dao.getHutWithBeds();
            expect(res).toEqual(
                [
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
                        city: "Ivrea"
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
                    }
                ]
            )
        })
    })
}

