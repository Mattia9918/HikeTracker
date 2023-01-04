const APIURL = 'http://localhost:3001/api/' 

async function getParkingLots() {
    const url = APIURL + `parking`;
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });
        if (response.ok) {
            const list = await response.json();
            return list;
        } else {
            /* Application error */
            const appErrText = await response.text();
            throw new TypeError(appErrText);
        }
    } catch (err) {
        /* Network error */
        console.log(err);
        throw (err);
    }
};


async function getParksDistantFromHike(hikeId) {
    const url = APIURL + `parksDistantFromHike/${hikeId}`;
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });
        if (response.ok) {
            const list = await response.json();
            return list;
        } else {
            /* Application error */
            const appErrText = await response.text();
            throw new TypeError(appErrText);
        }
    } catch (err) {
        /* Network error */
        console.log(err);
        throw (err);
    }
};

const APIParkingGet = {getParkingLots,getParksDistantFromHike};
export default APIParkingGet; 