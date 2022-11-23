import { Hike } from '../Classes/Hike';

const APIURL = 'http://localhost:3001/api/' 


async function getFileById(id) {
    const url = APIURL + `gpx/${id}`;
     try {
         const response = await fetch(url);
         if (response.ok) {
             const ris = await response.json();
             
             return ris;
         } else {
             /* Application error */
             console.log(response); 
             const appErrText = await response.text();
             throw new TypeError(appErrText);
         }
     } catch (err) {
         /* Network error */
         throw (err);
     }
 };


async function postGpx(filePath) {

    const url = APIURL + `gpx`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    path: filePath
                }
            )
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


const APIpostGpx = {postGpx , getFileById}; 
export default APIpostGpx; 
