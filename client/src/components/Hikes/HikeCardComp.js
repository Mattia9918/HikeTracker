import {  Col, Badge, Alert,ListGroup,ListGroupItem } from 'react-bootstrap';
import {  useState } from 'react';


const AlertUser = (props)=>{

    const [show,setShow] = useState(); 
    const {msg,user,setMsg} = props.obj; 

    const close = ()=>{
        setMsg("");
        setShow(false);
    }

    return <>
     {(msg.message === "You have been logged out!" || (user && msg.message === `Welcome ${user.username}!`)) &&
            <Alert variant={msg.type} onClose={close} show={show} dismissible>
                {msg.message}
            </Alert>
    }
    </>; 
}

const Details = (props)=>{

    
    const start = props.hike.startingPoint; 
    const end = props.hike.endingPoint; 
    
    const {ascent,length,estimatedTime} = props.hike; 
    
    return <>
   
       <b className="d-block mt-0 mb-2 mx-1" align={"left"}>Details:</b>
        <ListGroup >
            
            <ListGroupItem>
                <b align={"center"}>Starting point:</b><br/>
                ({start.city},{start.province})<br/>
                <i>(lat: {start.latitude} - long: {start.longitude})
                </i>
            </ListGroupItem>
            
            <ListGroupItem>
                <b>Ending point: </b><br/>({end.city},{end.province})<br/>
                <i>(lat: {end.latitude} ,long: {end.longitude}) - </i>
                
            </ListGroupItem>
            
            <ListGroupItem>
                <b>Length: </b>{length} km
            </ListGroupItem>
            
            <ListGroupItem>
                <b>Ascent: </b>{ascent} m
            </ListGroupItem>
            
            <ListGroupItem>
                <b>Estimated Time: </b>{estimatedTime} h
            </ListGroupItem>
                                
        </ListGroup>
        
        </>
    
    
    
}

const PostedBy = (props)=>{
    
    return <>
    {/* Localguide's username */}
    <Col xxl={9} xl={8} lg={8} md={6} sm={8} xs={6}>
        <b>Posted by: </b> {props.user}
    </Col>
    </>

}

const Level = (props)=>{

    return <>
        <Col align="right">
            <Badge bg={
                (props.level === "Easy" && "success") ||
                (props.level === "Average" && "warning") ||
                (props.level === "Difficult" && "danger")}>
                {props.level}
            </Badge>
        </Col>
    </>;
}

export {Level,Details,AlertUser,PostedBy}; 