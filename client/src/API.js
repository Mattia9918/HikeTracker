import { Hike } from './Classes/Hike';

const APIURL = 'http://localhost:3001/api/'

async function addUser(user) {

    const url = APIURL + `register`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: user.email,
                password: user.password,
                role:user.role,
                name: user.name,
                surname: user.surname,
                username: user.username
            })
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

async function validateUser(code) {

    const url = APIURL + `validate/`+code;

    try {

        const response = await fetch(url);
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

async function getHikes() {
   const url = APIURL + `hikes`;
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });
        if (response.ok) {
            const list = await response.json();
            const hikeList = list.map((hike) => 
                new Hike(
                    hike.id,
                    hike.title,
                    hike.length,
                    hike.description,
                    hike.difficulty,
                    hike.ascent,
                    hike.estimatedTime,
                    hike.localguideUsername,
                    hike.startingPoint.city,
                    hike.startingPoint.province,
                    hike.endingPoint.city,
                    hike.endingPoint.province
                ));
            return hikeList;
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
    if (value != undefined) {
        couple = value.split(',')
    } else {
        couple = [undefined, undefined]
    }
    const url = APIURL + `hike?filter=${filter}&value1=${couple[0]}&value2=${couple[1]}`;
     try {
         const response = await fetch(url, {
             credentials: 'include',
         });
         if (response.ok) {
             const list = await response.json();
             console.log(list)
             const filteredHikeList = list.map((hike) => 
                 new Hike(
                     hike.id,
                     hike.title,
                     hike.length,
                     hike.description,
                     hike.difficulty,
                     hike.ascent,
                     hike.estimatedTime,
                     hike.localguideUsername,
                     hike.startingPoint.city,
                     hike.startingPoint.province,
                     hike.endingPoint.city,
                     hike.endingPoint.province
                 ));
             return filteredHikeList;
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



const API = { addUser, getHikes, validateUser, getFilter};
export default API;