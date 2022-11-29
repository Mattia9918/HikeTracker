import {  Form, Row , Col, Button} from "react-bootstrap";
import 'react-phone-number-input/style.css'; 



import {Text,Number,Time,DisabledText} from '../Form'; 

const TitleParking = (props)=>{

    return <>
        <h4>New Parking Lot</h4>
        <h6>Fill the form to insert a new Parking Lot</h6>

    </>; 
}

const ParkingInfo = (props)=>{

    const {name,setName,priceperhour,setPriceperhour,
        parkingspaces,setParkingspaces,timetablebegin,setTimetablebegin,
        timetableend,setTimetableend
    } = props.obj; 

    return <>
         <Row className='r'>
            <Col className='c'>
                <Text obj={{label:"Parking Lot name",text:name,setText:setName}}/>
            </Col>
        </Row>

        <Row>
            <Col className='c'>
                <Number obj={{label:"Price per hour",number:priceperhour,setNumber:setPriceperhour}}/>
            </Col>
            <Col className='c'>
                <Number obj={{label:"Parking Spaces available",number:parkingspaces,setNumber:setParkingspaces}}/>
            </Col>
        </Row>
        
        <Row>
            <Col className='c'>
                <Time obj={{label:"Opening time",time:timetablebegin,setTime:setTimetablebegin}}/>
            </Col>
            <Col className='c'>
                <Time obj={{label:"Closing time",time:timetableend,setTime:setTimetableend}}/>      
            </Col>
        </Row>

    </>
}

const ParkingServ = (props)=>{

    const {setDisableparkings,disabledparkings,setGuarded,guarded} = props.obj; 

    return <>
        <br></br>
        <h6>Services</h6>
                        
        <Row>
            
            <Col className="c">
                <Form.Check   label="Disabled Parkings" name="disabled_parkings" value={disabledparkings} 
                onChange={()=>setDisableparkings(old=>!old)}></Form.Check>
            </Col>
            <Col className="c">    
                <Form.Check   label="Guarded Parking" name="guarded" value={guarded} 
                onChange={()=>setGuarded(old=>!old) }></Form.Check>   
            </Col>
            
        </Row>

    </>
}

const ParkingGeo = (props)=>{

    const {latitude,setLatitude,longitude,setLongitude,
        setShowModal,city,province
    } = props.obj; 

    return <>
    
    <h6 className="mt-2">Parking GeoLocalization  </h6>
    
        <Row>
            
            <Col className="c">
                <Number obj={{label:"Parking Latitude",number:latitude,setNumber:setLatitude}}/>
                
            </Col>
            <Col className="c">
                <Number obj={{label:"Parking Longitude",number:longitude,setNumber:setLongitude}}/>
                
            </Col>
            
        </Row>
        
        <Row>
            <Col align = "center">
                <Button variant="success" size="sm" onClick={() => setShowModal(true)}>Find on map</Button>
            </Col>
        </Row>

        <Row className="mt-2 mb-3">
            <Col className="c">
                <DisabledText obj={{label:"Park City",text:city}}/>
                                            
            </Col>
            <Col className="c">

                <DisabledText obj={{label:"Park Province",text:province}}/>
                
            </Col>
            
        </Row>

    </>
}

export {TitleParking,ParkingGeo,ParkingInfo,ParkingServ}; 