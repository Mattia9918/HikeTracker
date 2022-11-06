//import {createServiceType, deleteServices, deleteTicket, getServices, postTicket} from '../dao'
const dao = require('../dao');


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

describe("test user", () => {

    beforeEach(async () => {



        try {

            await dao.deleteServices();

            //add 2 services
            // await dao.createServiceType(service1.name, service1.estimatedTime);
            // await dao.createServiceType(service2.name, service1.estimatedTime)

        } catch (err) {
            console.log(err)
        }
    })

    testCreateServiceType();
});





function testCreateServiceType() {
    test("create a service type", async () => {
        const service1 = {
            name: "service1",
            estimatedTime: "10"
        }
        let id = await dao.createServiceType(service1.name, service1.estimatedTime);

        let res = await dao.getSService(id);
        expect(res).toEqual({
            name: "service1",
            estimated_time: "10",
            id: id
        });
    });
}

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
}
