const APIURL = 'http://localhost:3001/api/' 

async function getHuts() {
    const url = APIURL + `huts`;
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
        throw (err);
    }
};

async function getFilter(filter, value) {
    var couple;
    if (value !== undefined) {
        couple = value.split(',')
    } else {
        couple = [undefined, undefined]
    }
    const url = APIURL + `hut?filter=${filter}&value1=${couple[0]}&value2=${couple[1]}`;
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
        throw (err);
    }
};

async function getHutFilter(filter, value) {
    var northEastLimit = value._northEast;
    var southWestLimit = value._southWest;
    var neLat = northEastLimit.lat;
    var neLng = northEastLimit.lng;
    var swLat = southWestLimit.lat;
    var swLng = southWestLimit.lng;
    var couple = [[neLat, neLng], [swLat, swLng]]
    const url = APIURL + `hut?filter=${filter}&value1=${couple[0]}&value2=${couple[1]}`;
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
        throw (err);
    }
};

async function getHutCities() {
    const url = APIURL + `citiesHut`;
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });
        if (response.ok) {
            return await response.json();
        } else {
            /* Application error */
            const appErrText = await response.text();
            throw new TypeError(appErrText);
        }
    } catch (err) {
        /* Network error */
        throw (err);
    }
}


async function getHutProvinces() {
    const url = APIURL + `provincesHut`;
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });
        if (response.ok) {
            return await response.json();
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

const APIHuts = {getFilter, getHuts, getHutFilter, getHutCities, getHutProvinces};
export default APIHuts;
