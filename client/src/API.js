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
          
            const appErrText = await response.text();

            throw new TypeError(appErrText);
           

        }
    } catch (error) {
        throw error; 
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
                    hike.startingPoint,
                    hike.pointsOfInterest,
                    hike.endingPoint
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
                     hike.startingPoint,
                     hike.pointsOfInterest,
                     hike.endingPoint
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
// /api/sessions
async function logIn(credentials) { 
    try{
        
    let response = await fetch(new URL("sessions",APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if(response.ok) {
          const user = await response.json();
          return user;
      }
      else {
          const errDetail = await response.json();
          
          throw errDetail.message;
      }
    }
    catch(error){throw error.message;}
}
  
// /api/sessions/current
async function logOut() {
    await fetch(new URL('sessions/current',APIURL), 
              { method: 'DELETE',credentials:'include' });
}

async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL),
            {credentials: 'include'});
    const userInfo = await response.json();
    
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo; 
    }
  }




const API = { addUser, getHikes, validateUser, getFilter, logIn,logOut,getUserInfo };
export default API;
