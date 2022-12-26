
const APIURL = 'http://localhost:3001/api/'

async function postHike(Hike) {

    const url = APIURL + `hiking`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: Hike.title, length: Hike.length, 
                description: Hike.description, difficulty: Hike.difficulty, estimatedTime: Hike.estimatedtime,
                 ascent: Hike.ascent, 
                 startingPoint : Hike.spoint, endingPoint: Hike.epoint })
        });
        if (response.ok) {
            const newHikeId = await response.json();
            return newHikeId;
        } else {
            /* Application error */
            const appErrText = await response.text();
            console.log(response); 
            throw new TypeError(appErrText);

        }
    } catch (error) {

        console.log(error); 
        throw (error);
    }
}

async function getInfo(info) {
    let latitude;
    let longitude;
    if (info === undefined){
        latitude = undefined;
        longitude = undefined;
    } else {
        latitude = info.lat;
        longitude = info.long;
    }
    const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+latitude+'&longitude='+longitude+'&localityLanguage=en';
    try {
        const response = await fetch(url);
        if (response.ok) {
            const city = await response.json();
            return city;
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

async function addImage(imgData, hikeId){
    const url = APIURL + `image/${hikeId}`;

    try {

        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            body: imgData
        });
        if (response.ok) {
            return true;
        } else {
            /* Application error */
            const appErrText = await response.text();
            console.log(response); 
            throw new TypeError(appErrText);

        }
    } catch (error) {

        console.log(error); 
        throw (error);
    }
}



const APIHikeForm = {postHike, getInfo, addImage}; 
export default APIHikeForm; 