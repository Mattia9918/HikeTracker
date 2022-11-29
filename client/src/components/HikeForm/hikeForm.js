//import "./src/App.css";
import '../../css/hikeFormCss.css';

import { Col, Form, Button, Row, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

import Message from './Message';
import axios from 'axios';

import React from 'react';
import { useState } from 'react';

import APIHikeForm from '../../API/APIHikeForm';

import {Text,Number,Area} from '../Form'; 

const Estimation = (props)=>{

    const uploadedFile = props.uploadedFile; 

    return <>
        <h5 className="mx-3">Hike estimations</h5>
        <Row>
            <Col className = 'c'>
                <b>Total distance:</b> {uploadedFile.totalDistance} (km)<br></br>
                <b>Total ascent:</b> {uploadedFile.totalAscent} (m)<br></br>
                <b>Difficulty:</b> {uploadedFile.difficulty}<br></br>
            </Col>
        </Row>
        <hr></hr>
    </>;
}

const Stat = (props)=>{

    const {label,point,uploadedFile} = props.obj; 

    return <>{
        uploadedFile ?  
            <div className="mb-5">
                
                <div className="mb-2 mx-3 mt-2">
                    <b>{label} Longitude:</b> {point ? point.longitude : null}
                </div>      

                <div className="mb-2 mx-3 mt-2">
                    <b>{label} Latitude:</b> {point ? point.latitude : null}
                </div>
                <div className="mb-2 mx-3 mt-2">
                    <b>{label} City:</b> {point ? point.locality : null}
                </div>
                
                <div className="mb-2 mx-3 mt-2">
                    <b>{label} Province:</b> {point ? point.localityInfo.administrative[2].name : null}
                </div>
        
               
            </div>
            :null
        }
        

    </>;
}

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


    const submitHandler = (event) => {
        const localguideID = props.user.id;
        const length = uploadedFile.totalDistance;
        const ascent = uploadedFile.totalAscent;
        const difficulty = uploadedFile.difficulty;
        const info = { title, length, description, difficulty, estimatedtime, ascent, localguideID, spoint, epoint };

        event.preventDefault();
        
        props.postHike(info, uploadedFile.filePath);

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
        <Container>

            <Container className='below-nav'>

                <Form onSubmit={submitHandler}>
                    <Container className="shadow-sm p-5 w-75" id="cardscontainer">

                        <HikeInfo obj={{title,
                            setTitle,estimatedtime,
                            setEstimatedtime,description,
                            setDescription}}
                        />
                        
                        <UploadSection obj={{
                            message,
                            onFileSelected,
                            
                            onFileUpload,
                            file
                        }}/>
                        
                        <GpxInfo obj={{spoint,epoint,uploadedFile}}/>
                        
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