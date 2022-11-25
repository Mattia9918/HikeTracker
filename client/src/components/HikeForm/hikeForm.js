//import "./src/App.css";
import '../../css/hikeFormCss.css';

import { Col, Form, Button, Row, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

import React from 'react';
import { useState } from 'react';




function HikeForm(props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [estimatedtime, setEstimatedtime] = useState("");
    const [spoint, setSpoint] = useState();
    const [epoint, setEpoint] = useState();
    const [file, setFile] = useState('');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);


    const navigate = useNavigate();

    //When we select the gpx file to upload
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
        console.log(uploadedFile);
        props.postHike(info, uploadedFile.filePath);

        navigate("/");
    }

    //When we click on "Upload" on the gpx file
    const onFileUpload = async e => {

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

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
            const { fileName, filePath, startPointLong, startPointLat, endingPointLong, endingPointLat, totalDistance, totalAscent, difficulty } = res.data;
            setUploadedFile({fileName, filePath, startPointLong, startPointLat, endingPointLong, endingPointLat, totalDistance, totalAscent, difficulty});

            console.log(uploadedFile);

            const startPointInfo = { long: startPointLong, lat: startPointLat };
            const endingPointInfo = { long: endingPointLong, lat: endingPointLat };

            const startpoint = await axios.get('http://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + startPointInfo.lat + '&longitude=' + startPointInfo.long + '&localityLanguage=en');
            const endpoint = await axios.get('http://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + endingPointInfo.lat + '&longitude=' + endingPointInfo.long + '&localityLanguage=en');


            setSpoint(startpoint.data);
            setEpoint(endpoint.data);

            setMessage('File uploaded');
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

    return (
        <Container>

            <Container className='below-nav'>

                <Form onSubmit={submitHandler}>
                    <Container className="shadow-sm p-5 w-75" id="cardscontainer">
                        <Row className='r'>
                            <Col className='c'>
                                <Form.Label>Hike title</Form.Label>
                                <Form.Control value={title} onChange={ev => setTitle(ev.target.value)} type = "text" placeholder="Enter hike title" required />
                            </Col>
                            <Col className='c'>
                                <Form.Label>Hike estimated time</Form.Label>
                                <Form.Control type="number" value={estimatedtime} onChange={ev => setEstimatedtime(ev.target.value)} placeholder="Enter hike estimated time" required />
                                <Form.Text className="text-muted">
                                    Estimation of time in <i>hours</i> required to complete the hike.
                                </Form.Text>
                            </Col>
                        </Row>
                        <Row className='r'>
                            <Col className='f'>
                                <Form.Label>Hike description</Form.Label>
                                <Form.Control as="textarea" rows="3" value={description} onChange={ev => setDescription(ev.target.value)} type = "text" placeholder="Enter hike description" required />
                            </Col>
                        </Row>

                        <Row className='d-block'>
                            <Col className = 'e'>
                                {message ? <Message msg={message} /> : null}
                            </Col>
                        </Row>

                        <Row className='r'>
                            <Col className = 'c'>
                                <input
                                    type='file'
                                    className='custom-file-input'
                                    id='customFile'
                                    onChange={onFileSelected}
                                />
                            </Col>
                        </Row>
                        <Row className='r'>
                            <Col className = 'c'>
                                <Progress percentage={uploadPercentage} />
                            </Col>
                        </Row>
                        
                        <Row className="justify-content-md-center r">
                                <input
                                    type='button'
                                    value='Upload'
                                    className='btn btn-success'
                                    onClick={onFileUpload}
                                />
                        </Row>
                        <hr></hr>

                        <Row>
                            <Col className='e'>
                                <h5>GPX location informations</h5>
                            </Col>
                        </Row>
                        <Row className='r'>
                            <Col className='c'>
                                {uploadedFile ? (

                                    <div>
                                        <b>Starting Point Longitude:</b> {spoint ? spoint.longitude : null} <br></br>
                                        <b>Starting Point Latitude:</b> {spoint ? spoint.latitude : null}<br></br>
                                        <b>Starting Point City:</b> {spoint ? spoint.locality : null}<br></br>
                                        <b>Starting Point Province:</b> {spoint ? spoint.localityInfo.administrative[2].name : null}<br></br>
                                    </div>

                                ) : null}

                            </Col>

                            <Col className='d'>
                                {uploadedFile ? (
                                    <div>
                                        <b>Ending Point Longitude:</b> {epoint ? epoint.longitude : null}<br></br>
                                        <b>Ending Point Latitude:</b> {epoint ? epoint.latitude : null} <br></br>
                                        <b>Ending Point City:</b> {epoint ? epoint.locality : null}<br></br>
                                        <b>Ending Point Province:</b> {epoint ? epoint.localityInfo.administrative[2].name : null}<br></br>
                                    </div>

                                ) : null}
                            </Col>


                        </Row>

                        <Row>
                            <Col className='e'>
                                <h5>Hike estimations</h5>
                            </Col>
                        </Row>

                        <Row>
                            <Col className = 'c'>
                                <b>Total distance:</b> {uploadedFile.totalDistance} (km)<br></br>
                                <b>Total ascent:</b> {uploadedFile.totalAscent} (m)<br></br>
                                <b>Difficulty:</b> {uploadedFile.difficulty}<br></br>
                            </Col>
                        </Row>




                        <hr></hr>
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