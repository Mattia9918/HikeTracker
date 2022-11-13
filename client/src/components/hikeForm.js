//import "./src/App.css";
import './hikeFormCss.css';

import {Col,Form,Button,Row,Container} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

import React from 'react';
import {useState} from 'react';





function HikeForm(props) {

    const [title, setTitle] = useState("");
    const [length, setLength] = useState("");
    const [description, setDescription] = useState("");
    const [estimatedtime, setEstimatedtime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [ascent, setAscent] = useState("");
    const [spoint, setSpoint] = useState();
    const [epoint, setEpoint] = useState();
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const navigate = useNavigate();

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const submitHandler = (event) => {
        const localguideID = props.user.id;
        const info = { title, length, description, difficulty, estimatedtime, ascent, localguideID, spoint, epoint };

        event.preventDefault();
        props.postHike(info);



        navigate("/");
    }


    const onClickButton = async e => {

        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        console.log(file); 

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                credentials: 'include',
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    );
                }
            });

            console.log("1"); 

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);

            const { fileName, filePath, startPointLong, startPointLat, endingPointLong, endingPointLat } = res.data;

            setUploadedFile({ fileName, filePath, startPointLong,startPointLat, endingPointLong, endingPointLat });

            const startPointInfo = {long: startPointLong, lat: startPointLat};
            const endingPointInfo = {long: endingPointLong, lat: endingPointLat};




            const startpoint = await axios.get('http://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+startPointInfo.lat+'&longitude='+startPointInfo.long+'&localityLanguage=en');
            const endpoint = await axios.get('http://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+endingPointInfo.lat+'&longitude='+endingPointInfo.long+'&localityLanguage=en');

            console.log("2"); 

            setSpoint(startpoint.data);
            setEpoint(endpoint.data);

            console.log(startpoint); 
            setMessage('File Uploaded');
        } catch (err) {
            console.log(err);
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
            setUploadPercentage(0)
        }


    };

    //Installare questi moduli
// npm install @mapbox/togeojson xmldom






    return(
        <Container>
            
            <Container className='below-nav'>


                <h2>New Hike</h2><h4>Fill the form to insert a new Hike</h4>

                <Form onSubmit={submitHandler}>
                    <Row className='r'>
                        <Col className='c'>
                            <Form.Label>Hike title</Form.Label>
                            <Form.Control value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Enter Hike title" required/>
                        </Col>
                        <Col className='c'>
                            <Form.Label>Hike length</Form.Label>
                            <Form.Control value={length} onChange={ev => setLength(ev.target.value)} placeholder="Enter Hike length" required/>
                        </Col>
                    </Row>
                    <Row className='r'>
                        <Col className='c'>
                            <Form.Label>Hike description</Form.Label>
                            <Form.Control value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Enter Hike description" required/>
                        </Col>
                        <Col className='c'>
                            <Form.Label>Hike difficulty</Form.Label><br></br>
                            <Form.Select value={difficulty} onChange={ev => setDifficulty(ev.target.value)} required>
                                <option value=""></option>
                                <option value="Easy">Easy</option>
                                <option value="Average">Medium</option>
                                <option value="Difficult">Hard</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className='r'>
                        <Col className='c'>
                            <Form.Label>Hike estimated time</Form.Label>
                            <Form.Control value={estimatedtime} onChange={ev => setEstimatedtime(ev.target.value)} placeholder="Enter Hike estimated time" required/>
                        </Col>
                        <Col className='c'>
                            <Form.Label>Hike ascent</Form.Label>
                            <Form.Control value={ascent} onChange={ev => setAscent(ev.target.value)} placeholder="Enter Hike ascent" required/>
                        </Col>
                    </Row>
                    <hr></hr>




                    <h3 className='mt-5 '>Hike Gpx file</h3>
                    <h5 className='mb-5 '> Add a gpx file to your hike</h5>
                    <Row className='d-block'>

                        {message ? <Message msg={message} /> : null}
                    </Row>
                    <Row className='r'>
                         <div className='custom-file mb-4'>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                onChange={onChange}
                            />    
                        </div>
                    </Row>
                    <Row className='r'>

                        <Progress percentage={uploadPercentage} />
                    </Row>
                    <Row className='r'>
                        {uploadedFile ? (

                            <div>
                                <h6>Filename: </h6>
                                <h3>{uploadedFile.fileName}</h3>


                            </div>

                        ) : null}

                    </Row>
                    <Row className='r'>
                        <Col className='c'></Col>
                        <Col className='c'></Col>
                        <Col className='c'>
                            <input
                                type='button'
                                value='Upload'
                                className='btn btn-success'
                                onClick={onClickButton}
                            />
                        </Col>
                        <Col className='c'></Col>
                        <Col className='c'></Col>
                    </Row>
                    <Row className='r'>

                        <Col className='c'>
                            {uploadedFile ? (

                                <div>
                                    <h6>Starting Point Longitude: {spoint ? spoint.longitude : null} </h6>
                                    <h6>Starting Point Latitude: {spoint ? spoint.latitude : null}</h6>
                                    <h6>Starting Point City: {spoint ? spoint.locality : null}</h6>
                                    <h6>Starting Point Country: {spoint ? spoint.countryName : null}</h6>
                                </div>

                            ) : null}

                        </Col>

                        <Col className='c'>
                            {uploadedFile ? (

                                <div>
                                    <h6>Ending Point Longitude: {epoint ? epoint.longitude : null}</h6>
                                    <h6>Ending Point Latitude: {epoint ? epoint.latitude : null} </h6>
                                    <h6>Ending Point City: {epoint ? epoint.locality : null}</h6>
                                    <h6>Starting Point Country: {epoint ? epoint.countryName : null}</h6>
                                </div>

                            ) : null}
                        </Col>


                    </Row>




                    <hr></hr>
                    <Row className="justify-content-md-center r">
                        <Button className="d-flex" type="submit" variant="primary">Submit Form</Button>
                    </Row>


                </Form>


            </Container>
        </Container>
        
    );
}


export default HikeForm;