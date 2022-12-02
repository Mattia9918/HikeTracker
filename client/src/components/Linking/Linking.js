import { Row, Col, Button, Modal, ListGroup, ButtonGroup, Nav, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import APIHuts from '../../API/APIHutGet';
import APIParkingGet from '../../API/APIParkingGet';
import { AiOutlineHome } from 'react-icons/ai';
import { RiParkingBoxLine } from 'react-icons/ri'

function LinkingModal(props) {

    const [mode, setMode] = useState(0);
    const [hutList, setHutList] = useState([]);
    const [parkingLotList, setParkingLotList] = useState([]);
    const [selectedHut, setSelectedHut] = useState();
    const [selectedParkingLot, setSelectedParkingLot] = useState();

    async function loadParkingLots() {
        //const parkingLotList = [{ name: "Paradise Parking" }, { name: "FreePark" }, { name: "Parcheggio Conad" }, { name: "Baby Parking" }, { name: "Carrefour Parking" }, { name: "Parcheggio via Ivrea" }];
        try {
            const parkingLotList = await APIParkingGet.getParkingLots();
            setParkingLotList(parkingLotList);
        } catch (err) { 
            console.log(err);
        }
    };

    async function loadHuts() {
        try {
            const hutList = await APIHuts.getHuts();
            setHutList(hutList);
        } catch (err) { 
            console.log(err);
        }
    };

    useEffect(() => {
        loadHuts();
    }, []);


    /* -- RENDERING -- */
    return (
        <Modal size="lg" show={props.showLinkingModal} onHide={() => props.setShowLinkingModal(false)}>

            {/* Modal header */}
            <Modal.Header closeButton>

                <Modal.Title>
                    <div>{props.hike.title}</div>
                    <h6>Select a hut or a parking lot to link</h6>
                </Modal.Title>

            </Modal.Header>

            {/* Modal body */}
            <Modal.Body >
                <Row>
                    <Col>
                        <Nav fill variant="tabs" defaultActiveKey="1" id="hpnav">
                            <Nav.Item>
                                <Nav.Link eventKey="1" onClick={() => {
                                    loadHuts();
                                    setMode(0)
                                }}>
                                    <AiOutlineHome className="me-2" style={{ "font-size": "1.2rem", "margin-top": "-5px" }} />
                                    Huts
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2" onClick={() => {
                                    loadParkingLots();
                                    setMode(1)
                                }}>
                                    <RiParkingBoxLine className="me-2" style={{ "font-size": "1.2rem", "margin-top": "-5px" }} />
                                    Parking lots
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListGroup id="hplistgroup">
                            {(mode === 0 &&
                                hutList.map((hut) => <ListGroup.Item action onClick={() => {
                                    setSelectedHut(hut);
                                    setSelectedParkingLot();
                                }}>
                                    <b>{hut.name}</b>, {hut.city}, {hut.province}
                                </ListGroup.Item>)) ||
                                (mode === 1 &&
                                    parkingLotList.map((parkingLot) => <ListGroup.Item action onClick={() => {
                                        setSelectedParkingLot(parkingLot);
                                        setSelectedHut();
                                    }}>
                                    <b>{parkingLot.name}</b>, {parkingLot.city}, {parkingLot.province}
                                    </ListGroup.Item>))}
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                    <Col>
                     <Form.Group>
                       <Form.Control placeholder="Selected item" value = {(selectedHut && selectedHut.name) || (selectedParkingLot && selectedParkingLot.name)} disabled />
                     </Form.Group>
                    </Col>
                    <Col align = "right">
                        <ButtonGroup className = "me-2">
                            <Button variant="primary">Start</Button>
                            <Button variant="primary">Intermediate</Button>
                            <Button variant="primary">End</Button>
                        </ButtonGroup>
                        <Button variant="secondary" onClick={() => props.setShowLinkingModal(false)}>Close</Button>
                    </Col>
            </Modal.Footer>

        </Modal>
    );
};



export { LinkingModal }; 