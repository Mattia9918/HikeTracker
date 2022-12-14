import { useState } from "react";
import { Container, Form, Row , Col, Button} from "react-bootstrap";
import 'react-phone-number-input/style.css'; 
import { useNavigate } from 'react-router-dom';
import { MapModal } from '../Map/Maps';


import {HutInfo,HutGeo,Services,Accomodation, Picture} from "./HutComp"; 

import APIHikeForm from '../../API/APIHikeForm';
import APIHutForm from '../../API/APIHutForm';


function HutForm(props) {

    const [hutname, setHutname] = useState(""); 
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
    const [image, setImage] = useState();  
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async(event) => {
        
        const hut = { hutname, address, phonenumber, email, website, altitude ,language, description, latitude, longitude, rooms, bathrooms, reachability, beds, city, province, restservice, disable, bikefriendly };

        event.preventDefault();

        /* Hut image loading */
        const imgData = new FormData();
        imgData.append('image', image);
        
        const result = await APIHutForm.postHut(hut); 

        await APIHutForm.addHutImage(imgData, result.id);
          
        navigate("/huts");
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
    
    const objInfo = {hutname,setHutname,address,setAddress,phonenumber,setPhonenumber,
        email,setEmail,website,setWebsite,description,setDescription,setLanguage,setReachability
    };

    const objGeo = {altitude,setAltitude,latitude,setLatitude,longitude,
        setLongitude,setShowModal,city,setCity,province,setProvince
    }; 

    const objServ = {bikefriendly,setBikefriendly,
        restservice,setRestservice,disable,setDisable
    }; 

    const objAcc = {rooms,setRooms,
        beds,setBeds,
        bathrooms,setBathrooms};
    

    return (
        <Container >
            <Container className='below-nav' >
                <Form onSubmit={submitHandler}>
                    
                    <Container className="shadow-sm p-5 w-75" id="cardscontainer">
                        <h4>New Hut</h4>
                        <h6>Fill the form to insert a new Hut</h6>

                        <HutInfo obj={objInfo}/>

                        <HutGeo obj={objGeo}/>

                        <Picture setImage = {setImage} />
                        
                        <Services obj={objServ}/>

                        <Accomodation obj={objAcc}/>

                        <Row align="center" className="mt-3">
                            <Col>
                                <Button type="submit" variant="primary" size="lg"> Submit Form </Button>
                            </Col>
                        </Row>
                       
                    </Container>

                </Form>

                {showModal && <MapModal  obj={{setLongitude, onClickButton,setLatitude, markermap:true,showModal, setShowModal}} type = {"hut"} />}

            </Container>

        </Container>
    ); 
}



export default HutForm;