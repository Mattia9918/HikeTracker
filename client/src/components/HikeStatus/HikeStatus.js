import { useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Form, Table } from 'react-bootstrap';
import APIHikeForm from '../../API/APIHikeForm';
import {Number} from '../Form'; 

function HikeStatusModal(props){
    const type = props.type;
    return (
        type !== "stats" ?  <StartOrTerminateModal showStatusModal = {props.showStatusModal} setShowStatusModal = {props.setShowStatusModal} hike = {props.hike} type = {type}/> :
        <StatsModal showStatusModal = {props.showStatusModal} setShowStatusModal = {props.setShowStatusModal} hike = {props.hike} />
    )
}

function StartOrTerminateModal(props) {

    const curDate = new Date();
    const defaultStartDateTime = curDate.toISOString().split(".")

    const [curPos, setCurPos] = useState();
    const [dateTime, setDateTime] = useState(defaultStartDateTime[0]);

    const type = props.type;

    async function positionInfo() {
        try {
            const {latitude, longitude} = await APIHikeForm.getInfo();
            setCurPos({
                latitude: latitude,
                longitude: longitude
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        positionInfo();
    },
        []
    )

   // async function putHikePoint(point, type) {
   //     try {
   //         const obj = {
   //             hikeid: props.hike.id,
   //             pointid: point.point_id,
   //             latitude: point.latitude,
   //             longitude: point.longitude,
   //         }
   //         await APIHikes.putHikePoint(obj, type);
   //         const updatedHikeInfo = await APIHikes.getHikes();
   //         props.setHikes(updatedHikeInfo);
   //         setMessage({variant: "info", msg: `Your point has been set as ${type} for ${props.hike.title}`});
   //     }
   //     catch(err) {
   //         setMessage({variant: "danger", msg: err.message});
   //     }
   // };

    /* -- RENDERING -- */
    return (
        <Modal size = "lg" show={props.showStatusModal} onHide={() => props.setShowStatusModal({
            isVisible: false,
            type: undefined
        })}>

            {/* Modal header */}
            <Modal.Header closeButton>

                <Modal.Title>
                    {props.hike.title}
                </Modal.Title>

            </Modal.Header>

            {/* Modal body */}
            <Modal.Body >
                {
                    type === "start" && <StartModalBody hike = {props.hike} curPos = {curPos} dateTime = {dateTime} setDateTime = {setDateTime}/>||
                    type === "terminate" && <TerminateModalBody hike = {props.hike} curPos = {curPos} dateTime = {dateTime} setDateTime = {setDateTime} />
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant = {type === "start"? "success" : "danger"}>{type === "start"? "Start hike" : "Terminate hike"}</Button>
                <Button variant = "secondary" onClick = {() => props.setShowStatusModal({
                    isVisible: false,
                    type: undefined
                 }
                )}>Close</Button>
            </Modal.Footer>

        </Modal>
    );
};

function StartModalBody(props) {
    return (
        <>
            <Row className = "ms-2">
                By clicking on the "start" button you will start the hike, and you'll be able to track your trip
                until clicking on the "terminate hike" button. If you really want to start the hike, check your initial 
                tracking informations!
            </Row>    
            <hr className = "mt-3"></hr>
            <Row>
                <Col>
                    <Number obj={{
                        label:"Your current latitude",
                        number: props.curPos && props.curPos.latitude,
                        disabled: true,
                    }}/>
                </Col>
                <Col>
                    <Number obj={{
                        label:"Suggested starting point latitude",
                        number: props.hike.startingPoint.latitude,
                        disabled: true,
                    }}/>
                </Col>
            </Row> 
            <Row>
                <Col>
                    <Number obj={{
                        label:"Your current longitude",
                        number: props.curPos && props.curPos.longitude,
                        disabled: true,
                    }}/>
                </Col>
                <Col>
                    <Number obj={{
                        label:"Suggested starting point longitude",
                        number: props.hike.startingPoint.longitude,
                        disabled: true,
                    }}/>
                </Col>
            </Row>    
            <Row>
                <Col xs = {6}>
                <Form.Label>Starting date and time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={props.dateTime}
                    onChange={(e) => props.setDateTime(e.target.value)}
                />

                </Col>
            </Row>  
        </>
    );
};

function TerminateModalBody(props) {
    return (
        <>
            <Row className = "ms-2">
                By clicking on the "terminate" button you are going to terminate this hike, and you'll be not anymore able to track your trip
                until restarting the same, or a new hike, by clicking on the "Start hike" button.
            </Row>    
            <hr className = "mt-3"></hr>
            <Row>
                <Col>
                    <Number obj={{
                        label:"Your current latitude",
                        number: props.curPos && props.curPos.latitude,
                        disabled: true,
                    }}/>
                </Col>
                <Col>
                    <Number obj={{
                        label:"Suggested ending point latitude",
                        number: props.hike.endingPoint.latitude,
                        disabled: true,
                    }}/>
                </Col>
            </Row> 
            <Row>
                <Col>
                    <Number obj={{
                        label:"Your current longitude",
                        number: props.curPos && props.curPos.longitude,
                        disabled: true,
                    }}/>
                </Col>
                <Col>
                    <Number obj={{
                        label:"Suggested ending point longitude",
                        number: props.hike.endingPoint.longitude,
                        disabled: true,
                    }}/>
                </Col>
            </Row>    
            <Row>
                <Col xs = {6}>
                <Form.Label>Ending date and time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={props.dateTime}
                    onChange={(e) => props.setDateTime(e.target.value)}
                />

                </Col>
            </Row>  
        </>
    );
};

function StatsModal (props) {

    const hikeId = props.hike.id;
    let count = 0;
    const [myStats, setMyStats] = useState([]);

    async function getMyStats(hikeId) {
        try {
            
            const statsArray = [
            //*********** HARDCODED **************
                {
                    start_time: "25-12-2022 13:39:42",
                    end_time: "25-12-2022 14:15:23"
                },
                {
                    start_time: "28-12-2022 13:39:42",
                    end_time: "28-12-2022 14:15:23"
                },
                {
                    start_time: "31-12-2022 13:39:42",
                    end_time: "31-12-2022 14:15:23"
                },
                {
                    start_time: "25-01-2023 13:39:42",
                    end_time: "25-01-2023 14:15:23"
                }
            /* *********************************** */
            ]

            setMyStats(statsArray);
        }
        catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getMyStats(1)
    }, [])

    return (
        <Modal show={props.showStatusModal} onHide={() => props.setShowStatusModal({
            isVisible: false,
            type: undefined
        })}>

            {/* Modal header */}
            <Modal.Header closeButton>

                <Modal.Title>
                    {props.hike.title}
                </Modal.Title>

            </Modal.Header>

            {/* Modal body */}
            <Modal.Body >
                {
                    myStats.length === 0 ? "Still nothing to see here. Start the hike to record your stats!" :
                    <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Trip n°</th>
                            <th>Starting time</th>
                            <th>Ending time</th>
                          </tr>
                        </thead>
                        <tbody>
                            {myStats.map((stat) => <StatsRow key = {stat.id} stat = {stat} count = {++count}/>)}
                        </tbody>
                 </Table>
                }


            </Modal.Body>

            <Modal.Footer>

                <Button variant = "secondary" onClick = {() => props.setShowStatusModal({
                    isVisible: false,
                    type: undefined
                 }
                )}>Close</Button>
            </Modal.Footer>

        </Modal>
    );
}

function StatsRow (props) {
    return (
        <tr>
          <td>{props.count}</td>
          <td>{props.stat.start_time}</td>
          <td>{props.stat.end_time? props.stat.end_time : "in progress..."}</td>
        </tr>
    );
}

export { HikeStatusModal }; 