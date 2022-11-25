const APIURL = 'http://localhost:3001/api/'

async function postHut(Hut) {

    const url = APIURL + `hut`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name : Hut.hutname,
                address : Hut.address,
                phone_number : Hut.phonenumber,
                email : Hut.email,
                website : Hut.website,
                description : Hut.description,
                city: Hut.city,
                province : Hut.province,
                altitude: Hut.altitude,
                languages : Hut.language,
                latitude: Hut.latitude,
                longitude: Hut.longitude,
                bike_friendly : Hut.bikefriendly,
                reachability : Hut.reachability,
                disabled_services : Hut.disable ,
                rooms : Hut.rooms,
                bathrooms : Hut.bathrooms,
                beds : Hut.beds,
                restaurant_services : Hut.restservice })
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

const APIHutForm = {postHut};
export default APIHutForm; 