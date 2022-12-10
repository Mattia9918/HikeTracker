const APIURL = 'http://localhost:3001/api/'

async function postHut(Hut) {

    const url = APIURL + `hut`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hut: {
                    name : Hut.hutname,
                    address : Hut.address,
                    phone_number : Hut.phonenumber,
                    email : Hut.email,
                    website : Hut.website,
                    description : Hut.description,
                    altitude: Hut.altitude,
                    languages : Hut.language,
                    bike_friendly : Hut.bikefriendly,
                    reachability : Hut.reachability,
                    disabled_services : Hut.disable ,
                    rooms : Hut.rooms,
                    bathrooms : Hut.bathrooms,
                    beds : Hut.beds,
                    restaurant_service : Hut.restservice
                },
                point: {
                    city: Hut.city,
                    province : Hut.province,
                    latitude: Hut.latitude,
                    longitude: Hut.longitude
                }
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
        console.log(error); 
        throw (error);
    }
}

const APIHutForm = {postHut};
export default APIHutForm; 