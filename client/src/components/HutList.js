import { Container, Card, Row, Col, Button, Badge, Accordion, ListGroup } from 'react-bootstrap';
import {  useState } from 'react';
import APIHikes from '../API/APIHikes';
function HutList(props) {
    console.log(props.huts)
    return (
        <>
            <Container>
                <Container className="mt-3 mb-3 shadow-sm p-2" id="cardscontainer">
                    <FilterMenu loadFilter={props.loadHutsFilter}/>
                    <Row>
                    {(props.huts.length === 1 && props.huts[0].id == undefined) ||
                                <>
                                    <Col lg = {6} xs = {12}>
                                        {props.huts.filter((Hut) => Hut.id % 2 != 0).map((Hut) => <HutCard key={Hut.id} Hut={Hut} user={props.user} />)}
                                    </Col>
                                    <Col>
                                        {props.huts.filter((Hut) => Hut.id % 2 == 0).map((Hut) => <HutCard key={Hut.id} Hut={Hut} user={props.user} />)}
                                    </Col>
                                </>
                            }
                    </Row>
                </Container>
            </Container>
        </>
    )
}

function HutCard(props) {
    const [open, setOpen] = useState(false);

    return (
        <Container className="mt-3 mb-3">
            <Card className="shadow-sm p-2">
                {/* -- CARD HEADER -- */}
                <Card.Header>
                    <Row>
                        <Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6}>
                            <b>NA CAPANNA</b>
                        </Col>

                        <Col align="right">
                            <Badge bg={"success"}>
                            </Badge>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Img className="mt-2" variant="top" src={'http://localhost:3000/nicehut.jpg'} />

                {/* -- CARD BODY -- */}
                <Card.Body>
                    <Card.Title>Capanna da Calogero</Card.Title>
                    <Card.Text>
                        <ul>
                            <li><b>Hut: </b>{props.Hut.name}</li>
                            <li><b>Address:</b> {props.Hut.address}</li>
                            <li><b>City:</b> {props.Hut.city}</li>
                            <li><b>Phone number:</b> {props.Hut.phone_number}</li>
                            <li><b>Email:</b> {props.Hut.email}</li>
                            <li><b>Web Site:</b> {props.Hut.web_site}</li>
                        </ul>
                        <br></br>
                        <a onClick={() => setOpen(true)}> SHOWMORE <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                        </svg></a>
                        {open &&
                            <>
                                <br></br><br></br>
                                <b>Details:</b>
                                <br></br>
                                <ul className="mt-2">
                                    <li><b>Description:</b> {props.Hut.description}</li>
                                    <li><b>Altitude:</b> {props.Hut.altitude}</li>
                                    <li><b>Languages:</b> {props.Hut.languages}</li>
                                    <li><b>Bathrooms:</b> {props.Hut.bathrooms}</li>
                                    <li><b>Bedrooms:</b> {props.Hut.bedrooms}</li>
                                    {props.Hut.bike_friendly && <li><b>The place is Bike Friendly</b> </li>}
                                    {props.Hut.resturant_service && <li><b>Has a Resturant Service</b></li>}

                                </ul>
                                <a onClick={() => setOpen(false)}> SHOWLESS <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                                </svg></a>
                            </>
                        }
                    </Card.Text>
                </Card.Body>

            </Card>
        </Container >
    )
}

function FilterMenu(props) {

    const [cities, setCities] = useState();
    const [provinces, setProvinces] = useState();
    const [selected, setSelected] = useState('');

    const buttonValues = [];
    buttonValues['resturant'] = 'outline-primary';
    buttonValues['disability'] = 'outline-primary';
    buttonValues['sleep'] = 'outline-primary';
    buttonValues['bike'] = 'outline-primary';

    buttonValues[selected] = 'primary'
    
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
        <Row className = "mt-3 mb-1 ms-1 me-1">
                <Accordion >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Filtering options</Accordion.Header>
                        <Accordion.Body>
                            <Accordion>
                                <Row>
                                <Col>
                                <Accordion.Item eventKey="1" id = "secondaryaccordion">
                                    <Accordion.Header id = "filter" >Distance</Accordion.Header>
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


                                <Accordion.Item eventKey="2" id = "secondaryaccordion">
                                    <Accordion.Header>Reachability</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("reach", "With normal car")}>
                                                With normal car
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("reach", "With off-road car")}>
                                                With off-road car
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("reach", "On foot")}>
                                                On foot
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("reach", "Cableway")}>
                                                Cableway
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="3" id = "secondaryaccordion">
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
                                <Col>
                                <Accordion.Item eventKey="4" id = "secondaryaccordion">
                                    <Accordion.Header>Altitude</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("altitude", "0,1000")}>
                                                Less than 1000 m
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("altitude", "1001,1300")}>
                                                Between 1000 m and 1300 m
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("altitude", "1301,1800")}>
                                                Between 1300 m and 1800 m
                                            </ListGroup.Item>
                                            <ListGroup.Item id = "smallgroups" action={true} onClick={() => props.loadFilter("altitude", "1801,100000")}>
                                                More than 1800 m
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="5" id = "secondaryaccordion" onClick={() => loadList("province")}>
                                    <Accordion.Header>Province</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            {provinces && provinces.map(({province}) => <ListGroup.Item key = {province} id = "smallgroups" action = {true} onClick={() => props.loadFilter("province", province)}>{province}</ListGroup.Item>)}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                                <Accordion.Item eventKey="6" id = "secondaryaccordion" onClick={() => loadList("city")}>
                                    <Accordion.Header>City</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant = "flush">
                                            {cities && cities.map(({city}) => <ListGroup.Item key = {city} id = "smallgroups" action = {true} onClick={() => props.loadFilter("city", city)}>{city}</ListGroup.Item>)}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                                </Col>
                                <Col>
                                    <Button size="sm" style={{width: "10" }} variant={buttonValues['resturant']} onClick={() => {
                                        setSelected('resturant');
                                        props.loadFilter("restaurant_service");
                                    }}>Have Resturant</Button>

                                    <Button size="sm" variant={buttonValues['disability']} onClick={() => {
                                        setSelected('disability');
                                        props.loadFilter("disabled_services");
                                    }}>Disability Service</Button>
                                    <Button size="sm" variant={buttonValues['sleep']} onClick={() => {
                                        setSelected('sleep');
                                        props.loadFilter("beds");
                                    }}>Can Sleep</Button>
                                </Col>
                                <Col>
                                    <Button size="sm" variant={buttonValues['bike']} onClick={() => {
                                        setSelected('bike');
                                        props.loadFilter("bike_friendly");
                                    }}>Is bike Friendly</Button>

                                    <Button variant="danger" onClick={() => {
                                        props.loadFilter("none");
                                        setSelected('');
                                    }}>Reset</Button>
                                </Col>
                                </Row>
                            </Accordion>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
        </Row>
    );
}

export default HutList;