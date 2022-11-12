const APIURL = 'http://localhost:3001/api/'; 

async function postHike(Hike) {

    const url = APIURL + `hiking`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: Hike.title, length: Hike.length, description: Hike.description, difficulty: Hike.difficulty, estimatedTime: Hike.estimatedtime, ascent: Hike.ascent, localguideID: Hike.localguideID  })
        });
        if (response.ok) {
            return true;
        } else {
            /* Application error */
            const appErrText = await response.text();

            throw new TypeError(appErrText);

        }
    } catch (error) {
        

        throw (error);
    }
}

const API = { postHike };
export default API;