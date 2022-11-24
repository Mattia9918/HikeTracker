import { Container, Card, Row, Col, Form, Button, Badge, Alert, Modal, Accordion, ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, Popup } from 'react-leaflet';
import API from '../API/APILogin';


function Hikes(props) {

    /* -- INPUT STATE MANAGEMENT -- */

    const [show, setShow] = useState();

    return (
        <>
            <Row>
                <Col >
                </Col>
                <Col sm={8} xs={12}>
                    {(props.msg.message === "You have been logged out!" || (props.user && props.msg.message === `Welcome ${props.user.username}!`)) &&
                        <Alert variant={props.msg.type} onClose={() => {
                            props.setMsg("");
                            setShow(false);
                        }} show={show} dismissible>
                            {props.msg.message}
                        </Alert>
                    }
                    <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
                        <FilterMenu loadFilter = {props.loadFilter} />
                        <Row>
                            {(props.hikes.length === 1 && props.hikes[0].id == undefined) ||
                                <>
                                    <Col>
                                        {props.hikes.filter((hike) => hike.id % 2 != 0).map((hike) => <HikeCard key={hike.id} hike={hike} user={props.user} />)}
                                    </Col>
                                    <Col>
                                        {props.hikes.filter((hike) => hike.id % 2 == 0).map((hike) => <HikeCard key={hike.id} hike={hike} user={props.user} />)}
                                    </Col>
                                </>
                            }
                        </Row>
                    </Container>
                </Col>
                <Col>
                </Col>
            </Row>
        </>
    )
};
function FilterMenu(props) {
    return (
        <Row className = "mt-3 mb-1 ms-1 me-1">
                <Accordion >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Filtering options</Accordion.Header>
                        <Accordion.Body>
                            <Accordion>
                                <Row>
                                <Col>
                                <Accordion.Item eventKey="1" id = "secondaryaccordion">
                                    <Accordion.Header id = "filter" >Length</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup>
                                            <ListGroup.Item  id = "smallgroups" action={true} onClick={() => props.loadFilter("length", "0,10")}>
                                                Between 0 and 10 km
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("length", "11,20")}>
                                                Between 10 and 20 km
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("length", "21,1000")}>
                                                More than 20 km
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>


                                <Accordion.Item eventKey="2" id = "secondaryaccordion">
                                    <Accordion.Header>Estimated time</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("expectedTime", "0,1")}>
                                                Less than 1 hour
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("expectedTime", "1,2")}>
                                                Between 1 and 2 hours
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("expectedTime", "2,3")}>
                                                Between 2 and 3 hours
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("expectedTime", "3,1000")}>
                                                More than 3 hours
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="3" id = "secondaryaccordion">
                                    <Accordion.Header>Difficulty</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("difficulty", "Easy")}>
                                                Easy
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("difficulty", "Average")}>
                                                Average
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("difficulty", "Difficult")}>
                                                Difficult
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                                </Col>
                                <Col>
                                <Accordion.Item eventKey="4" id = "secondaryaccordion">
                                    <Accordion.Header>Ascent</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "0,300")}>
                                                Less than 300 m
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "301,600")}>
                                                Between 300 m and 600 m
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "601,1000")}>
                                                Between 600 m and 1000 m
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "1001,100000")}>
                                                More than 1000 m
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="5" id = "secondaryaccordion">
                                    <Accordion.Header>Province</Accordion.Header>
                                    <Accordion.Body></Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="6" id = "secondaryaccordion">
                                    <Accordion.Header>City</Accordion.Header>
                                    <Accordion.Body></Accordion.Body>
                                </Accordion.Item>
                                </Col>
                                <Col>
                                <Button onClick={() => props.loadFilter("none")}>Reset</Button>
                                </Col>
                                </Row>
                            </Accordion>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
        </Row>
    );
}
function HikeCard(props) {

    const [open, setOpen] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const difficulty = props.hike.difficulty

    return (
        <Container className="mt-3 mb-3">
            <Card className="shadow-sm p-2">
                {/* -- CARD HEADER -- */}
                <Card.Header>
                    <Row>
                        {/* Localguide's username */}
                        <Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6}>
                            <b>Posted by: </b> {props.hike.localguideUsername}
                        </Col>

                        <Col align="right">
                            <Badge bg={
                                (difficulty === "Easy" && "success") ||
                                (difficulty === "Average" && "warning") ||
                                (difficulty === "Difficult" && "danger")}>
                                {props.hike.difficulty}
                            </Badge>
                        </Col>

                    </Row>
                </Card.Header>

                <Card.Img className="mt-2" variant="top" src={
                    (difficulty === "Easy" && "http://localhost:3000/images/easyhike.jpg") ||
                    (difficulty === "Average" && "http://localhost:3000/images/averagehike.jpg") ||
                    (difficulty === "Difficult" && "http://localhost:3000/images/difficulthike.jpg")
                } />


                {/* -- CARD BODY -- */}
                <Card.Body>

                    <Card.Title>{props.hike.title}</Card.Title>
                    <Card.Text>
                        {props.hike.description}
                        {open !== 0 &&
                            <>
                                <br></br><br></br>
                                <b>Details:</b>
                                <br></br>
                                <ul className="mt-2">
                                    <li><b>Starting point:</b> <i>(lat: {props.hike.startingPoint.latitude}, lon: {props.hike.startingPoint.longitude})</i> - {props.hike.startingPoint.city}, {props.hike.startingPoint.province}</li>
                                    <li><b>Ending point:</b> <i>(lat: {props.hike.endingPoint.latitude}, lon: {props.hike.endingPoint.longitude})</i> - {props.hike.endingPoint.city}, {props.hike.endingPoint.province}</li>
                                    <li><b>Length:</b> {props.hike.length} km</li>
                                    <li><b>Ascent:</b> {props.hike.ascent} m</li>
                                    <li><b>Estimated time:</b> {props.hike.estimatedTime} h</li>
                                    <li className="mt-4"><b>Intermediate points of interest:</b></li>
                                    {
                                        open === 1 && <Button variant="link" onClick={() => setOpen(2)}>Show</Button> ||
                                        open === 2 &&
                                        <>
                                            {props.hike.pointsOfInterest.map((poi) =>
                                                <ul>
                                                    <li>
                                                        {poi.type === "hut" &&
                                                            <img src="http://localhost:3000/huticon.svg" alt="huticon" /> ||
                                                            <img src="http://localhost:3000/parkingicon.svg" alt="parkingicon" />
                                                        }
                                                        <i>&nbsp; - (lat: {poi.latitude}, lon: {poi.longitude})</i> - {poi.city}, {poi.province}
                                                    </li>
                                                </ul>)}
                                            <Button variant="link" onClick={() => setOpen(1)}>Hide</Button>
                                        </>
                                    }
                                </ul>
                            </>
                        }
                    </Card.Text>
                    <Col align="right">
                        {open === 0 &&
                            <>
                                {props.user && <Button variant="link" onClick={() => setShowModal(true)}>View in map</Button>}
                                <Button variant="link" onClick={() => setOpen(1)}>More info</Button>
                            </> ||
                            <Button variant="link" onClick={() => setOpen(0)}>Close</Button>
                        }
                    </Col>
                </Card.Body>

            </Card>

            {showModal && <MapModal showModal={showModal} setShowModal={setShowModal} title={props.hike.title} hikeid={props.hike.id} />}

        </Container>
    );
};

