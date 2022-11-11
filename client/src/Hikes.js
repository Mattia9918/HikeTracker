import {Container, Card, Row, Col, Form, Button, Badge} from 'react-bootstrap';
import { useState } from 'react';

function Hikes(props) {

    const [filter, setFilter] = useState();  
    const [value, setValue] = useState();
    const [textValue, setTextValue] = useState();

    return (
        <>
            <Row>
                <Col >
                </Col>
                <Col xs = {8}>
                    <Container className="mt-3 mb-3 shadow-sm p-2" id = "cardscontainer">
                        <Row>
                            <Col className="mt-2 ms-3" xs = {3}>
                                <Form.Select aria-label="select filter" onChange = {(event) => setFilter(event.target.value)}>
                                    <option disabled = {true}>Filter by</option>
                                    <option value="none" onClick>None</option>
                                    <option value="length">Length</option>
                                    <option value="expectedTime">Expected time</option>
                                    <option value="difficulty">Difficulty</option>
                                    <option value="ascent">Ascent</option>
                                    <option value="province">Province</option>
                                    <option value="city">City</option>
                                </Form.Select>
                            </Col>
                            {(filter == "length" || filter == "difficulty" || filter == "expectedTime" || filter == "ascent") && 
                                <Col className="mt-2 ms-1" xs = {3}>
                                    <Form.Select aria-label="select filter" onChange = {(event) => setValue(event.target.value)}>
                                        <option value={filter == "length" && "10" || filter == "difficulty" && "easy" || filter == "expectedTime" && "1" || filter == "ascent" && "300"}>
                                            {filter == "length" && "between 0 and 10 km" || filter == "difficulty" && "Easy" || filter == "expectedTime" && "less than 1 hour" || filter == "ascent" && "less than 300 m"}
                                        </option>
                                        <option value={filter == "length" && "20" || filter == "difficulty" && "average" || filter == "expectedTime" && "2" || filter == "ascent" && "600"}>
                                            {filter == "length" && "between 10 and 20 km" || filter == "difficulty" && "Average" || filter == "expectedTime" && "between 1 and 2 hours" || filter == "ascent" && "between 300 and 600 m"}
                                        </option>
                                        <option value={filter == "length" && "20+" || filter == "difficulty" && "difficult" || filter == "expectedTime" && "3" || filter == "ascent" && "1000"}>
                                            {filter == "length" && "more than 20 km" || filter == "difficulty" && "Difficult" || filter == "expectedTime" && "between 2 and 3 hours" || filter == "ascent" && "between 600 and 1000 m"}
                                        </option>
                                        {filter == "expectedTime" && <option value = "3+">more than 3 hours</option> || filter == "ascent" && <option value = "1000+">more than 1000 m</option>}
                                    </Form.Select>
                                </Col>
                            }

                            {(filter == "city" || filter == "province") && 
                                <Col className="mt-2 ms-1" xs = {3}>
                                    <Form.Control 
                                        type="text" 
                                        placeholder={filter == "city" && "Insert a city" || "Insert a province"} 
                                        value = {textValue}
                                        required = {true}
                                        onChange = {(event) => setTextValue(event.target.value)}
                                    />
                                </Col>
                            }
                            <Col className="mt-2 ms-1" xs = {2}>
                                <Button>Filter</Button>
                            </Col>

                        </Row> 
                        <Row>

                        <Col>
                            {props.hikes.filter((hike) => hike.id % 2 != 0).map((hike) => <HikeCard key={hike.id} hike={hike}/>)}
                        </Col>
                        <Col>
                            {props.hikes.filter((hike) => hike.id % 2 == 0).map((hike) => <HikeCard key={hike.id} hike={hike}/>)}
                        </Col>
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
    
    const [open, setOpen] = useState(false);
    const difficulty = props.hike.difficulty

    return (
        <Container className="mt-3 mb-3">
        <Card className="shadow-sm p-2">
              {/* -- CARD HEADER -- */}
              <Card.Header>
                <Row>
                    {/* Localguide's username */}
                    <Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6}>
                        <b>Posted by: </b> {props.hike.localguideID}
                    </Col>

                    <Col align = "right">
                        <Badge bg={
                            (difficulty === "Easy" && "success") ||
                            (difficulty === "Average" && "warning") ||
                            (difficulty === "Difficult" && "danger")}>
                            {props.hike.difficulty}
                        </Badge>
                    </Col>

                </Row>
            </Card.Header>

            <Card.Img className = "mt-2" variant="top" src={
                (difficulty === "Easy" && "http://localhost:3000/easyhike.jpg") ||
                (difficulty === "Average" && "http://localhost:3000/averagehike.jpg") ||
                (difficulty === "Difficult" && "http://localhost:3000/difficulthike.jpg")
             } />


            {/* -- CARD BODY -- */}
            <Card.Body>

            <Card.Title>{props.hike.title}</Card.Title>
            <Card.Text>
              {props.hike.description}
              {open && 
              <>
              <br></br><br></br>
              <b>Details:</b>
              <br></br>
              <ul className = "mt-2">
              <li><b>Length:</b> {props.hike.length}</li>
              <li><b>Ascent:</b> {props.hike.ascent}</li>
              <li><b>Estimated time:</b> {props.hike.estimatedTime}</li>
              </ul>
              </>
              }
            </Card.Text>
            <Col align = "right">
                {!open &&
                    <Button variant="link" onClick = {() => setOpen(true)}>More info</Button> || 
                    <Button variant="link" onClick = {() => setOpen(false)}>Close</Button>
                }
            </Col>
            </Card.Body>

        </Card>
    </Container>
    );
};

export default Hikes;