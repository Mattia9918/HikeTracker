import { useState } from "react";
import { Container, Form, Row , Col, Button} from "react-bootstrap";
import 'react-phone-number-input/style.css'; 
import PhoneInput from 'react-phone-number-input'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



//import '../../css/hutFormCss.css';


function Hut(props) {

    const [hutname, setHikename] = useState(""); 
    const [address, setAddress] = useState(""); 
    const [phonenumber, setPhonenumber] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [website, setWebsite] = useState(""); 
    const [description, setDescription] = useState(""); 
    const [latitude, setLatitude] = useState(""); 
    const [longitude, setLongitude] = useState("");
    const [altitude, setAltitude] = useState(""); 
    const [rooms, setRooms] = useState("");
    const [bathrooms, setBathrooms] = useState(""); 
    const [beds, setBeds] = useState("");     
    const [city, setCity] = useState(""); 
    const [province, setProvince] = useState(""); 
    const [language, setLanguage] = useState(""); 
    const [restservice, setRestservice] = useState(false); 
    const [disable, setDisable] = useState(false); 
    const [bikefriendly, setBikefriendly] = useState(false);
    const [reachability, setReachability] = useState("");  

    console.log(props);

    const navigate = useNavigate();

    const submitHandler = (event) => {
        
       

        const info = { hutname, address, phonenumber, email, website, altitude ,language, description, latitude, longitude, rooms, bathrooms, reachability, beds, city, province, restservice, disable, bikefriendly };

        event.preventDefault();
        console.log(info);
        props.postHut(info);

        navigate("/huts");
    }



    const onClickButton = async e => {

        e.preventDefault();
       

        try {
           
            const point = await axios.get('http://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + latitude + '&longitude=' + longitude + '&localityLanguage=en');
            //console.log(point.data);  
            setCity(point.data.locality); 
            setProvince(point.data.localityInfo.administrative[2].name); 
            
        } catch (err) {
            
        }


    };
    


    return (
        <Container >
            <Container className='below-nav' >
                <Form onSubmit={submitHandler}>
                    <Container className="shadow-sm p-5 w-75" id="cardscontainer">
                        <h4>New Hut</h4>
                        <h6>Fill the form to insert a new Hut</h6>
                        <Row className='r'>
                            <Col className='c'>
                                <Form.Label>Hut name</Form.Label>
                                <Form.Control value={hutname} onChange={ev => setHikename(ev.target.value)} placeholder="Enter hut name" required />
                            </Col>
                            
                        </Row>
                        <Row>
                            <Col className='c'>
                                <Form.Label>Hut address</Form.Label>
                                <Form.Control value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Enter hut address" required />
                            </Col>
                            <Col className='c'>
                                <Form.Label>Phone Number</Form.Label>
                                <PhoneInput placeholder="Enter phone number" value={phonenumber} onChange={setPhonenumber}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='c'>
                                <Form.Label>Hut e-mail</Form.Label>
                                <Form.Control type='email' value={email} onChange={ev => setEmail(ev.target.value)} placeholder="Enter hut e-mail" required />
                            </Col>
                            <Col className='c'>
                                <Form.Label>Web Site</Form.Label>
                                <Form.Control type='url' value={website} onChange={ev => setWebsite(ev.target.value)} placeholder="Enter hut web site"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='c'>
                                <Form.Label>Hut description</Form.Label>
                                <Form.Control type='text' value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Enter hut description" required />
                            </Col>    
                        </Row>
                        <br></br>
                        <Row>
                            <Col className="c">
                                <Form.Label>Additional language spoken</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={ev => setLanguage(ev.target.value)}>
                                    <option ></option>
                                    <option value="english">English</option>
                                    <option value="french">French</option>
                                    <option value="german">German</option>
                                </Form.Select>
                            </Col>
                            <Col className='c'>
                                <Form.Label>Reachability Option</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={ev => setReachability(ev.target.value)}>
                                    <option ></option>
                                    <option value="normal">With normal car</option>
                                    <option value="offroad">With off-road car</option>
                                    <option value="foot">On foot</option>
                                    <option value="cable">Cableway</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <br></br>
                        <h6>Hut GeoLocalization  </h6>
                        <Row>
                            <Col className="c">
                                <Form.Label>Hut altitude</Form.Label>
                                <Form.Control type='number' value={altitude} onChange={ev => setAltitude(ev.target.value)} placeholder="Enter hut altitude" required />
                            </Col>
                            <Col className="c">
                            </Col>
                         
                        </Row>
                        <Row>
                            
                            <Col className="c">
                                <Form.Label>Hut Latitude</Form.Label>
                                <Form.Control type='number' value={latitude} onChange={ev => setLatitude(ev.target.value)} placeholder="Enter hut latitude" required />
                            </Col>
                            <Col className="c">
                                <Form.Label>Hut Longitude</Form.Label>
                                <Form.Control type='number' value={longitude} onChange={ev => setLongitude(ev.target.value)} placeholder="Enter hut longitude" required />
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
                                <Form.Label>Hut City</Form.Label>
                                <Form.Control type='text' value={city} onChange={ev => setCity(ev.target.value)} disabled />                                
                            </Col>
                            <Col className="c">
                                <Form.Label>Hut Province</Form.Label>
                                <Form.Control type='text' value={province} onChange={ev => setProvince(ev.target.value)} disabled />
                            </Col>
                            
                        </Row>
                        <br></br>
                        <h6>Services</h6>
                        
                        <Row>
                            
                            <Col className="c">
                                <Form.Check   label="Bike Friendly" name="bike_friendly" value={bikefriendly} onChange={()=>setBikefriendly(old=>!old)} ></Form.Check>
                            </Col>
                            <Col className="c">    
                                <Form.Check   label="Restaurant" name="restaurant" value={restservice} onChange={()=>setRestservice(old=>!old) }></Form.Check>
                                
                            </Col>
                            
                        </Row>

                        <Row>
                            <Col className="c">
                                <Form.Check  label="Services for disable" name="disable" value={disable} onChange={()=>setDisable(old=>!old) }></Form.Check>
                            </Col>
                        </Row>

                        <br></br>
                        <h6>Accomodation Information</h6>
                        
                        <Row>
                            
                            <Col className="c">
                                <Form.Label>Number of rooms</Form.Label>
                                <Form.Control type='number' value={rooms} onChange={ev => setRooms(ev.target.value)} placeholder="Enter the number of rooms" required />
                            </Col>
                            <Col className="c">
                                <Form.Label>Number of Beds</Form.Label>
                                <Form.Control type='number' value={beds} onChange={ev => setBeds(ev.target.value)} placeholder="Enter the number of beds" required />
                            </Col>
                            
                            
                            
                        </Row>
                        <Row>
                            
                            <Col className="c">
                                <Form.Label>Bathrooms</Form.Label>
                                <Form.Control type='number' value={bathrooms} onChange={ev => setBathrooms(ev.target.value)} placeholder="Enter the number of bathrooms" required />
                            </Col>
                            <Col className="c"></Col>
                        </Row>
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



export default Hut;