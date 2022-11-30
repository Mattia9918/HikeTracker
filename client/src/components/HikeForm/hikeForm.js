//import "./src/App.css";
import '../../css/hikeFormCss.css';

import { Col, Form, Button, Row, Container, ListGroup,ListGroupItem } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

import Message from './Message';
import axios from 'axios';

import React from 'react';
import { useState } from 'react';

import APIHikeForm from '../../API/APIHikeForm';
import APIGpx from '../../API/APIGpx';


import {Text,Number,Area} from '../Form'; 

/*Total ascent/distance + difficulty*/
const Estimation = (props)=>{

    const uploadedFile = props.uploadedFile; 

    return <>
        <h5 className="mx-3">Hike estimations</h5>
        <Row>
            <Col className = 'c'>
                <ListGroup variant="flush">
                    <ListGroupItem>
                            <b>Total distance:</b> {uploadedFile.totalDistance} (km)
                    </ListGroupItem>
                    
                    <ListGroupItem>
                            <b>Total ascent:</b> {uploadedFile.totalAscent} (m)
                    </ListGroupItem>
                    
                    <ListGroupItem>
                        <b>Difficulty:</b> {uploadedFile.difficulty}
                    </ListGroupItem>
                    
                </ListGroup>
            </Col>
        </Row>
        <hr></hr>
    </>;
}

const Stat = (props)=>{

    const {label,point,uploadedFile} = props.obj; 

    return <>{
        uploadedFile ?  
            <ListGroup  className="mt-4 mb-4">
                
                <ListGroupItem >
                    <b>{label} Longitude:</b> {point ? point.longitude : null}
                </ListGroupItem>      

                <ListGroupItem >
                    <b>{label} Latitude:</b> {point ? point.latitude : null}
                </ListGroupItem>

                <ListGroupItem >
                    <b>{label} City:</b> {point ? point.locality : null}
                </ListGroupItem>
                
                <ListGroupItem >
                    <b>{label} Province:</b> {point ? point.localityInfo.administrative[2].name : null}
                </ListGroupItem>
        
               
            </ListGroup>
            :null
        }
        

    </>;
}

/*Start/Ending longitude,latitude,city,province*/
const GpxInfo = (props)=>{

    const {spoint,epoint,uploadedFile} = props.obj; 

    return <>
        <h5 className="mx-3">GPX location informations</h5>
                        
        <Row >
            <Col>
                <Stat obj={{label:"Starting Point",point:spoint,uploadedFile}}/>
            </Col>

            <Col >
                <Stat obj={{label:"Ending Point",point:epoint,uploadedFile}}/>
            </Col>

        </Row>

    </>;
}

/*Titolo + Time + Description*/
const HikeInfo = (props)=>{

    const { title,setTitle,
            description,setDescription,
            estimatedtime,setEstimatedtime
    } = props.obj; 

    return <>
        <Row className='r'>
            <Col className='c'>
                
                <Text obj={{label:"Hike title",text:title,setText:setTitle}}/>
                
            </Col>
            <Col className='c'>

                <Number obj={{label:"Hike estimated time",
                    number:estimatedtime,
                    setNumber:setEstimatedtime,
                    disabled:false}}
                />
                
            </Col>
        </Row>

        <Row className='r'>
            <Col className='f'>
                <Area obj={{
                    label:"Hike description",
                    rows:3,
                    setArea:setDescription,
                    area:description

                }}/>
            </Col>
        </Row>
    </>

}

/*File Part = Alert + BtnFile + BtnUpload*/
const UploadSection = (props)=>{

    const {
        message,
        onFileSelected,
        onFileUpload,
        file
    } = props.obj;

    return <>
        <Row className='d-block'>
            <Col className = 'e'>
                {message ? <Message msg={message} /> : null}
            </Col>
        </Row>

        <Row className='r'>
            <Col className = 'c'>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file"   onChange={onFileSelected}/>
                </Form.Group>
               
            </Col>
        </Row>
            
       

        <Row className="justify-content-md-center r">
                <Button variant="success"
                    onClick={onFileUpload}
                    disabled = {(file ? false : true)}>
                        Upload
                </Button>
        </Row>
        <hr></hr>
    </>
}

function HikeForm(props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [estimatedtime, setEstimatedtime] = useState("");
    const [spoint, setSpoint] = useState();
    const [epoint, setEpoint] = useState();
    const [file, setFile] = useState();
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');


    const navigate = useNavigate();

    const onFileSelected = e => {
        setFile(e.target.files[0]);
    };

    

    const submitHandler = async(event) => {
        const localguideID = props.user.id;
        const length = uploadedFile.totalDistance;
        const ascent = uploadedFile.totalAscent;
        const difficulty = uploadedFile.difficulty;
        const info = { title, length, description, difficulty, estimatedtime, ascent, localguideID, spoint, epoint };

        event.preventDefault();
        
        await APIHikeForm.postHike(info);
        await APIGpx.postGpx(uploadedFile.filePath);
 

        navigate("/");
    }

    const onFileUpload = async e => {

        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                credentials: 'include',
                
            });

            const { fileName, filePath, startPointLong, startPointLat, endingPointLong, endingPointLat, totalDistance, totalAscent, difficulty } = res.data;
            setUploadedFile({fileName, filePath, startPointLong, startPointLat, endingPointLong, endingPointLat, totalDistance, totalAscent, difficulty});


            const startpoint = await APIHikeForm.getInfo({ long: startPointLong, lat: startPointLat })
            const endpoint = await APIHikeForm.getInfo({ long: endingPointLong, lat: endingPointLat })

            setSpoint(startpoint);
            setEpoint(endpoint);

            setMessage('File uploaded');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    return (

    <Container >
        <Container className='below-nav'>
        
            <Form onSubmit={submitHandler}>
                <Container className="shadow-sm p-5 w-75" id="cardscontainer">

                    <h4>New Hike</h4>
                    <h6>Fill the form to insert a new Hike</h6>
                
                    {/*Titolo + Time + Description*/}

                    <HikeInfo obj={{title,
                        setTitle,estimatedtime,
                        setEstimatedtime,description,
                        setDescription}}
                    />
                    

                    {/*File Part = Alert + BtnFile + BtnUpload*/}

                    <UploadSection obj={{
                        message,
                        onFileSelected,
                        
                        onFileUpload,
                        file
                    }}/>
                    

                    {/*Start/Ending longitude,latitude,city,province*/}

                    <GpxInfo obj={{spoint,epoint,uploadedFile}}/>
                    

                    {/*Total ascent/distance + difficulty*/}

                    <Estimation uploadedFile={uploadedFile}/>

                    <Row className="justify-content-md-center r">
                        <Button className="d-flex" type="submit" variant="primary">Submit Form</Button>
                    </Row>

                </Container>

            </Form>


        </Container>
    </Container>
    );
}


export default HikeForm;