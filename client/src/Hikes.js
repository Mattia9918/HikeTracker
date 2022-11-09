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
                            {(filter == "length" || filter == "difficulty" || filter == "expectedTime") && 
                                <Col className="mt-2 ms-1" xs = {3}>
                                    <Form.Select aria-label="select filter" onChange = {(event) => setValue(event.target.value)}>
                                        <option value={filter == "length" && "10" || filter == "difficulty" && "easy" || filter == "expectedTime" && "1"}>
                                            {filter == "length" && "0 - 10 km" || filter == "difficulty" && "Easy" || filter == "expectedTime" && "less than 1 hour"}
                                        </option>
                                        <option value={filter == "length" && "20" || filter == "difficulty" && "average" || filter == "expectedTime" && "2"}>
                                            {filter == "length" && "10 - 20 km" || filter == "difficulty" && "Average" || filter == "expectedTime" && "between 1 and 2 hours"}</option>
                                        <option value={filter == "length" && "30" || filter == "difficulty" && "difficult" || filter == "expectedTime" && "3"}>
                                            {filter == "length" && "20 - 30 km" || filter == "difficulty" && "Difficult" || filter == "expectedTime" && "between 2 and 3 hours"}</option>
                                        {filter == "expectedTime" && <option value = "3+">more than 3 hours</option>}
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
                            {props.hikes.map((hike) => <HikeCard key={hike.id} hike={hike}/>)}
                    </Container>
                </Col>
                <Col>
                </Col>
            </Row>
        </>
    )
};

function HikeCard(props) {
    
    const difficulty = props.hike.difficulty

    return (
        <Container className="mt-3 mb-3">
        <Card className="shadow-sm p-2">
              {/* -- CARD HEADER -- */}
              <Card.Header>
                <Row>
                    {/* Localguide's username */}
                    <Col xxl={10} xl={9} lg={9} md={8} sm={6} xs={6}>
                        <b>Posted by: </b> {props.hike.localguideID}
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


            {/* -- CARD BODY -- */}
            <Card.Body>

            <Card.Title>{props.hike.title}</Card.Title>
            <Card.Text>
              {props.hike.description}
            </Card.Text>
            </Card.Body>

        </Card>
    </Container>
    );
};

export default Hikes;