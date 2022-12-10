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
        console.log(err);
        throw (err);
    }
};

async function getFilter(filter, value) {
    let couple;
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
        console.log(err);
        throw (err);
    }
};

async function getHutFilter(filter, value) {
    let northEastLimit = value._northEast;
    let southWestLimit = value._southWest;
    let neLat = northEastLimit.lat;
    let neLng = northEastLimit.lng;
    let swLat = southWestLimit.lat;
    let swLng = southWestLimit.lng;
    let couple = [[neLat, neLng], [swLat, swLng]]
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
        throw (err);
    }
};


//function that links a hut to a hike 

async function linkHut(hutInfo, type) {
    const url = APIURL + `hutLinkHike`; 
    
    try {
        await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hutId : hutInfo.hutId,
                hikeid: hutInfo.hikeid,
                pointid: hutInfo.pointid,
                latitude: hutInfo.latitude,
                longitude: hutInfo.longitude
            })
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
        console.log(err);
        throw (err);
    }


}

const APIHuts = {getFilter, getHuts, getHutFilter, getHutCities, getHutProvinces, linkHut};
export default APIHuts;
