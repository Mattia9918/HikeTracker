import { useState } from "react";
import { Container, Form, Row , Col, Button} from "react-bootstrap";
import 'react-phone-number-input/style.css'; 

import { useNavigate } from 'react-router-dom';
import { MapModal } from '../Map/Maps'

import APIHikeForm from '../../API/APIHikeForm';
import APIParkingForm from '../../API/APIParkingForm';


import {TitleParking,ParkingGeo,ParkingInfo,ParkingServ} from './ParkingComp'

function ParkingForm(props) {

    const navigate = useNavigate();
    
    const [name, setName] = useState(""); 
    const [parkingspaces, setParkingspaces] = useState(0); 
    const [priceperhour, setPriceperhour] = useState(0); 
    const [timetablebegin, setTimetablebegin] = useState(""); 
    const [timetableend, setTimetableend] = useState("");
    const [latitude, setLatitude] = useState(""); 
    const [longitude, setLongitude] = useState("");
    const [city, setCity] = useState(""); 
    const [province, setProvince] = useState(""); 
    const [showModal, setShowModal] = useState(false);

    const [guarded, setGuarded] = useState(false); 
    const [disabledparkings, setDisableparkings] = useState(false); 
    

    const submitHandler = async(event) => {
        
        const type = "parking";
        const description = "descrizione parcheggio";
        const user= props.user;
        const timetable = timetablebegin + "-" + timetableend; 
        const parkingPoint = {latitude, longitude, type, description, city, province}
        
        const info = { name , guarded, parkingspaces, priceperhour, disabledparkings, timetable, user, parkingPoint};
        
        event.preventDefault();
        
        await APIParkingForm.postParking(info); 
        
        navigate("/");
    }

    const onClickButton = async (lat, long) => {
        try {
            
            const point = await APIHikeForm.getInfo({lat,long}); 
            
            setCity(point.locality); 
            setProvince(point.localityInfo.administrative[2].name); 

            if (lat === undefined && long === undefined) {
                setLatitude(point.latitude);
                setLongitude(point.longitude);
            }
            
        } catch (err) {
            
        }


    };

    return (
        <Container>
            <Container className="below-nav">
                <Form onSubmit={submitHandler}>
                    <Container className="shadow-sm p-5 w-75" id="cardscontainer">
                        
                        <TitleParking/>

                        <ParkingInfo obj={{name,setName,priceperhour,setPriceperhour,
                                        parkingspaces,setParkingspaces,timetablebegin,setTimetablebegin,
                                        timetableend,setTimetableend
                                    }}
                        /> 
                        
                        <ParkingServ obj={{setDisableparkings,disabledparkings,setGuarded,guarded}}/>

                        <ParkingGeo obj={
                            {latitude,setLatitude,longitude,setLongitude,
                                setShowModal,city,province
                            }
                        }/>
                        
                        <Row align="center">
                            <Col>
                                <Button type="submit" variant="primary" size="lg"> Submit Form </Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>

                {showModal && <MapModal 
                obj={{showModal,setShowModal,markermap:true,setLatitude,setLongitude,onClickButton}}
                />}
            </Container>
           
        </Container>

    ); 




}

export default ParkingForm; 