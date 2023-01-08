import APIGpx from '../../API/APIGpx';
import {
    MapContainer,
    TileLayer,
    Marker,
    GeoJSON,
} from "react-leaflet";
import { useEffect, useState } from 'react';

function HikeStatusMap(props) {
    const [coordinates, setCoordinates] = useState();
    const [center, setCenter] = useState();

    useEffect(() => {
        const getJson = async () => {
            try {
                const json = await APIGpx.getFileById(props.hike.id);
                const c = json.features;

                setCoordinates(c);

                const arrayCoordinates = c[0].geometry.coordinates;
                const last = arrayCoordinates.length - 1;
                const middle = Math.round(last / 2);


                const cntr = [
                    arrayCoordinates[middle][1],
                    arrayCoordinates[middle][0],
                ];

                setCenter(cntr);

            } catch (err) { }
        };
        getJson();

        // eslint-disable-next-line
    }, []);


    return (

        <>
            {coordinates?.length && (
                <center>
                    <MapContainer
                        style={{ height: "400px", width: "100%" }}
                        center={center}
                        zoom={14}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON data={coordinates} />
                        {props.curPos &&
                            <Marker
                                position={[props.curPos.latitude, props.curPos.longitude]}
                            />
                        }
                    </MapContainer>
                </center>)}
        </>
    )
}

export { HikeStatusMap }; 