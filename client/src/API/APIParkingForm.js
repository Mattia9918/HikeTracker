

const APIURL = 'http://localhost:3001/api/'

async function postParking(Parking) {

    const url = APIURL + `parking`;

    try {
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name : Parking.name, guarded : Parking.guarded, parking_spaces : Parking.parkingspaces,
                                    price_per_hour : Parking.priceperhour, disabled_parkings : Parking.disabledparkings,
                                     timetable : Parking.timetable, parkingPoint:Parking.parkingPoint, user:Parking.user })
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


const APIParkingForm = {postParking};
export default APIParkingForm; 

