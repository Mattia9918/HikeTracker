import { Container, Card, Row, Col, Form, Button, Badge, Alert, Modal, Accordion, ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, Popup } from 'react-leaflet';
import API from '../API/APIGpx';
import APIHikes from '../API/APIHikes';
import {AreaDragMap, MapItem, MarkerMap} from './Map/Maps';


function Hikes(props) {

    /* -- INPUT STATE MANAGEMENT -- */

    const [show, setShow] = useState();

    return (
        <>
            <Row>
                <Col >
                </Col>
                <Col lg={8} xs={12}>
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
                                    <Col lg = {6} xs = {12}>
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

    const [cities, setCities] = useState();
    const [provinces, setProvinces] = useState();
    const [showModal, setShowModal] = useState(false);
    
    async function loadList(type) {

        let citieslist;
        let provincelist;

        switch(type) {
            case "city":
                citieslist = await APIHikes.getHikeCities();
                setCities(citieslist);
                break;

            case "province":
                provincelist = await APIHikes.getHikeProvinces();
                setProvinces(provincelist);
                break;
        }
    }

    return (
        <>
        <Row className = "mt-3 mb-1 ms-1 me-1">
                <Accordion >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Filtering options</Accordion.Header>
                        <Accordion.Body>
                            <Accordion>
                                <Row>
                                <Col lg = {4}>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header id = "filter" >Length</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
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


                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Estimated time</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
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

                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>Difficulty</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
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
                                <Col lg = {4}>
                                <Accordion.Item eventKey="4">
                                    <Accordion.Header>Ascent</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "-10000,-101")}>
                                                Steep descent (more than -100m)
                                            </ListGroup.Item>
                                           <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "-100,-1")}>
                                                Small descent (less than -100m)
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "0,100")}>
                                                Small ascent (Less than 100 m)
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "101,300")}>
                                                Decent ascent (between 100 m and 300 m)
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "301,600")}>
                                                Steep ascent (Between 300 m and 600 m)
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("ascent", "601,100000")}>
                                                Climbing (more than 600 m)
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="5" onClick={() => loadList("province")}>
                                    <Accordion.Header>Province</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            {provinces && provinces.map(({province}) => <ListGroup.Item key = {province} id = "smallgroups" action = {true} onClick={() => props.loadFilter("province", province)}>{province}</ListGroup.Item>)}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="6" onClick={() => loadList("city")}>
                                    <Accordion.Header>City</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            {cities && cities.map(({city}) => <ListGroup.Item key = {city} id = "smallgroups" action = {true} onClick={() => props.loadFilter("city", city)}>{city}</ListGroup.Item>)}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                                </Col>
                                <Col lg = {4}>
                                <center>
                                    <Button variant = "outline-primary" onClick = {() => {setShowModal(true)}}>Find in geographic area</Button>
                                </center>
                                <br></br>
                                <center>
                                    <Button align = "right" onClick={() => props.loadFilter("none")}>Reset filters</Button>
                                </center>
                                </Col>
                                </Row>
                            </Accordion>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
        </Row>

        {showModal && <MapModal showModal={showModal} setShowModal={setShowModal} areadragmap = {true} loadFilter = {props.loadFilter}/>}
        </>
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
    const [latlng,setLatlng] = useState([]); 
    const [bounds,setBounds] = useState([]);

    /* -- RENDERING -- */
    return (
        <Modal size="lg" show={props.showModal} onHide={() => props.setShowModal(false)}>

            {/* Modal header */}
            <Modal.Header closeButton>
                <Modal.Title>{
                    (props.areadragmap && "Filter by geographic area") || 
                    (props.markermap && "Click to add a pointer on a location") ||
                     props.title}
                </Modal.Title>
            </Modal.Header>


            {/* Modal body */}
            <Modal.Body id="mapcontainer">
                {props.areadragmap && <>Press ctrl + mouse drag to define a geographic area where you want to find hikes<br></br><hr></hr></>}
                {(props.areadragmap &&
                    <AreaDragMap mode = {2} bounds = {bounds} setBounds = {setBounds} />) ||
                 (props.markermap && 
                    <MarkerMap latlng = {latlng} setLatlng = {setLatlng} iconmode = {props.iconmode} />) ||
                <MapItem hikeid={props.hikeid} latlng = {latlng} setLatlng = {setLatlng} bounds = {bounds} setBounds = {setBounds} mode = {props.mode} />
                }
            </Modal.Body>
            <Modal.Footer>
                {
                 (props.areadragmap && <Button onClick={() => props.loadFilter("area", bounds)}>Search</Button>) ||
                 (props.markermap && 
                 <>
                 <Button onClick={() => { 
                    props.setLatitude(latlng.lat); 
                    props.setLongitude(latlng.lng);
                    props.onClickButton(latlng.lat, latlng.lng);
                    props.setShowModal(false);
                }}>
                    Continue</Button>
                  <Button onClick={() => {
                    props.onClickButton(undefined, undefined);
                    props.setShowModal(false);
                  }}>Pick my position
                  </Button>
                 </>
                 )
                }
                <Button variant = "secondary" onClick={() => props.setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};




export {Hikes, MapModal};