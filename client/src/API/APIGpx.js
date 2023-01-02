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
             const appErrText = await response.text();
             throw new TypeError(appErrText);
         }
     } catch (err) {
         /* Network error */
         console.log(err);
         throw (err);
     }
 };


async function postGpx(filePath) {

    const url = APIURL + `gpx`;

    try {

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
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

//get start and arrival point with hikeId (JOIN with hike_point & point)
async function getPointByHikeId(id) {
    const url = APIURL + `point/${id}`;
     try {
         const response = await fetch(url);
         if (response.ok) {
             const ris = await response.json();
             return ris;
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

 async function getHutForMap() {
    const url = APIURL + `hutMap`;
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

const APIpostGpx = {postGpx , getFileById,getPointByHikeId,getHutForMap}; 
export default APIpostGpx; 