function MapModal(props) {

    /* -- STATES MANAGEMENT -- */

    const [coordinates, setCoordinates] = useState({});
    const [firstPoint, setFirstPoint] = useState([]);
    const [lastPoint, setLastPoint] = useState([]);
    const [center, setCenter] = useState([]);

    useEffect(() => {
        const getJson = async () => {
            try {
                const json = await API.getFileById(props.hikeid);
                const c = json.features;

                setCoordinates(c);

                const arrayCoordinates = c[0].geometry.coordinates;
                const last = arrayCoordinates.length - 1;
                const middle = Math.round(last / 2);

                const firstPoint = [arrayCoordinates[0][1], arrayCoordinates[0][0]];
                const center = [arrayCoordinates[middle][1], arrayCoordinates[middle][0]];
                const lastPoint = [arrayCoordinates[last][1], arrayCoordinates[last][0]];

                setFirstPoint(firstPoint);
                setCenter(center);
                setLastPoint(lastPoint);


            } catch (err) { }
        };
        getJson();
    }, []);

    /* -- RENDERING -- */
    return (
        <Modal size="lg" show={props.showModal} onHide={() => props.setShowModal(false)}>

            {/* Modal header */}
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>


            {/* Modal body */}
            <Modal.Body id="mapcontainer">
                {coordinates.length &&
                    <center>
                        <MapContainer style={{ height: "500px", width: "770px" }} center={center} zoom={12} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <GeoJSON data={coordinates} />
                            <Marker position={firstPoint}></Marker>
                            <Marker position={lastPoint}></Marker>
                        </MapContainer>
                    </center>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};




export default Hikes;