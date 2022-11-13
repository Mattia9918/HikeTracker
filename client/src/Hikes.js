import { Container, Card, Row, Col, Form, Button, Badge, Alert } from 'react-bootstrap';
import { useState } from 'react';

function Hikes(props) {

    /* -- INPUT STATE MANAGEMENT -- */
    const [filter, setFilter] = useState();
    const [value, setValue] = useState();
    const [show, setShow] = useState();
    

    /* -- SUBMIT HANDLER --  */
    const submitHandler = (event) => {
        event.preventDefault();
        props.loadFilter(filter, value)

    };

    return (
        <>
            <Row>
                <Col >
                </Col>
                <Col sm={8} xs={12}>
                    {(props.msg.message === "You have been logged out!" || (props.user && props.msg.message === `Welcome ${props.user.username}!`))  && 
                        <Alert variant = {props.msg.type} onClose={() => {
                            props.setMsg("");
                            setShow(false);
                        }} show={show} dismissible> 
                            {props.msg.message}
                        </Alert>
                    }
                    <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
                        <Form onSubmit={submitHandler}>
                            <Row>
                                <Col className="mt-2 ms-3" xs={3}>
                                    <Form.Select aria-label="select filter"
                                        onChange={(event) => {
                                            setValue();
                                            setFilter(event.target.value)
                                        }}>
                                        <option disabled={true}>Filter by</option>
                                        <option value="none">None</option>
                                        <option value="length">Length</option>
                                        <option value="expectedTime">Expected time</option>
                                        <option value="difficulty">Difficulty</option>
                                        <option value="ascent">Ascent</option>
                                        <option value="province">Province</option>
                                        <option value="city">City</option>
                                    </Form.Select>
                                </Col>
                                {(filter == "length" || filter == "difficulty" || filter == "expectedTime" || filter == "ascent") &&
                                    <Col className="mt-2 ms-1" xs={3}>
                                        <Form.Select aria-label="select filter" onChange={(event) => setValue(event.target.value)}>
                                            <option value={filter == "length" && "0,10" || filter == "difficulty" && "Easy" || filter == "expectedTime" && "0,1" || filter == "ascent" && "0,300"}>
                                                {filter == "length" && "between 0 and 10 km" || filter == "difficulty" && "Easy" || filter == "expectedTime" && "less than 1 hour" || filter == "ascent" && "less than 300 m"}
                                            </option>
                                            <option value={filter == "length" && "11,20" || filter == "difficulty" && "Average" || filter == "expectedTime" && "1,2" || filter == "ascent" && "301,600"}>
                                                {filter == "length" && "between 10 and 20 km" || filter == "difficulty" && "Average" || filter == "expectedTime" && "between 1 and 2 hours" || filter == "ascent" && "between 300 and 600 m"}
                                            </option>
                                            <option value={filter == "length" && "21,1000" || filter == "difficulty" && "Difficult" || filter == "expectedTime" && "2,3" || filter == "ascent" && "601,1000"}>
                                                {filter == "length" && "more than 20 km" || filter == "difficulty" && "Difficult" || filter == "expectedTime" && "between 2 and 3 hours" || filter == "ascent" && "between 600 and 1000 m"}
                                            </option>
                                            {filter == "expectedTime" && <option value="3,1000">more than 3 hours</option> || filter == "ascent" && <option value="1001,100000">more than 1000 m</option>}
                                        </Form.Select>
                                    </Col>
                                }

                                {(filter == "city" || filter == "province") &&
                                    <Col className="mt-2 ms-1" xs={3}>
                                        <Form.Control
                                            type="text"
                                            placeholder={filter == "city" && "Insert a city" || "Insert a province"}
                                            value={value}
                                            required={true}
                                            onChange={(event) => setValue(event.target.value)}
                                        />
                                    </Col>
                                }
                                    <Col className="mt-2 ms-1" xs={2}>
                                        <Button type="submit" disabled={filter != "none" && value == undefined && true}>Filter</Button>
                                    </Col>
    

                            </Row>
                        </Form>
                        <Row>
                            {(props.hikes.length === 1 && props.hikes[0].id == undefined) ||
                                <>
                                    <Col>
                                        {props.hikes.filter((hike) => hike.id % 2 != 0).map((hike) => <HikeCard key={hike.id} hike={hike} />)}
                                    </Col>
                                    <Col>
                                        {props.hikes.filter((hike) => hike.id % 2 == 0).map((hike) => <HikeCard key={hike.id} hike={hike} />)}
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

function HikeCard(props) {

    const [open, setOpen] = useState(0);
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
                    (difficulty === "Easy" && "http://localhost:3000/easyhike.jpg") ||
                    (difficulty === "Average" && "http://localhost:3000/averagehike.jpg") ||
                    (difficulty === "Difficult" && "http://localhost:3000/difficulthike.jpg")
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
                                                        <img src = "http://localhost:3000/huticon.svg" alt = "huticon"/> ||
                                                        <img src = "http://localhost:3000/parkingicon.svg" alt = "parkingicon" />
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
                            <Button variant="link" onClick={() => setOpen(1)}>More info</Button> ||
                            <Button variant="link" onClick={() => setOpen(0)}>Close</Button>
                        }
                    </Col>
                </Card.Body>

            </Card>
        </Container>
    );
};

export default Hikes;