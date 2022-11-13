const dao = require('../dao');



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

    //testCreateHiking();
    testgetHike();
});





function testCreateHiking() {
    test("create a hiking", async () => {
        const hike1 = {
            title: "hike1",
            lenght: "10",
            description: "sometimes maybe good sometimes maybe shit",
            difficulty: "hard",
            estimatedTime: "2",
            ascent:"1024",
            localguideID: "1"
        }
        let id = await dao.createHiking(hike1.title,hike1.lenght, hike1.description, hike1.difficulty, hike1.estimatedTime, hike1.ascent, hike1.localguideID);

        let res = await dao.getHikeDesc(id);
        expect(res).toEqual({

            description: "sometimes maybe good sometimes maybe shit",

        });
    });
}


function testgetHike() {
    test("Testing getHike", async () => {
        let res = await dao.getHike();
        expect(res).toEqual(
            [

                {
                    id: 1,
                    title: "hike1",
                    lenght: 10,
                    description: "sometimes maybe good sometimes maybe shit",
                    difficulty: "meeh",
                    estimatedTime: "2",
                    ascent: 1024,
                    localguideID: 1
                }

            ]
        )
    })
}