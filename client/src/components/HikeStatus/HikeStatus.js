import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import APIHikeForm from '../../API/APIHikeForm';
import APIHikes from '../../API/APIHikes';
import APIGpx from '../../API/APIGpx';
import {
    MapContainer,
    TileLayer,
    Marker,
    GeoJSON,
} from "react-leaflet";

function HikeStatusModal(props) {
    const type = props.type;
    return (
        type !== "stats" ? <StartOrTerminateModal showStatusModal={props.showStatusModal} setShowStatusModal={props.setShowStatusModal} hike={props.hike} type={type} setStarted={props.setStarted} /> :
            <StatsModal showStatusModal={props.showStatusModal} setShowStatusModal={props.setShowStatusModal} hike={props.hike} />
    )
}

function StartOrTerminateModal(props) {

    const [message, setMessage] = useState();

    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).split('.')

    const [curPos, setCurPos] = useState();
    const [dateTime, setDateTime] = useState(localISOTime[0]);

    const type = props.type;

    async function positionInfo() {
        try {
            const { latitude, longitude } = await APIHikeForm.getInfo();
            setCurPos({
                latitude: latitude,
                longitude: longitude
            })
        } catch (err) {
            console.log(err)
        }
    }

    async function manageHikeStatus(dateTime, type) {

        try {
            switch (type) {
                case 0:
                    await APIHikes.startHike(dateTime, props.hike.id);
                    props.setStarted(props.hike.id);
                    props.setShowStatusModal({
                        isVisible: false,
                        type: undefined
                    })
                    break;

                case 1:
                    const hike = await APIHikes.getStartedHike()
                    await APIHikes.terminateHike(dateTime, hike.id);
                    props.setStarted();
                    props.setShowStatusModal({
                        isVisible: false,
                        type: undefined
                    })
                    break;

                default:
                    console.log("Default case HikeStatus, StartOrTerminateModal")
                    break;
            }
        } catch (err) {
            setMessage(JSON.parse(err.message).error);
        }
    }

    useEffect(() => {
        positionInfo();
    },
        []
    )

    /* -- RENDERING -- */
    return (
        <Modal size="lg" show={props.showStatusModal} onHide={() => props.setShowStatusModal({
            isVisible: false,
            type: undefined
        })}>

            {/* Modal header */}
            <Modal.Header closeButton>

                <Modal.Title>
                    {props.hike.title}
                </Modal.Title>

            </Modal.Header>

            <Container className = "mt-3">
                {message &&
                    <Alert variant="danger">{message}</Alert>
                }
            </Container>

            {/* Modal body */}
            <Modal.Body >
                {
                    type === "start" && <StartModalBody hike={props.hike} curPos={curPos} dateTime={dateTime} setDateTime={setDateTime} /> ||
                    type === "terminate" && <TerminateModalBody hike={props.hike} curPos={curPos} dateTime={dateTime} setDateTime={setDateTime} />
                }
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant={type === "start" ? "success" : "danger"}
                    onClick={() => manageHikeStatus(dateTime, type === "start" ? 0 : 1)
                    }>
                    {type === "start" ? "Start hike" : "Terminate hike"}
                </Button>
                <Button variant="secondary" onClick={() => props.setShowStatusModal({
                    isVisible: false,
                    type: undefined
                })}>
                    Close</Button>
            </Modal.Footer>

        </Modal>
    );
};

function StartModalBody(props) {

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
            <Row className="ms-2">
                By clicking on the "start" button you will start the hike, and you'll be able to track your trip
                until clicking on the "terminate hike" button. If you really want to start the hike, check your initial
                tracking informations!
            </Row>
            <hr className="mt-3"></hr>
            <Row>
                {coordinates?.length && (
                    <center>
                        <MapContainer
                            style={{ height: "400px", width: "100%" }}
                            center={center}
                            zoom={15}
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
            </Row>
            <Row>
                <Col xs={6}>
                    <Form.Label>Starting date and time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={props.dateTime}
                        onChange={(e) => props.setDateTime(e.target.value)}
                    />

                </Col>
            </Row>
        </>
    );
};

function TerminateModalBody(props) {

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
            <Row className="ms-2">
                By clicking on the "terminate" button you are going to terminate this hike, and you'll be not anymore able to track your trip
                until restarting the same, or a new hike, by clicking on the "Start hike" button.
            </Row>
            <hr className="mt-3"></hr>
            <Row>
                {coordinates?.length && (
                    <center>
                        <MapContainer
                            style={{ height: "400px", width: "100%" }}
                            center={center}
                            zoom={15}
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
            </Row>
            <Row>
                <Col xs={6}>
                    <Form.Label>Ending date and time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={props.dateTime}
                        onChange={(e) => props.setDateTime(e.target.value)}
                    />

                </Col>
            </Row>
        </>
    );
};

function StatsModal(props) {

    let count = 0;
    const [myStats, setMyStats] = useState([]);
    console.log(myStats)

    async function getMyStats(hikeId) {
        try {

            const statsArray = await APIHikes.getStats(hikeId);

            setMyStats(statsArray);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getMyStats(props.hike.id)
    }, [])

    return (
        <Modal show={props.showStatusModal} onHide={() => props.setShowStatusModal({
            isVisible: false,
            type: undefined
        })}>

            {/* Modal header */}
            <Modal.Header closeButton>

                <Modal.Title>
                    {props.hike.title}
                </Modal.Title>

            </Modal.Header>

            {/* Modal body */}
            <Modal.Body >
                {
                    myStats.length === 0 ? "Still nothing to see here. Start the hike to record your stats!" :
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Trip n°</th>
                                    <th>Starting time</th>
                                    <th>Ending time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myStats.map((stat) => <StatsRow key={stat.id} stat={stat} count={++count} />)}
                            </tbody>
                        </Table>
                }


            </Modal.Body>

            <Modal.Footer>

                <Button variant="secondary" onClick={() => props.setShowStatusModal({
                    isVisible: false,
                    type: undefined
                }
                )}>Close</Button>
            </Modal.Footer>

        </Modal>
    );
}

function StatsRow(props) {
    return (
        <tr>
            <td>{props.count}</td>
            <td>{props.stat.start_time}</td>
            <td>{props.stat.end_time ? props.stat.end_time : "in progress..."}</td>
        </tr>
    );
}

export { HikeStatusModal }; 