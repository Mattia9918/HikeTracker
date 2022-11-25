import { useState } from "react";
import { Container, Form, Row , Col, Button} from "react-bootstrap";
import 'react-phone-number-input/style.css'; 
import CurrencyInput from 'react-currency-input-field';
import PhoneInput from 'react-phone-number-input'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Parking(props) {

    const [name, setName] = useState(""); 
    const [address, setAddress] = useState(""); 
    const [guarded, setGuarded] = useState(0); 
    const [parkingspaces, setParkingspaces] = useState(0); 
    const [priceperhour, setPriceperhour] = useState(0); 
    const [disabledparkings, setDisableparkings] = useState(0); 
    const [timetablebegin, setTimetablebegin] = useState(""); 
    const [timetableend, setTimetableend] = useState("");
    const [latitude, setLatitude] = useState(""); 
    const [longitude, setLongitude] = useState("");
    
    const [locality, setLocality] = useState(""); 
    const [principalSubdivision, setPrincipalSubdivision] = useState(""); 

    

    const submitHandler = (event) => {
        
        const type = "parking";
        const description = "Torchiano 4ever";
        const user= props.user;
        const timetable = timetablebegin + "-" + timetableend; 
        console.log(user); 
        const parkingPoint = {latitude, longitude, type, description, locality, principalSubdivision}
        const info = { name , guarded, parkingspaces, priceperhour, disabledparkings, timetable, user, parkingPoint};
        
        event.preventDefault();
        console.log(info);
        props.postParking(info);
        
        //navigate("/");
    }

    const onClickButton = async e => {

        e.preventDefault();
       

        try {
           
            const parkingPoint = await axios.get('http://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + latitude + '&longitude=' + longitude + '&localityLanguage=en');
            console.log(parkingPoint.data);  
            setLocality(parkingPoint.data.locality); 
            setPrincipalSubdivision(parkingPoint.data.principalSubdivision); 
            
        } catch (err) {
            
        }


    };

    return (
        <Container>
            <Container className="below-nav">
                <Form onSubmit={submitHandler}>
                    <Container className="shadow-sm p-5 w-75" id="cardscontainer">
                        <h4>New Parking Lot</h4>
                        <h6>Fill the form to insert a new Parking Lot</h6>

                        <Row className='r'>
                            <Col className='c'>
                                <Form.Label>Parking Lot name</Form.Label>
                                <Form.Control value={name} onChange={ev => setName(ev.target.value)} placeholder="Enter parking lot name" required />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='c'>
                                <Form.Label>Price per hour </Form.Label>
                                <Form.Control type="number" placeholder="Enter phone number" value={priceperhour} onChange={ev => setPriceperhour(ev.target.value)}/>
                            </Col>
                            <Col className='c'>
                                <Form.Label>Parking Spaces available</Form.Label>
                                <Form.Control type="number" placeholder="Enter phone number" value={parkingspaces} onChange={ev => setParkingspaces(ev.target.value)}/>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col className='c'>
                                <Form.Label>Opening time</Form.Label>
                                <Form.Control type="time" placeholder="Enter phone number" value={timetablebegin} onChange={ev => setTimetablebegin(ev.target.value)}/>
                            </Col>
                            <Col className='c'>
                                <Form.Label>Closing time</Form.Label>
                                <Form.Control type="time" placeholder="Enter phone number" value={timetableend} onChange={ev => setTimetableend(ev.target.value)}/>
                            </Col>
                        </Row>

                        <br></br>
                        <h6>Services</h6>
                        
                        <Row>
                            
                            <Col className="c">
                                <Form.Check   label="Disabled Parkings" name="disabled_parkings" value={disabledparkings} onChange={ev => {disabledparkings == 0 ? setDisableparkings(1): setDisableparkings(0); console.log(disabledparkings)} }></Form.Check>
                            </Col>
                            <Col className="c">    
                                <Form.Check   label="Guarded Parking" name="guarded" value={guarded} onChange={ev => {guarded == 0 ? setGuarded(1) : setGuarded(0); console.log(guarded)} }></Form.Check>   
                            </Col>
                            
                        </Row>

                        <br></br>
                        <h6>Parking GeoLocalization  </h6>
                        
                        <Row>
                            
                            <Col className="c">
                                <Form.Label>Parking Latitude</Form.Label>
                                <Form.Control type='number' value={latitude} onChange={ev => setLatitude(ev.target.value)} placeholder="Enter park latitude" required />
                            </Col>
                            <Col className="c">
                                <Form.Label>Parking Longitude</Form.Label>
                                <Form.Control type='number' value={longitude} onChange={ev => setLongitude(ev.target.value)} placeholder="Enter park longitude" required />
                            </Col>
                            
                        </Row>
                        
                        <Row>
                            <Col align = "center">
                                <Button variant="success" size="sm" onClick={onClickButton}>upload</Button>
                            </Col>
                        </Row>
                        <br></br>

                        <Row>
                            <Col className="c">
                                <Form.Label>Park City</Form.Label>
                                <Form.Control type='text' value={locality} onChange={ev => setLocality(ev.target.value)} disabled />                                
                            </Col>
                            <Col className="c">
                                <Form.Label>Park Province</Form.Label>
                                <Form.Control type='text' value={principalSubdivision} onChange={ev => setPrincipalSubdivision(ev.target.value)} disabled />
                            </Col>
                            
                        </Row>

                        <br></br>
                        <br></br>
                        <Row align="center">
                            <Col>
                                <Button type="submit" variant="primary" size="lg"> Submit Form </Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>

            </Container>
        </Container>

    ); 




}

export default Parking; 