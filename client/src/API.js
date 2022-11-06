import { Service } from './Classes/Service'

const APIURL = 'http://localhost:3001/api/'

async function getServices() {
    const url = APIURL + `service`;

    try {
        const response = await fetch(url, {
            //credentials: 'include',
        });
        if (response.ok) {
            const list = await response.json();
            const servicesList = list.map((service) => 
                new Service (
                    service.id,
                    service.name,
                    service.estimated_time,
                )
            );
            return servicesList;
        } else {
            /* Application error */
            const appErrText = await response.text();
            throw new TypeError(appErrText);
        }
    } catch (err) {
        /* Network error */
        throw (err);
    }
};

async function postTicket(serviceId) {
    const url = APIURL + `ticket/${serviceId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //credentials: 'include',
        });

        if (response.ok) {
            const myTicketId = await response.json();
            return myTicketId;

        } else {
            /* Application error */
            const appErrText = await response.text();
            throw new TypeError(appErrText);
        }

    } catch (err) {
        /* Network error */
        throw (err);
    }
};


async function getWaitingQueue(ticketId) {
    try {
        const response = await fetch(new URL("queue/" + ticketId, APIURL));
        const queue = await response.json();
        if (response.ok) {
            if (queue)
                return queue;
        } else {
            throw queue;
        }
    }
    catch (error) { throw error; }


};

async function postServiceType(serviceType) {

    const url = APIURL + `serviceType`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: serviceType.name, estimatedTime: serviceType.estimatedTime })
        });
        if (response.ok) {
            return true;
        } else {
            /* Application error */
            const appErrText = await response.text();

            throw new TypeError(appErrText);

        }
    } catch (error) {
        /* Network error */

        throw (error);
    }
}

const API = { getServices, postTicket, getWaitingQueue, postServiceType };
export default API;
