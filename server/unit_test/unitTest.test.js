//import {createServiceType, deleteServices, deleteTicket, getServices, postTicket} from '../dao'
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
/*
function testgetServices() {
    test("Testing getServices", async () => {
        let res = await dao.getServices();
        expect(res).toEqual(
            [
                {
                    id: 1,
                    name: "service1",
                    estimated_time: "10"
                }, {
                    id: 2,
                    name: "service2",
                    estimated_time: "10"
                }
            ]
        )
    })
}




describe("test user", () => {

    beforeEach(async () => {
        const service1 = {
            name: "service1",
            estimatedTime: "10"
        }

        const service2 = {
            name: "service2",
            estimatedTime: "10"
        }

        await dao.deleteTicket();
        await dao.deleteServices();

        try {

            //add 2 services
            await dao.createServiceType(service1.name, service1.estimatedTime);
            await dao.createServiceType(service2.name, service1.estimatedTime)

        } catch (err) {
            console.log(err)
        }
    })

    testgetServices();
    testGetTicket();
    testGetQueue();
});



function testGetTicket() {
    test("Testing get ticket", async () => {
        let id = await dao.postTicket(1);
        let ticket = await dao.getTicket(id);
        expect(ticket.service_type).toEqual(1);
        expect(ticket.id).toEqual(id);
        expect(ticket.state).toEqual('open');
    })
}

function testGetQueue() {
    test("Testing get queue", async () => {

        // Put in queue 3 tickets for service 1, one ticket for service 2
        await dao.postTicket(1);
        await dao.postTicket(1);
        let id1 = await dao.postTicket(2);
        let id2 = await dao.postTicket(1);

        // Retrieve last 2 tickets
        let ticket1 = await dao.getTicket(id1);
        let ticket2 = await dao.getTicket(id2);

        // Get queue for ticket 1 (service 2): should be 0
        let queue1 = await dao.getQueue(id1, ticket1.service_type, ticket1.issued_at);
        expect(queue1).toEqual(
            {
                numUtenti: 0
            }
        );

        // Get queue for ticket 2 (service 1): should be 2
        let queue2 = await dao.getQueue(id2, ticket2.service_type, ticket2.issued_at);
        expect(queue2).toEqual(
            {
                numUtenti: 2
            }
        );
    })
}*/
