
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

async function getInfo(info) {

    const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+info.lat+'&longitude='+info.long+'&localityLanguage=en';



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



const APIHikeForm = {postHike, getInfo}; 
export default APIHikeForm; 