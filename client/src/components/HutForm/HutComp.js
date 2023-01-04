
import {  Form, Row , Col, Button} from "react-bootstrap";
import 'react-phone-number-input/style.css'; 
import PhoneInput from 'react-phone-number-input'; 

import {Text,Email,Url,Select,Number} from '../Form'; 


const HutInfo = (props)=>{

    const {hutname,setHutname,address,setAddress,phonenumber,setPhonenumber,
        email,setEmail,website,setWebsite,description,setDescription,setLanguage,setReachability
    } = props.obj; 

    return <div className="mb-3">
    
            <Row className='r'>
                                
                <Col className='c'>
                    <Text obj={{label:"Hut name",text:hutname,setText:setHutname}}/>
                </Col>
            </Row>

            <Row>
                <Col className='c'>
                    <Text obj={{label:"Hut address",text:address,setText:setAddress}}/>
                </Col>

                <Col className='c'>
                    <Form.Label>Phone Number</Form.Label>
                    <PhoneInput placeholder="Enter phone number" value={phonenumber} onChange={setPhonenumber}/>
                </Col>
            </Row>

            <Row>
                <Col className='c'>
                    <Email obj={{email,setEmail,label:"Hut e-mail"}}/>
                </Col>

                <Col className='c'>
                    <Url obj={{url:website,setUrl:setWebsite,label:"Web Site"}}/>
                </Col>

            </Row>
            <Row>
                <Col className='c'>
                    <Text obj={{label:"Hut description",text:description,setText:setDescription}}/>
                </Col>    
            </Row>
            
            <br></br>
            
            <Row>
                <Col className="c">
                    <Select obj={{label:"Additional language spoken",
                        setSelect:setLanguage,
                        options:["English","French","German"]
                    }} />
                </Col>
                
                <Col className='c'>
                        <Select obj={{label:"Reachability Option",
                                setSelect:setReachability,
                                options:["With normal car","With off-road car","On foot","Cableway"]
                            }} />
                    
                </Col>
            </Row>
    </div>
}

const HutGeo = (props)=>{

    const {altitude,setAltitude,latitude,setLatitude,longitude,
        setLongitude,setShowModal,city,setCity,province,setProvince} = props.obj; 

    return <>
        <h6>Hut GeoLocalization  </h6>
                        
            <Row>
                <Col className="c">

                    <Number obj={{label:"Hut altitude",
                                    setNumber:setAltitude,
                                    number:altitude,
                                    disable:false
                                    }}
                    />
                </Col>
                
            </Row>
            <Row>
                <Col className="c">
                    <Number obj={{label:"Hut latitude",
                                        setNumber:setLatitude,
                                        number:latitude,
                                        disabled:true
                                        }}
                        />
                </Col>
                <Col className="c">
                    <Number obj={{label:"Hut longitude",
                                            setNumber:setLongitude,
                                            number:longitude,
                                            disabled:true
                                            }}
                            />
                </Col>
                
            </Row>
            
            <Row>
                <Col align = "center">
                    <Button variant="success" size="sm" onClick={() => setShowModal(true)}>Find on map</Button>
                </Col>
            </Row>
            <br></br>

            <Row className="mb-3">
                <Col className="c">
                    <Form.Label>Hut City</Form.Label>
                    <Form.Control type='text' value={city} onChange={ev => setCity(ev.target.value)} disabled />                                
                </Col>
                <Col className="c">
                    <Form.Label>Hut Province</Form.Label>
                    <Form.Control type='text' value={province} onChange={ev => setProvince(ev.target.value)} disabled />
                </Col>
                
            </Row>
    </>; 
}

const Services = (props)=>{

    const {bikefriendly,setBikefriendly,
        restservice,setRestservice,disable,setDisable
    } = props.obj; 

    return <>
        <h6>Services</h6>
                        
        <Row>
            
            <Col className="c">
                <Form.Check   label="Bike Friendly" name="bike_friendly" value={bikefriendly} onChange={()=>setBikefriendly(old=>!old)} ></Form.Check>
            </Col>
            <Col className="c">    
                <Form.Check   label="Restaurant" name="restaurant" value={restservice} onChange={()=>setRestservice(old=>!old) }></Form.Check>
                
            </Col>
            
        </Row>

        <Row className="mb-3">
            <Col className="c">
                <Form.Check  label="Services for disable" name="disable" value={disable} onChange={()=>setDisable(old=>!old) }></Form.Check>
            </Col>
        </Row>
    </>; 
}


const Accomodation = (props)=>{

    const {rooms,setRooms,beds,setBeds,bathrooms,setBathrooms} = props.obj; 

    return <>
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
            
    </>; 
}

const Picture = (props)=>{

    return <>
        <Row className='r' style = {{"marginBottom":"-30px"}}>
            <Col className = 'c' style = {{"marginBottom":"0px"}}>
                Select an image for your hut
            </Col>
        </Row>

        <Row className='r'>
            <Col className = 'c'>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control 
                        type="file"
                        onChange={(e) => props.setImage(e.target.files[0])}
                        required = {true}/>
                </Form.Group>
                
            </Col>
        </Row>
    </>
}

export {HutInfo,HutGeo,Services,Accomodation, Picture}; 